<template>
  <!-- MODAL -->
  <!-- EMIT EVENT TO CLOSE MODAL ON CLICK ESC KEY-->
  <div
    @keydown.esc="$emit('canceled')"
    class="modal"
    :style="color"
    >
    <!-- ALLOW CUSTOM CLOSE ICON - EMIT EVENT TO CLOSE MODAL ON CLICK -->
    <button
      v-if="icon"
      @click="$emit('canceled')"
      class="modal__button">
      <i class="icons material-icons">{{ icon }}</i>
    </button>

    <!-- MODAL BODY -->
    <div class="modal__card">
      <div class="modal__content">

        <!-- SLOT FOR CONTENT INSIDE MODAL BODY -->
        <slot />
      </div>
      <!-- MODAL TITLE AND DETAILS -->
      <div class="modal__title">
        <h1><span v-if="details">#{{details}}:</span> {{ title }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Number
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    // allow custom overlay color
    overlayColor: {
      type: String,
      default: 'rgba(0,0,0, 0.8)'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // prepare the style declaration for custom overlayColor
    color () {
      return `background-color: ${this.overlayColor};`
    }
  },
  // listen to the keydown even to check if esc key is clicked
  mounted () {
    document.addEventListener('keydown', (e) => {
      // check if modal is open and keycode is 27 (foe Ecs key)
      if (this.show && e.keyCode === 27) {
        // emit event to close modal
        this.$emit('canceled')
      }
    })
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.modal
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  z-index: 100;
  flex-box()
  box-center()

  &__card
    width: 35%;
    height: auto
    text-align: right;
    padding: 1rem;
    margin: 2rem auto 0;
    @media screen and (max-width: 1502px) and (orientation: landscape)
      width: 45%;
      margin-top: 1rem;
    @media screen and (max-width: 1502px) and (orientation: portrait)
      width: 80%;
      margin-top: 5rem;
    @media screen and (max-width: 996px) and (orientation: landscape)
      width: 36%;
      margin-top: 0rem;
    @media screen and (max-width: 996px) and (orientation: portrait)
      width: 80%;
      margin-top: 0rem;
    @media screen and (max-width: 768px) and (orientation: landscape)
      width: 43%;
      margin-top: 0
    @media screen and (max-width: 768px) and (orientation: portrait)
      width: 80%;
      margin-top: 0rem;
    @media screen and (max-width: 576px) and (orientation: landscape)
      width: 90%;
      margin-top: 8rem;
    @media screen and (max-width: 576px) and (orientation: portrait)
      width: 90%;
      margin-top: 5rem;

  &__title
    text-align: center;
    font-weight: 100;
    color $md-teal-50

    & h1
      font-weight: 400;
      font-size: 1.3rem;
      @media screen and (max-width: 996px) and (orientation: landscape)
        font-size: .8rem;


  &__content img
    width: 100%;

  &__button
    position: absolute;
    top: 1rem
    right: 1rem
    font-size: 1rem;
    padding: .5rem;
    border-radius 5px
    background-color: transparent;
    color $md-teal-50
    border 2px solid @color
    cursor pointer

</style>
