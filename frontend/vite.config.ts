import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // En produccion Firebase Hosting redirige estas rutas al servicio de Cloud
    // Run; en desarrollo las redirige Vite al backend local. Asi el codigo
    // llama siempre a "/api" y no hay diferencias entre un entorno y otro.
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
      '/images': { target: 'http://localhost:5000', changeOrigin: true },
    },
    port: 5175,
    open: true,
  },
})
