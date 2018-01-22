<template>
  <div class="">

    <!-- NO MORE IMAGES LEFT -->
    <div class="pagination__no-more-items" v-if="noMoreItems"><h1 class="images__title">No more images left!</h1></div>

    <div class="pagination" v-else>

      <!-- CURRENT PAGE -->
      <div class="pagination__info">
        Pages {{ currentPage }} of {{ pagination.totalPages }}
      </div>

      <!-- PAGINATION LINKS -->
      <nav
        v-if="pagination.totalPages > 1"
        class="pagination__nav">
        <ul class="pagination__list">
          <li
            class="pagination__items"
            >
            <button
            @click="toPage(1)"
            :disabled="currentPage === 1"
            class="pagination__button
            pagination__button--symbols">&laquo;</button>
          </li>
          <li
            class="pagination__items"
            >
            <button
            @click="toPage(currentPage -= 1)"
            :disabled="currentPage === 1"
            class="pagination__button pagination__button--symbols">&lsaquo;</button>
          </li>
          <li
            v-for="(page, index) in pageLinks"
            class="pagination__items"
            :class="{ 'pagination__items--active': currentPage === pageLinks[index] }">
            <button
              @click="toPage(page)"
              class="pagination__button">{{ page }}</button>
          </li>
          <li
            class="pagination__items"
            >
            <button
              @click="toPage(currentPage +=1)"
              :disabled="currentPage === pagination.totalPages"
              class="pagination__button pagination__button--symbols">&rsaquo;</button>
          </li>
          <li
            class="pagination__items"
            >
            <button
              @click="toPage(pagination.totalPages)"
              :disabled="currentPage === pagination.totalPages"
              class="pagination__button pagination__button--symbols">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

</template>

<script>
export default {
  // receive list as a prop from parent component
  props: ['items'],
  data () {
    return {
      // items per page
      perPage: 10,
      // current page bu default is first page
      currentPage: 1,
      // how many links paganation shows from the current page
      pageLinksCount: 1,
      // item images to send to parent
      paginatedItems: [],
      // indicator if there are no more items
      noMoreItems: false
    }
  },
  computed: {
    // calculate total images, total pages, and range
    pagination () {
      if (this.items) {
        // lenght of items prop array
        let totalImages = this.items.length
        // deppending on the current page calculate starting item
        let pageFrom = (this.currentPage * this.perPage) - this.perPage
        let totalPages = Math.ceil(totalImages / this.perPage)

        return {
          totalImages,
          totalPages,
          range: {
            from: pageFrom,
            to: pageFrom + this.perPage
          }
        }
      }
    },
    // computed for calculating 3 page links
    pageLinks () {
      if (this.items.length) {
        let negativePoint = this.currentPage - this.pageLinksCount
        let positivePoint = this.currentPage + this.pageLinksCount
        let pages = []

        if (this.pagination.totalPages < 3) {
          negativePoint = 1
          positivePoint = this.pagination.totalPages
        } else {
          if (negativePoint < 1) {
            negativePoint = 1
            positivePoint = 3
          }

          if (positivePoint > this.pagination.totalPages) {
            positivePoint = this.pagination.totalPages
            negativePoint = this.pagination.totalPages - 2
          }
        }

        for (var i = negativePoint; i <= positivePoint; i++) {
          pages.push(i)
        }

        return pages
      }
    },
    // current page to remember if item is deleted
    currentPaginatePage () {
      return this.$store.getters.currentPaginatePage
    }
  },
  watch: {
    // watch route if there is more pages then total pages redirect to home
    '$route' (to) {
      this.currentPage = parseInt(to.query.page) || 1
      if (to.query.page > this.pagination.totalPages) {
        this.$router.replace({ name: 'home' })
      }
    },
    // watch current page to recalculate pagination values
    currentPage (value) {
      this.paginate()
    },
    // watch items array when change to update pagination
    // last image on current page or in items array is deleted
    items (oldValue, value) {
      this.paginate()
      if (oldValue < value) {
        if (!this.items.length) {
          this.currentPage = 1
          this.noMoreItems = true
          this.$emit('deleteList')
        } else if (this.items.length % 10 !== 0) {
          this.currentPage = this.currentPaginatePage || 1
        } else {
          this.currentPage = this.currentPaginatePage - 1
        }
      }
    }
  },
  methods: {
    // go to page method
    toPage (page) {
      // update query parameters with current page
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          page
        })
      })
      // update current page
      this.currentPage = page
      // store the current page to remember it
      this.$store.dispatch('currentPaginatePage', this.currentPage)
    },
    // prepate paginated items pertaining to current page to send to the parent
    paginate () {
      // use temporary data property paginatedItems and
      // store items in correct range
      this.paginatedItems = this.items.slice(
        this.pagination.range.from,
        this.pagination.range.to
      )
      // emit an event to send paginated items to parent
      this.$emit('paginate', this.paginatedItems)
    }
  },
  // on mounted hook when items are loaded, initiate pagination process
  mounted () {
    this.paginate()
  }
}
</script>

<style lang="stylus">
@import "../styles/imports"

.pagination
  v-box()
  align-items center
  justify-content center
  margin-top: 6rem;
  order 0
  @media screen and (max-width: 1502px)
    margin-top: 4rem;
  @media screen and (max-width: 992px)
    margin-top: 3rem;
  @media screen and (max-width: 768px)
    margin-top: 0rem;

  &__info
    font-size: .9rem;
    font-weight: 100;
    color $md-teal-600
    @media screen and (max-width: 576px)
      font-size: .7rem;

  &__list
    list-style none
    margin: 0;

  &__items
    display inline-block
    margin-right 0
    &--active
      background-color $md-teal-50
      border 1px solid $md-teal

  &__button
    font-size: 1rem
    font-weight: bold;
    padding .5rem 1rem
    background-color transparent
    border none
    color $md-pink-a200
    cursor pointer
    @media screen and (max-width: 576px)
      font-size: .7rem
      padding .3rem .5rem
    &--symbols
      font-size 1.3rem
      @media screen and (max-width: 576px)
        font-size: .8rem
    &:focus
      outline 0
    &:disabled, &[disabled]
      background-color: transparent;
      color grey
  &__no-more-items
    text-align: center;
    margin-top: -10rem;

</style>
