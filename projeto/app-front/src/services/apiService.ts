import axios from 'axios'
import { getSessionToken, removeSessionToken } from './sessionService'
import router from '../router'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 60000,
})

// Interceptor para adicionar o token JWT nas requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getSessionToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      removeSessionToken();
      router.push('/login')
    }
    return Promise.reject(error)
  }
)