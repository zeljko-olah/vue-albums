<template>
  <!-- SIMPLE FOOTER COMPONENT -->
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__text">
        <span class="footer__author">Made by Zeljko Olah</span>
        <i class="material-icons icon footer__icon">whatshot</i>
        <span class="footer__copyright">&copy; January 2018 --- Built with Vue, Vuex, and JSON server</span>
      </p>
    </div>
  </footer>
</template>

<style lang="stylus">
@import '../styles/main'

.footer
  width: 100%;
  position relative
  overflow: hidden;

  &__container
    height 50px
    h-box()
    box-center()
    background $md-teal-800
    color $md-teal-50
    border-top: 1px solid black;
    border-bottom: 1px solid black
    @media screen and (max-width: 576px)
      height: auto;

  &__text
    @media screen and (max-width: 576px)
      margin: .4rem;


  &__icon
    color rgba($md-teal-50, .5)
    @media screen and (max-width: 576px)
      display: none;

  &__author,
  &__copyright
    font-weight bold
    @media screen and (max-width: 768px)
      font-size: .8rem;
    @media screen and (max-width: 576px)
      margin-right: 0rem;
      font-size: .7rem;

  &__author
    margin-right 1rem

  &__copyright
    margin-left: 1rem

  & span, & i
    @media screen and (max-width: 576px)
      display block
      text-align: center;

</style>
