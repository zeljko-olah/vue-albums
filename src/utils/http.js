// import axios
import axios from 'axios'

// create custom axios instance
const http = axios.create({
  baseURL: 'https://vue-albums.herokuapp.com/api'
})

// export axios as vue plugin to use it as $http
export function install (Vue) {
  Vue.prototype.$http = http
}

// export axios as http to use it outside of vue
export default http
