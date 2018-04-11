import fetch from '../utils/fetch'

export function fetchDoubanList(params) {
  return fetch('/douban/v2/movie/search?q=张艺谋')
}
