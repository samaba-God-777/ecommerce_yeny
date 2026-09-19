/**
 * Dominios que pueden llamar al backend.
 *
 * Salen de CORS_ORIGINS (separados por coma). Sin esa variable valen solo los
 * puertos de desarrollo.
 *
 * Importa para el socket: las peticiones REST llegan por el mismo dominio
 * (Firebase Hosting redirige /api a Cloud Run), pero el WebSocket va directo
 * al dominio de Cloud Run, y ahi el navegador si exige CORS.
 */
const DEV_ORIGINS = [
  'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
  'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
  'http://localhost:5179', 'http://localhost:5000'
]

export const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : DEV_ORIGINS

export default allowedOrigins
