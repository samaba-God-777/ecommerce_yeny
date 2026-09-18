// Direccion del panel de administracion, que en Render vive en su propio
// dominio. Se lee del entorno (render.yaml la inyecta) y por defecto apunta al
// servidor de desarrollo, para que `npm run dev` siga funcionando igual.

export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173'
