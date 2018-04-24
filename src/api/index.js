import fetch from '../utils/fetch'
import { stringify } from 'qs'

export function fetchDoubanList(params) {
  return fetch(`/v2/movie/search?${stringify(params)}`)
}

export function fetchDoubanSubject(id) {
  return fetch(`/v2/movie/subject/${id}`)
}
