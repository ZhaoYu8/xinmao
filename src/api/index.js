import axios from 'axios'
import { Notification } from 'element-ui';
import router from '../router'
var instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 3000,
  responseType: 'json',
  validateStatus (status) {
    return status === 200
  }
})
// 拦截请求
instance.interceptors.request.use((config) => {
  let token = localStorage.getItem('token');
  if (token) {
    config.headers.token = 'Bearer ' + token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response) {
    let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        Notification.error({
          title: '系统提示',
          message: '很抱歉，资源未找到',
          duration: 4000
        })
        break
      case 403:
      case 401:
        Notification.error({
          title: '系统提示',
          message: errorMessage,
          duration: 4000
        })
        router.push('/login')
        break
      default:
        Notification.error({
          title: '系统提示',
          message: errorMessage,
          duration: 4000
        })
        break
    }
  }
  return Promise.reject(error)
})
const request = {
  post (url, params = {}) {
    return instance.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  get (url, params) {
    let _params
    let _paramsarr = []
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _paramsarr.push(`${key}=${params[key]}`)
        }
      }
      _paramsarr.length === 0 ? _params = '' : _params = '?' + _paramsarr.join('&')
    }
    return instance.get(`${url}${_params}`)
  },
  postJSON(url, params) {
    return instance.post(url, params, {
        transformRequest: [(params) => {
          let result = ''
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
          return result
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
  }
}
export default request
