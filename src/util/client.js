import request from '../util/request'

const apiClient = {
  get(url, params = null, options = {}) {
    return request(url, 'GET', params, options)
  },
  post(url, data = null, options = {}) {
    return request(url, 'POST', data, options)
  },
  put(url, data = null, options = {}) {
    return request(url, 'PUT', data, options)
  },
  delete(url, data = null, options = {}) {
    return request(url, 'DELETE', data, options)
  },
}

export default apiClient
