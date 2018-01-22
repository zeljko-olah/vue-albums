<template>
  <div id="app">

    <!-- HEADER -->
    <AppHeader
    :hideMenu="hideMenu"
    @toggled="updateHideMenu" />

    <!-- MAIN CONTENT -->
    <div class="app__container">
      <main class="app__page">
        <transition name="slide" mode="out-in">
          <router-view />
          <!-- <router-view :key="$route.fullPath" /> -->
        </transition>
      </main>
    </div>

    <!-- FOOTER -->
    <AppFooter />

  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      // add a feature to click on widow document object to close mobile menu
      hideMenu: false
    }
  },
  computed: {
    // get authorized user from the store or null if not set
    authorizedUser () {
      return this.$store.getters.authorizedUser
    }
  },
  watch: {
    // watch authorized user and redirect to home page immediately if there's none
    authorizedUser (value) {
      if (value === null) {
        this.$router.replace({ name: 'home' })
      }
    }
  },
  methods: {
    // listen for emitted event "@toggled" from header component to update hideMenu data property
    updateHideMenu (payload) {
      this.hideMenu = payload
    }
  },
  created () {
    // fetch users to start with
    this.$store.dispatch('fetchUsers')

    /* DATA PERSISTANCE */
    // if there is no authorized user look in local storage to find one
    if (!this.authorizedUser) {
      let payload = JSON.parse(localStorage.getItem('guestUser'))
      // log user in if there is one
      this.$store.dispatch('authorize', payload)
    }
    // set current user if find one in llocal storage
    if (!this.currentUser) {
      let payload = JSON.parse(localStorage.getItem('userId'))
      this.$store.dispatch('setCurrentUser', payload)
    }
    // set current album if ther is one in local storage
    if (!this.currentAlbum) {
      let payload = JSON.parse(localStorage.getItem('albumId'))
      this.$store.dispatch('setCurrentAlbum', payload)
    }
    // on created hook listen to clicks on documment to close the menu if open
    window.document.addEventListener('click', () => {
      if (!this.hideMenu) {
        this.hideMenu = true
      }
    })
  }
}
</script>

<style lang="stylus">
@import './styles/imports'


.app
  &__container
    background  linear-gradient($md-teal-50, transparent 90%), linear-gradient(0deg, $md-pink-50, transparent), $color-primary
    z-index 0
    padding 0
    @media screen and (min-width: 992px)
      background  linear-gradient($md-teal-50, transparent 90%), linear-gradient(0deg, $md-pink-50, transparent), $color-primary url('http://blog.art.com/artwiki/wp-content/uploads/2014/12/vw.jpg')
      background-size cover
      background-repeat: no-repeat;

  &__page
    max-width $page-size
    min-height calc(100vh - 52px)
    display flex
    align-items center
    justify-content center
    margin auto
    padding 12px
    box-sizing border-box
    @media screen and (max-width: 576px)
      min-height calc(100vh - 65px)

.slide-enter-active
    animation: slide-in 200ms ease-out forwards;

.slide-leave-active
    animation: slide-out 200ms ease-out forwards;


@keyframes slide-in
    from
        transform: translateY(-30px);
        opacity: 0;

    to
        transform: translateY(0);
        opacity: 1;

@keyframes slide-out
    from
        transform: translateY(0);
        opacity: 1;

    to
        transform: translateY(-30px);
        opacity: 0;

</style>
