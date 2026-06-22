import axios from 'axios'
import config from './configurl'

const request = (url = '', method = 'GET', data = null, options = {}) => {
  const token = options?.token
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (data instanceof FormData) {
    headers = {
      Accept: 'application/json',
    }
  }
  return axios({
    url: config.baseurl + url,
    method,
    data: method !== 'GET' ? data : undefined,
    params: method === 'GET' ? data : undefined,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
    .then(res => res.data)
    .catch(error => {
      throw error
    })
}

export default request