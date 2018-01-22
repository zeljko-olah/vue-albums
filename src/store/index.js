import Vue from 'vue'
import Vuex from 'vuex'

// import axios http plugin
import http from '../utils/http'

// import underscore helper for _.shuffle method
import _ from 'underscore'

// persist state on page refresh
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  // persist just authorized user state
  reducer: state => ({
    authorizedUser: state.authorizedUser
  })
})

export const store = new Vuex.Store({
  // PLUGINS
  plugins: [vuexLocalStorage.plugin],
  // STATE
  state: {
    // logged in guest user
    authorizedUser: null,
    // all users (photographers)
    users: null,
    // all albums
    albums: null,
    // albums from current user
    userAlbums: null,
    // all images
    images: null,
    // current user
    currentUser: null,
    // current album
    currentAlbum: null,
    // current pagination page
    currentPaginatePage: null,
    // search term from search component
    searchTerm: '',
    // state of loading when async code runs
    loading: false,
    // validation alerts
    alert: ''
  },
  // MUTATIONS
  mutations: {
    logInUser (state, payload) {
      state.authorizedUser = payload
    },
    setUsers (state, payload) {
      state.users = payload
    },
    setAlbums (state, payload) {
      state.albums = payload
    },
    setUserAlbums (state, payload) {
      state.userAlbums = payload
    },
    setImages (state, payload) {
      state.images = payload
    },
    setCurrentUser (state, payload) {
      state.currentUser = payload
    },
    setCurrentAlbum (state, payload) {
      state.currentAlbum = payload
    },
    setSearchTerm (state, payload) {
      state.searchTerm = payload
    },
    setCurrentPaginatePage (state, payload) {
      state.currentPaginatePage = payload
    },
    deleteImage (state, payload) {
      state.images.filter(image => {
        return image.id === payload.id
      })
    },
    loading (state, payload) {
      state.loading = payload
    },
    alert (state, payload) {
      state.alert = payload
    }
  },
  // ACTIONS
  actions: {
    // fetch all users
    async fetchUsers ({ commit }) {
      commit('loading', true)
      await http.get('/users')
        .then((response) => {
          commit('setUsers', response.data)
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // fetch album from the current user
    async fetchUserAlbum ({ commit }, payload) {
      commit('loading', true)
      await http.get(`/albums?userId=${payload}`)
        .then((response) => {
          commit('setUserAlbums', response.data)
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    //  fetch all albums
    async fetchAllAlbums ({ commit }) {
      commit('loading', true)
      await http.get('/albums')
        .then((response) => {
          commit('setAlbums', response.data)
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // fetch images from current album
    async fetchAlbumImages ({ commit }, payload) {
      commit('loading', true)
      await http.get(`/photos/?albumId=${payload}`)
        .then((response) => {
          commit('setImages', response.data)
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // fetch all images
    async fetchAllImages ({ commit }, payload) {
      commit('loading', true)
      await http.get(`/photos/`)
        .then((response) => {
          commit('setImages', response.data)
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // set current user
    setCurrentUser ({ commit }, payload) {
      commit('setCurrentUser', payload)
    },
    // set current album
    setCurrentAlbum ({ commit }, payload) {
      commit('setCurrentAlbum', payload)
    },
    // clear current user and current album
    resetCurrentData ({ commit }) {
      commit('setCurrentAlbum', null)
      commit('setCurrentUser', null)
    },
    // delete the image
    deleteImage ({ commit, dispatch }, payload) {
      commit('loading', true)
      http.delete(`/photos/${payload.id}`)
        .then(() => {
          if (payload.albumId) {
            dispatch('fetchAlbumImages', payload.albumId)
          } else {
            dispatch('fetchAllImages')
          }
          commit('loading', false)
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // delete the album
    deleteAlbum ({ commit, dispatch }, payload) {
      commit('loading', true)
      http.delete(`/albums/${payload.albumId}`)
        .then(() => {
          if (payload.userId) {
            dispatch('fetchUserAlbum', payload.userId)
          }
          commit('loading', false)
          alert('Album succesfully deleted!')
        })
        .catch(error => {
          commit('loading', false)
          console.log(error)
        })
    },
    // set current pagination page
    currentPaginatePage ({ commit }, payload) {
      commit('setCurrentPaginatePage', payload)
    },
    // login user
    authorize ({ commit, dispatch }, payload) {
      commit('logInUser', payload)
      // set guest user to local storage for data persistence
      localStorage.setItem('guestUser', JSON.stringify(payload))
      dispatch('setSessionTime')
    },
    // logout user
    clearUser ({ commit }) {
      commit('logInUser', null)
      // remove user from local storage
      localStorage.removeItem('guestUser')
    },
    // logout user after session has expired
    setSessionTime ({ commit }) {
      // session duration 1 hour
      const sessionTime = 1 * 60 * 60 * 1000
      // logout user automaticaly after 5 minutes from login time
      setTimeout(function () {
        commit('logInUser', null)
      }, sessionTime)
    },
    // set search term
    searchTerm ({ commit }, payload) {
      commit('setSearchTerm', payload)
    },
    // set validation alert
    setAlert ({ commit }, payload) {
      commit('alert', payload)
    }
  },
  // GETTERS
  getters: {
    // return all users
    users (state) {
      if (state.users) {
        return state.users
      }
    },
    // return current user
    currentUser (state) {
      return state.currentUser
    },
    // return current album
    currentAlbum (state) {
      if (!state.currentAlbum) {
        return {}
      }
      return state.currentAlbum
    },
    // return all albums from a current user
    userAlbums (state) {
      return state.userAlbums
    },
    // return all albums
    albums (state) {
      if (!state.albums) {
        return []
      }
      return state.albums
    },
    // return all images
    images (state) {
      if (state.images) {
        return state.images
      } else {
        return []
      }
    },
    // return 100 random images
    randomImages (state) {
      return _.shuffle(state.images).slice(0, 100)
    },
    // return loading state
    loading (state) {
      return state.loading
    },
    // return albums that match search term
    searchedAlbum: (state, getters) => {
      let allAlbums = getters.albums
      let userAlbums = getters.userAlbums
      let albums = state.currentUser
        ? userAlbums : (state.currentAlbum ? userAlbums : allAlbums)
      if (state.searchTerm) {
        const reg = new RegExp(state.searchTerm.trim().toLowerCase().replace(/\s+/g, '|'))
        return albums.filter(
          album => album.title.toLowerCase().search(reg) !== -1
        )
      } else {
        return albums
      }
    },
    // return current pagination page
    currentPaginatePage (state) {
      return state.currentPaginatePage
    },
    // return authorized user
    authorizedUser (state) {
      return state.authorizedUser
    },
    // return validation alert message
    alert (state) {
      return state.alert
    }
  }
})
