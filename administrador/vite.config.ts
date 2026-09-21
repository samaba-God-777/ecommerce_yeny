import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  // En produccion el panel se publica dentro de la tienda, en /admin, para que
  // ambos compartan dominio y por tanto la sesion de Firebase. En desarrollo
  // sigue en la raiz de su propio servidor.
  base: mode === 'production' ? '/admin/' : '/',
  plugins: [tailwindcss(), react()],
  server: {
    // En produccion Firebase Hosting redirige estas rutas al servicio de Cloud
    // Run; en desarrollo las redirige Vite al backend local. Asi el codigo
    // llama siempre a "/api" y no hay diferencias entre un entorno y otro.
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
      '/images': { target: 'http://localhost:5000', changeOrigin: true },
    },
    port: 5173,
    open: true,
  },
}))
