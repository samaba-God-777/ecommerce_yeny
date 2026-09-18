import axios from 'axios'
import { API_BASE } from './urls'


const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customerToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.endsWith('/auth/me')) {
      localStorage.removeItem('customerToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export async function fetchApiProducts(): Promise<any[]> {
  const { data } = await api.get('/products')
  return Array.isArray(data) ? data : data.products || []
}
