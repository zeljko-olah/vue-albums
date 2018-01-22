
// import validator package
import isEmail from 'validator/lib/isEmail'
// we need store to dispatch actions
import { store } from '../store'

// validate name and email form fileds
export function validate (nameField, emailField) {
  let name = nameField || ''
  let email = emailField || ''
  name = name.trim()
  email = email.trim()
  if (!name && !email) {
    store.dispatch('setAlert', 'Enter a valid name and email address!')
    return false
  }
  if (name === '' && !isEmail(email)) {
    store.dispatch('setAlert', 'Empty name field and invalid email address!')
    return false
  }
  if (typeof name === 'undefined' || name === '') {
    store.dispatch('setAlert', 'Enter valid username!')
    return false
  }
  if (typeof email === 'undefined' || email === '') {
    store.dispatch('setAlert', 'Email field must not be empty!')
    return false
  }
  if (!isEmail(email)) {
    store.dispatch('setAlert', 'Provide a valid email address!')
    return false
  }
  return !!name.trim() && !!email.trim() && isEmail(email)
}
