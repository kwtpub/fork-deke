import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminArea =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      if (isAdminArea) {
        localStorage.removeItem('admin_token')
        delete apiInstance.defaults.headers.common['Authorization']
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(error)
  },
)
