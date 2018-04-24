import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://10.23.35.134:8081',
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(config =>
  // Do something before request is sent
  config
  , error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response.data,
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  })

export default service
