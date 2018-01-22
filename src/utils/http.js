// import axios
import axios from 'axios'

// create custom axios instance
const http = axios.create({
  baseURL: 'http://localhost:3000'
})

// export axios as vue plugin to use it as $http
export function install (Vue) {
  Vue.prototype.$http = http
}

// export axios as http to use it outside of vue
export default http
