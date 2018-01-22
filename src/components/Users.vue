<template>
  <!-- USERS COMPONENT -->
  <section class="users">
    <!-- LOADING ANIMATION IN MODAL WINDOW -->
    <modal
      v-if="loading"
      title="Loading"
      overlayColor="rgba(255,255,255, 0.8)">
      <loading/>
    </modal>
    <!--MAIN CONTENT  -->
    <div class="users__usernames" v-else>

      <!-- TITLE -->
      <h1 class="main-headline users__title">Users</h1>

      <!-- LIST OF USERS -->
      <ul class="users__list" v-if="users">
        <li
          v-for="(user, index) in users"
          @click="setCurrentUser(user, index)"
          :key="user.id"
          :style="randomFontSize(index)"
          class="users__items">

          <!-- LINK TO ALBUMS OF SELECTED USER -->
          <router-link :to="{ name: 'albums', params: { userId: user.id } }">
            {{ user.username }}
          </router-link>
        </li>
      </ul>
    </div>
  </section>

</template>

<script>
export default {
  computed: {
    // get users list from the store
    users () {
      return this.$store.getters.users
    },
    // check if app is loading any async code and if yes show animation
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    // different size od each list item effect
    randomFontSize (index) {
      let multiplyBy = 2
      window.innerWidth >= 992 ? multiplyBy = 2 : multiplyBy = 1.5
      let fontSize = Math.random() * multiplyBy + 1
      return `fontSize: ${fontSize}rem`
    },
    // remember the selected user as currentUser
    setCurrentUser (user, index) {
      this.$store.dispatch('setCurrentUser', user)
    }
  },
  created () {
    // when the component is created fetch all users
    this.$store.dispatch('fetchUsers')
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.users

  &__title
    margin-top: 5rem;

  &__usernames
    max-width 700px
    margin 0 auto

  &__list
    list-style-type none

  &__items
    display inline-block
    font-size 2rem
    padding 1rem
    margin .5rem
    background-color $md-teal-50
    color $md-pink-a200
    border-left 3px solid $md-teal-600
    box-shadow 1px 1px 3px black
    cursor pointer
    transition all .2s ease-out
    @media screen and (max-width: 576px)
      font-size 1rem
      padding .5rem
      margin .2rem

    &:hover
      background-color: $md-teal-100;
      transform scale(1.1) translateX(-10px)

</style>
