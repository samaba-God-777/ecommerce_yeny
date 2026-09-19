import axios from 'axios'
import { API_BASE } from './urls'
import { auth } from './firebase'


const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// El token lo emite Firebase y caduca a la hora: getIdToken() lo renueva solo
// cuando hace falta, asi que se pide en cada peticion en vez de guardarlo.
api.interceptors.request.use(async (config) => {
  const cuenta = auth.currentUser
  if (cuenta) {
    config.headers.Authorization = `Bearer ${await cuenta.getIdToken()}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Un 401 con sesion activa significa token invalido: se cierra y se vuelve
    // a entrar. Sin sesion no se redirige, que las rutas publicas tambien
    // llaman al API.
    if (error.response?.status === 401 && auth.currentUser) {
      auth.signOut()
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
