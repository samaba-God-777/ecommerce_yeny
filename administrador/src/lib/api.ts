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
    // Token invalido o caducado: se cierra la sesion de Firebase y el propio
    // App vuelve a mostrar el login (el panel no tiene ruta /login).
    if (error.response?.status === 401 && auth.currentUser) {
      auth.signOut()
    }
    return Promise.reject(error)
  }
)

export default api
