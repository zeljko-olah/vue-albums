import Vue from 'vue'
import Router from 'vue-router'

// import store for navigation guards
import { store } from '../store'

// import route compoments
import Home from '../components/Home.vue'
import Users from '../components/Users.vue'
import Albums from '../components/Albums.vue'
import Images from '../components/Images.vue'

// use router plugin
Vue.use(Router)

// declare router
export const router = new Router({
  // routes
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
    { path: '/allalbums', name: 'allalbums', component: Albums },
    { path: '/albums/:userId', name: 'albums', component: Albums, props: true, meta: { requiresAuth: true } },
    { path: '/allimages', name: 'allimages', component: Images },
    { path: '/images/:albumId', name: 'images', component: Images, props: true, meta: { requiresAuth: true } },
    { path: '*', component: Home }
  ]
})

// before each navigation route - check if routes are private an redirect to home login if they are
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.authorizedUser) {
      next({
        name: 'home',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
