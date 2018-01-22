// import babel polyfill for new features
import 'babel-polyfill'
// import vue
import Vue from 'vue'
// import main app component
import App from './App'
// impor route
import { router } from './router'
// import store
import { store } from './store'

// sync router with the store - $route accessible in the store
import { sync } from 'vuex-router-sync'

// global components
import Loading from './components/Loading.vue'
import AppSearch from './components/AppSearch.vue'
import Dialog from './components/Dialog.vue'
import Modal from './components/Modal.vue'
import Paginate from './components/Paginate.vue'
import AppForm from './components/AppForm.vue'

// import filters
import * as filters from './filters/filters'

// sync store and router
sync(store, router)

// register global components
Vue.component('Loading', Loading)
Vue.component('AppSearch', AppSearch)
Vue.component('Dialog', Dialog)
Vue.component('Modal', Modal)
Vue.component('Paginate', Paginate)
Vue.component('AppForm', AppForm)

// register filters
Vue.filter('capitalize', filters.capitalize)
Vue.filter('allowNameLength', filters.allowNameLength)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
