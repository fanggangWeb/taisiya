import Cookies from 'js-cookie'
export function setCookie(key, value) {
  Cookies.set(key, value, { expires: 20 })
}
export function getCookie(key) {
  return Cookies.get(key)
}
export function removeCookie(key) {
  Cookies.remove(key)
}
