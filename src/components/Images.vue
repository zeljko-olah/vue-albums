<template>
  <section class="images">

    <!-- LOADING MODAL -->
    <modal
      v-if="loading"
      title="Loading"
      overlayColor="rgba(255,255,255, 0.5)">
      <loading/>
    </modal>

    <div class="images__wrapper" v-else>

      <!-- TITLE INFO -->
      <div class="images__header">

        <!-- SHOW ALL IMAGES IF THERE IS NO ALBUM ID  -->
        <h1 v-if="!$route.params.albumId" class="main-headline images__title">
          All Images
        </h1>

        <!-- ELSE SHOW ALBUM TITLE -->
        <h1 v-else class="main-headline images__title">
          Album
          <em><span v-if="currentAlbum">"{{ currentAlbum.title | capitalize | allowNameLength(40) }}"</span></em>
          by
          <!-- SHOW USER TO WHICH ALBUM PERTAINS -->
          <router-link :to="userAlbumsRoute">
            <span>{{ username }}</span>
          </router-link>
          <!-- SHOW NUMBER OF IMAGES IN CURRENT ALBUM-->
          ({{ albumImages.length }}
          <template v-if="albumImages.length > 1">images</template>
          <template v-else>image</template>)
        </h1>

        <!-- NAVIGATION BUTTONS -->
        <div class="images__actions">
          <!-- SHOW THIS WHEN THERE IS CURRENT ALBUM-->
          <!-- NAVIGATE TO ALBUMS -->
          <button
          v-if="currentAlbum.title"
          @click="$router.push(userAlbumsRoute)"
          class="button images__button--navigation">Albums</button>
          <!-- NAVIGATE TO USERS -->
          <button
          v-if="currentAlbum.title"
          @click="$router.push({ name: 'users' })"
          class="button images__button--navigation">Users</button>

          <!-- SHOW THIS FOR ALL ALBUMS -->
          <template v-else>
            <!-- NAVIGATE TO ALL ALBUMS -->
            <button
            class="button images__button--navigation"
            @click="$router.push({ name: 'allalbums' })"
            >Albums</button>
            <!-- RANDOMLY LOAD NEW IMAGES -->
            <button
              @click="randomize"
              class="button images__button--navigation">Random</button>
          </template>
        </div>
      </div>

      <!-- IMAGES LIST -->
      <div v-if="!loading" class="images__names">
        <ul class="images__list">
          <li v-for="(image, index) in paginatedImages" class="images__items">
            <img
              :src="image.thumbnailUrl"
              @click="showImageModal(image, index)"
              class="images__photo"
              alt="image.title">
            <i
              v-if="currentUser && $route.params.albumId"
              @click="prepareDelete(image)"
              class="images__icon--delete icons material-icons">delete</i>
          </li>
        </ul>
      </div>

      <!-- PAGINATION -->
      <paginate
        v-if="images"
        :items="albumImages"
        @paginate="paginated"
        @deleteList="deleteEmptyAlbum"
      ></paginate>

    </div>

    <!-- DELETE DIALOG -->
    <transition name="fade">
      <Dialog
        v-if="showDialog"
        @ok="deleteImageConfirmed"
        @canceled="showDialog = false"
        title="Confirm Deletion"
        confirm="Ok"
        cancel="Cancel">
        <!-- SLOT CONTENT -->
        <p>Do you really want to delete <strong>{{ itemToDelete.title }}</strong>?</p>
      </Dialog>
    </transition>

      <!-- MODAL IMAGE ZOOM -->
    <transition name="zoom">
      <Modal
        v-if="showModal"
        :show="showModal"
        @canceled="showModal = false"
        :details="this.clickedImage.id"
        :title="this.clickedImage.title | capitalize"
        icon="close">
        <img :src="this.clickedImage.url" :alt="this.clickedImage.title">
      </Modal>
    </transition>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['albumId'],
  data () {
    return {
      // store 10 images to display from paginate component
      paginatedImages: [],
      // show delete dialog
      showDialog: false,
      // show image modal
      showModal: false,
      // store image to delete
      itemToDelete: null,
      // store details about clicked image for display it in modal
      clickedImage: null
    }
  },
  computed: {
    ...mapGetters([
      // get al users
      'users',
      // get all albums
      'albums',
      // get all images
      'images',
      // get 100 random images
      'randomImages',
      // get current album
      'currentAlbum',
      // get current user
      'currentUser',
      // get loading indicator
      'loading'
    ]),
    // images to show on the page
    albumImages () {
      // if there is no album id
      if (!this.albumId) {
        // load random images
        return this.randomImages
      } else {
        //  elseload all images with albumId
        return this.images.filter((image) => {
          return image.albumId === Number(this.albumId)
        })
      }
    },
    // route to user albums or all albums
    userAlbumsRoute () {
      // if there is a current album
      if (this.currentAlbum) {
        return { name: 'albums', params: { userId: this.currentAlbum.userId } }
      // for a backup solution go to all albums route
      } else {
        return { name: 'allalbums' }
      }
    },
    // find username the current album user
    username () {
      let id = this.currentAlbum.userId
      if (this.users) {
        return this.users.find(user => {
          return user.id === id
        }).username
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (!to.query.page) {
        this.fetchAllImages()
      }
      // if user tries to manually enter invalid :albumId or query parameter
      if (to.params.albumId && !to.query.page) {
        if (!this.albums.find(album => album.id === to.params.userId)) {
          // redirect them to users page
          this.$router.replace({ name: 'users' })
        }
      }
    }
  },
  methods: {
    ...mapActions([
      // fetch al images
      'fetchAllImages',
      // fetch just images from current album
      'fetchAlbumImages',
      // delete image
      'deleteImage',
      // delete album if there are no images left
      'deleteAlbum',
      // remember the current pagantion page whem image is deleted
      // to restore it when images are load again
      'currentPaginatePage'

    ]),
    // receive first 10 paginated items and store them on this component
    paginated (payload) {
      if (payload) {
        this.paginatedImages = payload
      }
    },
    // prepare for delete when clicked on delete icon
    prepareDelete (image) {
      // show dialog
      this.showDialog = true
      // store the image to temporary data variable
      this.itemToDelete = image
    },
    // delete image when ok event is received from dialog component
    deleteImageConfirmed () {
      // dispach an action
      this.deleteImage(this.itemToDelete)
      // store the current pagination page
      this.currentPaginatePage(this.$route.query.page)
      // close dialog
      this.showDialog = false
      // reset temporati data variable itemToDelete
      this.itemToDelete = null
    },
    // delete album only when no images are left
    deleteEmptyAlbum () {
      // prepare payload
      let payload
      if (this.currentUser) {
        payload = {
          albumId: this.albumId,
          userId: this.currentUser.id
        }
      }
      // dispatch delete album action
      this.deleteAlbum(payload)
      // redirect back to user albums
      this.$router.push({ name: 'albums', params: { userId: this.currentUser.id } })
    },
    // show image modal and set image details to display them
    showImageModal (image, index) {
      this.showModal = true
      this.clickedImage = image
    },
    // triger fetch all images to randomize them inside the store
    randomize () {
      this.fetchAllImages()
    }
  },
  created () {
    // if there is no album
    if (!this.albumId) {
      // fetch all images
      this.fetchAllImages()
      // route for all images
      this.$router.replace({ name: 'allimages' })
    } else {
      // fetch just images for given album
      this.fetchAlbumImages(this.albumId)
      // route for images which belong to a given album
      this.$router
      .replace({ name: 'images', params: { albumId: this.currentAlbum.id } })
    }
  },
  // Store current album in local storage for data persistence in case of browser refresh
  beforeUpdate () {
    if (Object.keys(this.currentAlbum).length) {
      localStorage.setItem('albumId', JSON.stringify(this.currentAlbum))
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.images
  width: 900px;
  height: 85vh
  overflow-x: hidden
  overflow-y: scroll
  white-space: wrap;
  -ms-overflow-style: none;  // IE 10+
  overflow: -moz-scrollbars-none;  // Firefox
  &::-webkit-scrollbar
    display: none;  // Safari and Chrome

  &__wrapper
    display flex
    flex-direction column

  &__header
    display: flex;
    flex-direction column
    align-items: top
    justify-content space-between
    margin-top: 10rem;
    margin-bottom: 1rem;
    @media screen and (max-width: 1502px)
      margin-top: 5rem;
    @media screen and (max-width: 1502px) and (min-height: 992px)
      margin-top: 15rem;
    @media screen and (max-width: 992px)
      margin-top: 4rem;
      margin-bottom: 1.5rem;
    @media screen and (max-width: 576px)
      order -1

  &__title
    margin: 0;
    flex 70% 0 0
    order 0
    & span
      color $md-pink-a200
    @media screen and (max-width: 992px)
      margin-left: 2rem;
    @media screen and (max-width: 576px)
      margin-left: 1rem;

  &__actions
    order -1
    margin-left: auto;

  &__button--navigation
    margin-bottom: .5rem;

  &__names
    width: 100%;
    height 350px
    max-width 900px
    margin 0 auto
    @media screen and (max-width: 576px)
      order 1

  &__list
    list-style-type none
    @media screen and (max-width: 576px)
      padding: 0;
      margin: 0;
    @media screen and (max-width: 992px)
      padding: 1rem;

  &__items
    width 18%
    height @width
    position relative
    display inline-block
    font-size 1rem
    font-style: italic;
    padding 0
    margin 1% 1% 0
    color $md-pink-a200
    cursor pointer
    transition all .2s ease-out
    @media screen and (max-width: 576px)
      width 44%
      margin 3% 3% 0

    &:before,
    &:after
      position: absolute;
      z-index: -2;
      content ""
      width: 50%;
      height: 20%;
      max-width: 300px;
      max-height: 100px;
      box-shadow 0 15px 10px rgba(0,0,0, .5)
    &:before
      bottom: 15px;
      right: 10px;
      transform skew(15deg) rotate(6deg)
    &:after
      bottom: 15px;
      left: 10px;
      transform skew(-15deg) rotate(-6deg)
    &:hover
      transform scale(1.1)

  &__photo
    width 100%
    display block
    &:hover + .images__icon--delete
      opacity: 1
      color $md-pink-50

  &__icon--delete
    position absolute
    top .5rem
    right .5rem
    color transparent
    opacity 0
    transition all .3s ease-in
    &:hover
      opacity 1
      color $md-pink

</style>
