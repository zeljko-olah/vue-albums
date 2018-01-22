<template>

<!-- SEARCH COMPONENT -->
<div class="search" :class="{ 'search--expand': show }">
  <div class="search__wrap">

    <!-- SEARCH FIELD -->
    <input
      @keyup.esc="clearSearch"
      @blur = 'clearSearch'
      v-model="searchTerm"
      @input="searchEmit"
      ref="inputSearch"
      class="search__input"
      :class="{ search__error: error }"
      type="text"
      :placeholder="placeholder">

    <!-- SEARCH ICON -->
    <i @click.prevent="showSearch($event)"
       class="search__icon material-icons icon"
    >{{ icon }}</i>

    <!-- SHOW ERROR IF THERE ARE NO RESUTS -->
    <div v-if="error && show">
      <span class="search__info">No results for your search!</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    // custom placeholder
    placeholder: {
      type: String
    },
    // custom icon
    icon: {
      type: String
    },
    // receive error from parent
    error: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // search term
      searchTerm: '',
      // initially hide search box
      show: false
    }
  },
  methods: {
    // emit search term on input to set it in the store
    searchEmit (event) {
      this.$store.dispatch('searchTerm', event.currentTarget.value)
    },
    // show or hide search box
    showSearch (event) {
      this.show = !this.show
      // focus input field automatically when search box opens
      if (this.show) {
        this.$refs.inputSearch.focus()
      }
      // if (this.error) {
      //   this.show = true
      // }
    },
    // clear search and shrink the search box
    clearSearch (event) {
      var vm = this
      // delay a little bit for vuex store update to complete
      setTimeout(function () {
        vm.searchTerm = ''
        vm.$store.dispatch('searchTerm', '')
        vm.show = false
      }, 500)
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.search
  flex 10% 0 1
  margin-right 1rem
  transition all .3s ease-in

  &--expand
    flex 40% 0 0

  &__wrap
    position: relative
    overflow hidden

  &__input
    width 100%
    box-sizing border-box
    font-size 1.5rem
    padding 1rem 0 1rem 4rem
    color $md-black !important
    background-color: $md-teal-600;
    outline none
    border 3px solid transparent
    transition: all .5s ease
    &:focus
      color @color
    &::placeholder
      padding-left: .3rem;
      color $md-teal-50

  &__icon
    position absolute
    top: 1.2rem;
    left: 1.2rem;
    font-size 2rem !important
    color $color-primary

  &__error
    border 3px solid $md-pink-a200

  &__info
    position: absolute;
    top: 1.5rem;
    right: 1rem;
    color $md-pink-a100

</style>
