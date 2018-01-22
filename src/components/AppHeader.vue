<template>
  <header class="header">
    <div class="header__container">
      <div class="header__content">
        <!-- SITE LOGO -->
        <div class="header__brand">
          <h1 class="header__brand-title">
            <i class="material-icons icon header__logo">collections</i>
            <router-link :to="{ name: 'home' }">Vue Albums</router-link>
          </h1>
        </div>

        <!-- MOBILE MENU ICON -->
        <transition name="zoom" mode="out-in">
          <i key="open" v-if="menuHidden" @click.stop="toggleMobileMenu" ref="navIcon" class="header__mobile-icon icon material-icons">menu</i>
          <i key="close" v-else @click.stop="toggleMobileMenu" ref="navIcon" class="header__mobile-icon icon material-icons">close</i>
        </transition>

        <!-- SIMPLE MENU -->
        <div
          class="header__nav-wrapper"
          :class="{'header__nav-wrapper--hidden-mobile': menuHidden}">

          <!-- USER MENU -->
          <div class="header__login">
            <transition name="zoom" mode="out-in">

              <!-- WELCOME MESSAGE -->
              <span key="name" v-if="authorizedUser && authorizedUser !== 'undefined'" class="header__welcome-message">
                Welcome {{ authorizedUser.name | capitalize }}
                <i class="icon material-icons">accessibility</i>

              </span>

              <!-- OR SIGNIN MESSAGE -->
              <span key="please" v-else class="header__welcome-message">Please Sign in</span>
            </transition>

            <!-- AUTH -->
            <ul class="header__login-menu">
              <!-- LOGOUT BUTTON -->
              <li v-if="authorizedUser" @click="logout" class="header__login-items">
                <i class="material-icons icon">power_settings_new</i>
                <a>Logout</a>
              </li>
              <!-- LOGIN BUTTON -->
              <li v-else @click="login" class="header__login-items">
                <i class="material-icons icon">perm_identity</i>
                <a>Login</a>
              </li>
            </ul>
          </div>

          <!-- NAVIGATION MENU -->
          <nav class="header__menu">
            <ul class="header__nav">
              <!-- USERS -->
              <li class="header__nav-items">
                <router-link @click.native="resetCurrent" :to="{ name: 'users' }">
                <i class="header__nav-icons material-icons icon">account_circle</i>
                Browse Users</router-link>
              </li>
              <!-- ALBUMS -->
              <li class="header__nav-items">
                <router-link @click.native="resetCurrent" :to="{ name: 'allalbums' }">
                <i class="header__nav-icons material-icons icon">search</i>
                All Albums</router-link>
              </li>
              <!-- IMAGES -->
              <li class="header__nav-items">
                <router-link @click.native="resetCurrent" :to="{ name: 'allimages' }">
                <i class="header__nav-icons material-icons icon">camera_alt</i>
                Random Images</router-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- DIALOG LOGIN COMPONENT -->
    <transition name="fade">
      <Dialog
        v-if="showDialog"
        @canceled="closeLoginDialog"
        @ok="authorize"
        title="Enter Your Name and Email"
        confirm=""
        cancel="Close">
        <!-- FORM INSIDE DIALOG -->
        <AppForm
          v-if="!authorizedUser"
          :alert="alert"
          title="Unlock Your Images"
          icon="vpn_key"
          key="form"
          submitButton="Submit"
          @clearForm="$store.dispatch('setAlert', '')"
          @submited="authorize"
        >
          <!-- SLOT FIELDS -->

          <!-- NAME INPUT -->
          <input
            v-model="user.name"
            @keyup="$store.dispatch('setAlert', '')"
            class="login-form__input"
            type="text"
            name="name"
            placeholder="Name">
          <!-- EMAIL INPUT -->
          <input
            v-model="user.email"
            @keyup="$store.dispatch('setAlert', '')"
            class="login-form__input"
            type="text"
            name="email"
            placeholder="Email">
        </AppForm>
        </div>
      </Dialog>
    </transition>
  </header>

</template>

<script>
// Validate function from utils
import { validate } from '../utils/validate'

