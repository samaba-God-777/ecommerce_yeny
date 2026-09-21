// Nombre nuevo en cada cambio de estrategia: al activarse borra las caches
// anteriores, que es lo que hacia que siguieran viendose versiones viejas.
const CACHE_NAME = 'yenyleths-v2'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
]

self.addEventListener('install', (event) => {
  // Sin esto el service worker nuevo espera a que se cierren todas las
  // pestanas viejas para tomar el control.
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // El panel de administracion vive en /admin dentro de este mismo dominio,
  // pero es otra aplicacion: se deja pasar sin tocar.
  if (url.pathname.startsWith('/admin')) return

  // El API nunca se cachea
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }))
    )
    return
  }

  // Paginas: primero la red, y la cache solo como respaldo sin conexion. Al
  // reves (cache primero) el usuario seguia viendo la version vieja despues
  // de cada despliegue.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request).then((c) => c || caches.match('/index.html')))
    )
    return
  }

  // Archivos con hash en el nombre (js, css, imagenes): cache primero, que
  // nunca cambian de contenido sin cambiar de nombre.
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
