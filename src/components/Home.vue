<template>

  <!-- HERO - JUMBOTRON - 3 CARDS-->
  <div class="hero">
    <div class="hero__wrapper">

      <!-- 1. USERS -->
      <div class="hero__card">
        <div class="hero__card-title">
          <h1 class="main-headline">Best<br> Photographers <br> in the <br> World</h1>
        </div>
        <!-- ACTION BUTTON -->
        <div class="hero__card-actions">
          <button class="button" :disabled="disabled" @click="$router.push({ name: 'users' })">Meet Them All</button>
        </div>
      </div>
      <!-- 2. ALBUMS -->
      <div class="hero__card">
        <div class="hero__card-title">
          <h1 class="main-headline">Checkout <br>Huge <br>Album <br>Collection</h1>
        </div>
        <!-- ACTION BUTTON -->
        <div class="hero__card-actions">
          <router-link :to="{ name: 'allalbums' }">
            <button class="button" :disabled="disabled" @click="resetCurrent">View Now</button>
          </router-link>
        </div>
      </div>
      <!-- 3. IMAGES -->
      <div class="hero__card">
        <div class="hero__card-title">
          <h1 class="main-headline">Enjoy New <br>Amazing <br>Photos <br>Everyday</h1>
        </div>
        <!-- ACTION BUTTON -->
        <div class="hero__card-actions">
          <button class="button" :disabled="disabled" @click="$router.push({ name: 'allimages' })">Random Photos</button>
        </div>
      </div>
    </div>

  <transition appear name="zoom" mode="out-in">

    <!-- FORM COMPONENT -->
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
      <!-- SLOT FOR FORM FIELDS -->
      <input
        v-model="name"
        @keyup="$store.dispatch('setAlert', '')"
        class="login-form__input"
        type="text"
        name="name"
        placeholder="Name">
      <input
        v-model="email"
        @keyup="$store.dispatch('setAlert', '')"
        class="login-form__input"
        type="text"
        name="email"
        placeholder="Email">
    </AppForm>

    <!-- SHOW WELCOME IF LOGIN SUCCESFULL -->
    <div v-else class="welcome" key="welcome">
      <h1 class="main-headline welcome__message">Welcome <span>{{ authorizedUser.name }}</span></h1>
    </div>
  </transition>
  </div>
</template>

<script>
// validate function
import { validate } from '../utils/validate'

export default {
  data () {
    return {
      // input fields
      name: '',
      email: ''
    }
  },
  computed: {
    // get user from the store if the is one
    authorizedUser () {
      return this.$store.getters.authorizedUser
    },
    // disable card action buttons if there is no loged in user
    disabled () {
      return this.authorizedUser === null
    },
    // get alerts from the store to show them when appropriate
    alert () {
      return this.$store.getters.alert
    }
  },
  watch: {
    // watch when authorizeUser change to force clear input fields
    // do this because Home component is not destroyed and wil not update accordingly
    authorizedUser (value) {
      if (this.authorizedUser === null) {
        this.name = this.email = ''
      }
    }
  },
  methods: {
    // execute on submited event emmited from Form component
    authorize () {
      // validate input fields
      if (!validate(this.name, this.email)) {
        return false
      } else {
        // prepare newUser object
        let newUser = {
          name: this.name,
          email: this.email
        }
        // authorize newUser
        this.$store.dispatch('authorize', newUser)
        // clear any potential alerts in any remains
        this.$store.dispatch('setAlert', '')
      }
    },
    // clear current data when clicked on general navigation
    resetCurrent () {
      // clear dat on the store
      this.$store.dispatch('resetCurrentData')
      // remove data from localStorage
      localStorage.removeItem('userId')
      localStorage.removeItem('albumId')
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/main.styl'

.hero
  min-height: 330px
  flex-box()
  v-box()
  margin-top: 8rem;
  @media screen and (max-width: 768px)
    margin-top: 4rem;

  &__wrapper
    flex-box()
    h-box()
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: .6rem;
    @media screen and (max-width: 768px)
      v-box()
      align-items center
      justify-content centers

  &__card
    flex 29% 0 0
    padding: .5rem;
    margin: 0rem 1rem
    box-shadow 0px 0px 5px 2px rgba($md-teal-800 .7)
    background-color: rgba($md-teal-50, .6)
    border 2px solid $md-teal-800
    @media screen and (max-width: 768px)
      width: 100%;
      margin-bottom: 1rem;

  &__card-title
    margin-top: 0rem;
    & h1
      color $md-pink-a200
      font-size: 2rem;
      @media screen and (max-width: 1200px)
        font-size: 1.9rem;
      @media screen and (max-width: 992px)
        font-size: 1.8rem;

  &__card-actions
    margin-bottom: 2rem;

.welcome
  margin-top: 2.5rem;
  text-align: center !important
  & h1
    font-size: 2.3rem

</style>
