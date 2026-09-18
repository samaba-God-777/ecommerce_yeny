// Unico lugar donde se resuelven las direcciones del proyecto.
//
// VITE_API_URL acepta las dos formas, con o sin /api al final
// (https://backend.onrender.com y https://backend.onrender.com/api), porque al
// copiarla del panel de Render es facil dejarla sin el sufijo.

const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/** Origen del backend, sin /api: para imagenes subidas y el socket. */
export const API_ORIGIN = raw.replace(/\/api\/?$/, '').replace(/\/$/, '')

/** Base de las llamadas al API, siempre con /api. */
export const API_BASE = `${API_ORIGIN}/api`

/** La tienda, que en produccion vive en otro dominio. */
export const STORE_URL = import.meta.env.VITE_STORE_URL || 'http://localhost:5175'
