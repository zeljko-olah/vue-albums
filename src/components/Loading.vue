<template>
  <div class="loading">
    <div class="spinner">
    </div>
  </div>

</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import "../styles/imports"

.loading
  flex-box()
  box-center()

.spinner
    width 24px
    height @width
    border-radius 50%
    border solid 3px transparent
    border-right-color $color-primary
    animation spinner .7s linear infinite

@keyframes spinner
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)

</style>
