// Unico lugar donde se resuelven las direcciones del proyecto.
//
// En produccion VITE_API_URL es "/api": Firebase Hosting redirige /api,
// /uploads e /images al servicio de Cloud Run, asi que todo viaja por el mismo
// dominio del panel y no hay CORS. En desarrollo apunta al backend local.
//
// Se acepta con o sin /api al final, y absoluta o relativa.

const raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

/** Origen del backend. Vacio cuando el API va por el mismo dominio. */
export const API_ORIGIN = raw.replace(/\/api$/, '')

/** Base de las llamadas al API, siempre terminada en /api. */
export const API_BASE = `${API_ORIGIN}/api`

/**
 * Servidor de socket.io (chat y videollamadas).
 *
 * Firebase Hosting no soporta WebSockets, asi que el socket NO puede pasar por
 * el mismo dominio: necesita la direccion directa de Cloud Run en
 * VITE_SOCKET_URL. Si falta, se usa el origen del API, que es lo correcto en
 * desarrollo.
 */
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  API_ORIGIN ||
  (typeof window !== 'undefined' ? window.location.origin : '')

/** La tienda, que vive en su propio dominio. */
export const STORE_URL = import.meta.env.VITE_STORE_URL || 'http://localhost:5175'