export default {
  props: ['hideMenu'],
  data () {
    return {
      // dialog open trigger
      showDialog: false,
      menuHidden: true,
      // user object to store name and email
      user: {}
    }
  },
  computed: {
    // get user from the store
    authorizedUser () {
      return this.$store.state.authorizedUser
    },
    // get alert message if any
    alert () {
      return this.$store.getters.alert
    }
  },
  watch: {
    hideMenu (value) {
      this.menuHidden = this.hideMenu
    }
  },
  methods: {
    // clear current data when clicked on general navigation
    resetCurrent () {
      // clear dat on the store
      this.$store.dispatch('resetCurrentData')
      // remove data from localStorage
      localStorage.removeItem('userId')
      localStorage.removeItem('albumId')
    },
    // when clicked on login
    login () {
      // clear any posible name and email from previous entry
      this.user.name = ''
      this.user.email = ''
      // show dialog form
      this.showDialog = true
      // clear any remaining alerts if any
      this.$store.dispatch('setAlert', '')
    },
    // when clicked on logout button
    logout () {
      // clear user on the stor
      this.$store.dispatch('clearUser')
      // clear all fields
      this.user.name = ''
      this.user.email = ''
    },
    // when clicked on submit button
    authorize () {
      // store name and email in variables
      let name = this.user.name || ''
      let email = this.user.email || ''
      // validate fields and if not valid do not allow submit
      if (!validate(name, email)) {
        return
      }
      // if validation is succesfull prepare newUser object
      let newUser = this.user
      // set newUser on the store
      this.$store.dispatch('authorize', newUser)
      // clear any remaining alert if any
      this.$store.dispatch('setAlert', '')
      // close the dialog
      this.showDialog = false
      this.$refs.navIcon.click()
    },
    closeLoginDialog () {
      this.showDialog = false
      this.$store.dispatch('setAlert', '')
    },
    toggleMobileMenu () {
      this.menuHidden = !this.menuHidden
      this.$emit('toggled', this.menuHidden)
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/imports'

.header
  position: relative

  &__mobile-icon
    position: fixed
    right: .8rem
    top: .8rem
    z-index: 11
    font-size: 2rem !important
    color $md-pink-a200
    cursor pointer
    @media screen and (min-width: 992px)
      visibility hidden

  &__container
    width: 100%
    height 100px
    position: fixed
    top: 0
    left: 0
    right: 0
    z-index 10
    background $md-teal-900
    box-shadow 0px 3px 3px 1px #333
    margin 0
    @media screen and (max-width: 992px)
      height auto

  &__content
    max-width 1200px
    position relative
    h-box()
    justify-content space-between
    margin 0 auto
    @media screen and (max-width: 992px)
      v-box()

  &__logo
    position absolute
    top 1.7rem
    left 1rem
    font-size 3rem !important
    color $color-primary
    @media screen and (max-width: 992px)
      top 0.5rem
      left 1rem
    @media screen and (max-width: 576px)
      top 1rem
      left 1rem
      font-size 2rem !important

  &__brand
    position: relative
    @media screen and (max-width: 992px)
      width: 50%
      margin: 0 auto
    @media screen and (max-width: 576px)
      width: 80%

  &__brand-title
    color $md-teal-100
    font-family 'Fredericka the Great', cursive
    line-height 100px
    margin: 0 0 0 5rem
    text-shadow: 5px 2px 3px rgba(0,0,0, .7)
    @media screen and (max-width: 992px)
      display: inline-block
      line-height 60px
    @media screen and (max-width: 576px)
      font-size 2rem
      margin: 0 0 0 4rem

  &__nav-wrapper
    height 200px
    display flex
    flex-direction column
    margin-right: 2rem
    overflow hidden
    transform translateX(0px)
    transition all .5s cubic-bezier(.75,-0.5,0,1.75)
    @media screen and (max-width: 992px)
      margin-right: 0rem
    @media screen and (min-width: 576px)
      height 100px
      display block

    &--hidden-mobile
      @media screen and (max-width: 992px)
        height 0
        transform translateX(-300px)
        pointer-events none

  &__login
    display flex
    flex-direction row
    justify-content flex-end
    margin: .5rem 0
    @media screen and (max-width: 992px)
      justify-content center
    @media screen and (max-width: 576px)
      flex-direction column
      display: block
      text-align: center
      margin 0

  &__login-menu
    list-style none
    display flex
    flex-direction row
    justify-content flex-end
    margin 0
    @media screen and (max-width: 576px)
      flex-direction column
      padding: 0

  &__welcome-message
    position: relative
    display: inline-block
    flex auto 1 1
    text-align: right
    font-size: 2rem
    font-weight: 100
    color: $md-teal
    @media screen and (max-width: 992px)
      flex auto 0 1
      text-align: left
    @media screen and (max-width: 576px)
      text-align: center
      font-size: 1.8rem

  &__login-items
    font-size 1.3rem
    font-weight: 400
    text-shadow: 1px 1px 0 rgba(0,0,0, .7)
    padding-bottom: .5rem
    padding-right: .5rem;
    border-bottom 2px solid transparent
    color $md-teal-50
    transition border-bottom .2s
    cursor pointer
    & i
      position: relative
      top: .3rem
      color $md-pink-a200
    &:hover
      border-bottom 2px solid $md-pink-a200

  &__menu
    display flex
    margin-top 0
    @media screen and (min-width: 576px)
      justify-content center
      align-items center


  &__nav
    list-style-type none
    h-box()
    justify-content center
    margin: 0
    padding: 0
    @media screen and (max-width: 576px)
      flex-direction column
      margin: 0 auto

  &__nav-icons
    position relative
    top .4rem
    font-size: 2rem
    color $color-primary

  &__nav-items
    font-size 1.3rem
    font-weight: 400
    text-shadow: 1px 1px 0 rgba(0,0,0, .7)
    padding-bottom: .5rem
    margin-left 1rem
    border-bottom 2px solid transparent
    color $md-teal-50
    transition border-bottom .2s
    @media screen and (max-width: 992px)
      font-size 1rem
    @media screen and (max-width: 576px)
      margin-left 0rem
    &:hover
      border-bottom 2px solid $md-teal-100

</style>
