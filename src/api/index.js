import axios from 'axios'
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
  // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoiYWRtaW4iLCJQbGF0IjoiV0VCIiwiaWF0IjoxNTY2NTUyNjY0LCJleHAiOjE1NjcxNTc0NjR9.-OM7EVIRYSSHDj2tx60H-_ZjJi1WNaZTYaU3Q6S-QOk'
  // if (token) {
  //   config.headers.token = token
  // }
  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  return response
}, function (error) {
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
