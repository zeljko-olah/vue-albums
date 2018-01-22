<template>
  <section class="albums">

    <!-- MODAL LOADING -->
    <modal
      v-if="loading"
      title="Loading"
      overlayColor="rgba(255,255,255, 0.5)">
      <loading/>
    </modal>

    <div v-if="!loading">

      <div class="albums__names">

      <div class="albums__header">
          <!-- TITLE -->
        <h1 v-if="this.userId" class="main-headline albums__title"> <span v-if="userAlbums">{{ userAlbums.length }}</span> Albums by
          <strong v-if="username && !userById">{{ username }}</strong>
          <strong v-else>{{ nameByUserId }}</strong>
        </h1>
        <h1 v-else class="main-headline albums__title">All Albums</h1>

        <div class="spacer"></div>

        <!-- SEARCH ALBUMS - SEARCH COMPONENT -->
        <app-search
          placeholder="Search Albums"
          title="Search Albums"
          icon="search"
          :error="hasError"
        ></app-search>

        <!-- BACK TO USERS BUTTON -->
        <button
        @click="$router.push({ name: 'users' })"
        class="button albums__button--navigation">Users</button>
      </div>

        <!-- ALBUMS LIST -->
        <ul class="albums__list">
          <li
            v-for="(album, index) in searchedAlbum"
            :key="album.title"
            class="albums__items"
            :style="randomFontSize(index)"
            :title="album.title">
            <router-link
              :to="{ name: 'images', params: { albumId: album.id } }"
              @click.native="storeCurrentAlbum(album)">{{ album.title | capitalize | allowNameLength }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </section>

</template>

<script>
// to call more getters and actions we use mapGetters and mapActions methods
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userId'],
  computed: {
    ...mapGetters([
      // list of albums that match the search term
      'searchedAlbum',
      // all albums
      'albums',
      // albums pertaining to a particular user
      'userAlbums',
      // list of users
      'users',
      // current selected user
      'currentUser',
      // check whether to showloading animation
      'loading'
    ]),
    // extract username from current user
    username () {
      if (this.currentUser) {
        return this.currentUser.username
      // or return empty string
      } else {
        return ''
      }
    },
    // find user by id
    userById () {
      if (this.users) {
        let user = this.users.find(user => user.id === Number(this.userId))
        return user
      }
    },
    // extract username from all users list by user id
    nameByUserId () {
      if (this.userId && this.users) {
        let user = this.users.find(user => user.id === Number(this.userId))
        return user.username
        // or return empty string if none is found
      } else {
        return ''
      }
    },
    // if there are no albums matching search term then bind error class
    hasError () {
      if (this.searchedAlbum) {
        return this.searchedAlbum.length === 0
      }
    }
  },
  watch: {
    // watch route when changes
    '$route' (to) {
      // if there is no userId in url paramenters then fecth all albums
      if (!to.params.userId) {
        this.fetchAllAlbums()
      // othervise if there is no current user set, replace route to all albums
      } else if (!this.currentUser) {
        this.$router.replace({ name: 'allalbums' })
      }
    }
  },
  methods: {
    ...mapActions([
      // fetch all albums
      'fetchAllAlbums',
      // fetch album from the selected user
      'fetchUserAlbum',
      // set current album for later use
      'setCurrentAlbum',
      // store the search term
      'searchTerm'
    ]),
    // randomize list items font size beetwen 1-2 rem
    randomFontSize (index) {
      let fontSize = Math.random() + 1
      return `fontSize: ${fontSize}rem`
    },
    // set current album when clicked on
    storeCurrentAlbum (album) {
      // dispatch action set the current album
      this.setCurrentAlbum(album)
      // dispatch action to clear search field
      this.searchTerm('')
    }
  },
  // fetch albums when component is created hook
  created () {
    // if there is no userId then fetch all albums
    if (!this.userId) {
      this.fetchAllAlbums()
      // othervise fetch only album from particular user
    } else {
      this.fetchUserAlbum(this.userId)
    }
  },
  // before update hook
  beforeUpdate () {
    // if there is current user, store the user in local storage to persist data after browser refresh
    if (this.currentUser) {
      localStorage.setItem('userId', JSON.stringify(this.currentUser))
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.albums
  width: 900px
  height: 81vh
  overflow-x: hidden
  overflow-y: scroll
  white-space: wrap
  -ms-overflow-style: none  // IE 10+
  overflow: -moz-scrollbars-none  // Firefox
  &::-webkit-scrollbar
    display: none  // Safari and Chrome

  &__header
    display: flex
    justify-content space-between
    align-items: center
    margin-top: 5rem
    @media screen and (max-width: 768px)
      flex-direction column
    @media screen and (max-width: 992px)
      margin-top: 4rem

  &__title
    flex 40% 0 0
    text-align: left

  &__names
    margin 0 auto

  &__list
    list-style-type none
    @media screen and (max-width: 992px)
      padding: 0
      margin-left: 1rem;

  &__items
    display inline-block
    font-size 1rem
    font-weight: 100
    padding 1rem
    margin .5rem
    background-color $md-teal-50
    color $md-pink-a200
    box-shadow 1px 1px 3px black
    border-left 3px solid $md-teal-600
    cursor pointer
    transition all .2s ease-out
    @media screen and (max-width: 576px)
      padding .3rem
      margin .2rem
    @media screen and (min-width: 576px) and (max-width: 768px)
      padding .6rem
      margin .4rem
    @media screen and (min-width: 768px) and (max-width: 992px)
      padding .8rem
      margin .5rem

    &:hover
      background-color: $md-teal-100
      transform scale(1.1)

  &__button--navigation
    flex 10% 0 0
    order 1
    background-color: transparent
    transition all .3s
    &:hover
      background-color: $md-teal-a100
    @media screen and (max-width: 768px)
      order -1

</style>
