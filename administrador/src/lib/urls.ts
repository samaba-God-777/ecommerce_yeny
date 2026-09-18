// Direcciones de los otros dos servicios del proyecto.
//
// En Render cada servicio vive en su propio dominio, asi que los enlaces no
// pueden apuntar a localhost. Se leen del entorno (render.yaml las inyecta) y
// el valor por defecto es el de desarrollo, para que `npm run dev` siga igual.

export const STORE_URL = import.meta.env.VITE_STORE_URL || 'http://localhost:5175'

// Origen del backend: el mismo VITE_API_URL que usa lib/api.ts, sin el /api final.
export const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
