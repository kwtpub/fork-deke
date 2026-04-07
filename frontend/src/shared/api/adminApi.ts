import { apiInstance } from './baseApi'

// Auth
export const adminAuthApi = {
  login: (email: string, password: string) =>
    apiInstance.post<{ data: { accessToken: string; user: { id: string; email: string; name: string; role: string } } }>(
      '/auth/login', { email, password }
    ).then((r) => r.data.data),
}

// Token storage helpers
export const tokenStorage = {
  get: () => localStorage.getItem('admin_token'),
  set: (token: string) => {
    localStorage.setItem('admin_token', token)
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  clear: () => {
    localStorage.removeItem('admin_token')
    delete apiInstance.defaults.headers.common['Authorization']
  },
  init: () => {
    const token = localStorage.getItem('admin_token')
    if (token) apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
}
