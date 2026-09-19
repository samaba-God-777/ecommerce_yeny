import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
})
