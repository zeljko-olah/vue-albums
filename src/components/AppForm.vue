<template>

  <div class="login-form">
    <form>
      <!-- FORM TITLE -->
      <h3 class="login-form__title">
        <!-- ALLOW TITLE TO INTERCHAGE WITH ALERT MESSAGE -->
        <transition name="fade" mode="out-in">
          <template v-if="!alert || alert === ''"><span :key="title">{{ title }}</span></template>
          <template v-else><span :key="alert" class="alert">{{ alert }}</span></template>
        </transition>
      </h3>
      <div class="login-form__control">

        <!-- SLOT CONTENT FOR INPUT FIELDS -->
        <slot/>

        <!-- ACTIONS -->
        <div class="actions">
          <!-- EMIT CUSTOM SUBMIT EVENT -->
          <button @click.prevent="submit" type="submit" class="login-form__button">
            <!-- ALLOW CUSTOM BUTTON ICON -->
            <i class="material-icons icon login-form__icon">{{ icon }}</i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      alert: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      submitButton: {
        type: String,
        default: ''
      }
    },
    methods: {
      // emit submited event
      submit () {
        this.$emit('submited')
      }
    }
  }
</script>

<style lang="stylus">
@import '../styles/main.styl'

.login-form
  width: 100%;
  text-align: center;
  margin: 0 auto;

  &__control
    text-align: center;

  &__icon
    transition all .1s
    &:hover
      color $md-pink
      transform scale(1.1)

  &__title,
  &__input
    display: block;

  &__title
    font-size: 1.2rem;
    text-transform: uppercase;
    padding: .6rem;
    margin: 1rem 0 0.5rem;

  &__input
    display: inline-block;
    box-sizing border-box
    padding: .5rem 0 .5rem 1rem;
    margin-top: 0rem;
    background-color: transparent;
    outline none
    border 2px solid $md-teal-400
    @media screen and (max-width: 992px)
      width: 40%;
    @media screen and (max-width: 576px)
      width: 70%;
      display: block;
      margin: 0 auto .4rem;
    &::placeholder
      color: $md-pink-a100;
    &:focus
      border 2px solid $md-pink-400

  &__button
    position: relative;
    background-color: transparent;
    border none
    cursor pointer
    &:active
      border: none
      outline: none
    &:focus
      outline none

  &__icon
    position: relative;
    top: .5rem;
    font-size: 2rem !important
    color $md-teal-400

</style>
