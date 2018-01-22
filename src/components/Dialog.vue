<template>
  <!-- DIALOG -->
  <div class="dialog">

    <!-- CUSTOM WIDTH -->
    <div class="dialog__card" :style="{ width: width }">
      <div class="dialog__title">

        <!-- COSTOM TITLE -->
        <h1>{{ title }}</h1>
      </div>
      <div class="dialog__content">
        <!-- SLOT FOR CUSTOM CONTENT -->
        <slot />
      </div>
      <div class="dialog__actions">
        <!-- CUSTOM BUTTON NAMES AND CUSTOM EVENTS -->
        <button
          @click="$emit('canceled')"
          class="dialog__button">{{ cancel }}</button>
        <button
          @click="$emit('ok')"
          class="dialog__button">{{ confirm }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // custom title prop
    title: {
      type: String
    },
    // custom confirm prop
    confirm: {
      type: String,
      default: 'Yes'
    },
    // custom cancel prop
    cancel: {
      type: String,
      default: 'No'
    },
    // custom width prop
    width: {
      type: String
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.dialog
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  z-index 1000
  flex-box()
  box-center()
  background-color rgba(0,0,0, .8)

  &__card
    width: 400px;
    height: auto;
    background-color: $md-teal-50;
    margin: 0 auto;
    padding: 1rem;
    @media screen and (max-width: 768px)
      width: 250px

  &__title
    text-align: center;
    color $md-teal
    border-bottom 2px solid $md-grey
    & h1
      @media screen and (max-width: 576px)
        font-size: 1.5rem;

  &__content
    font-size: 1.2rem;
    font-weight: 100;
    margin-top: 2rem;
    margin-bottom: 2rem;

  &__actions
    width 100%
    display flex
    justify-content flex-end

  &__button
    font-size: 1rem;
    font-weight: 700;
    padding: .6rem;
    margin-right 1rem
    background-color: transparent;
    border: none
    color $md-green
    cursor pointer
    &:first-child
      color: $md-pink-a200;
</style>
