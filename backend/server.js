import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import http from 'http'
import { initializeSignalingServer, getIO } from './modules/signalingServer.js'
import { connectToMongoDB, getDb } from './src/database/connection.js'
import { apiLimiter, authLimiter, passwordResetLimiter } from './src/middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js'
import asyncHandler from './src/middleware/asyncHandler.js'
import { setIO } from './src/services/socketService.js'
import logger from './src/utils/logger.js'

// Route imports
import authRoutes from './src/routes/auth.js'
import productRoutes from './src/routes/products.js'
import categoryRoutes from './src/routes/categories.js'
import orderRoutes from './src/routes/orders.js'
import reviewRoutes from './src/routes/reviews.js'
import couponRoutes from './src/routes/coupons.js'
import chatRoutes from './src/routes/chat.js'
import reportRoutes from './src/routes/reports.js'
import paymentRoutes from './routes/payments.js'

const app = express()
const server = http.createServer(app)
// Render (y cualquier hosting) asigna el puerto por variable de entorno y
// espera que el servicio escuche ahi: con un puerto fijo no detecta la app.
const PORT = process.env.PORT || 5000

// Initialize database
//
// El servidor levanta aunque Mongo falle (si no, el hosting reinicia en bucle),
// pero entonces cada peticion responde 500 sin decir por que. Se guarda el
// motivo para mostrarlo en el health check y se registra completo en el log.
let dbError = null

// Algunos errores del driver traen la URI dentro: se tapa usuario y contrasena
// antes de mostrar nada.
const sinCredenciales = (msg) => String(msg || '').replace(/\/\/[^@\s]*@/g, '//***:***@')

connectToMongoDB()
  .then(() => { dbError = null })
  .catch(err => {
    dbError = sinCredenciales(err.message)
    logger.error(`No se pudo conectar a MongoDB: ${dbError}`)
    logger.error('Revisa MONGODB_URI (la contrasena va codificada para URL) y la lista de IPs en Atlas.')
  })

// Initialize Socket.io
const io = initializeSignalingServer(server)
setIO(io)

// Global middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
// Los dominios permitidos salen de CORS_ORIGINS (separados por coma). Sin esa
// variable solo valen los puertos de desarrollo, que es lo que habia antes: en
// produccion el navegador bloquea al front si su dominio no esta en la lista.
const DEV_ORIGINS = [
  'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
  'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
  'http://localhost:5179', 'http://localhost:5000'
]
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : DEV_ORIGINS

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api', apiLimiter)

// Static files
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('../frontend/src/assets/images/products'))

// Routes
// La recuperacion lleva su propio cupo, separado del de intentos de login.
app.use('/api/auth/forgot-password', passwordResetLimiter)
app.use('/api/auth/reset-password', passwordResetLimiter)
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
// Devuelve 200 aunque la base este caida, para que el hosting no reinicie en
// bucle, pero dice el estado: sin esto el panel marca "Deployed" y la app
// responde 500 en todo sin pista de la causa. El motivo del fallo no expone
// credenciales (la URI nunca se incluye).
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Yenyleths API running',
    db: dbError ? 'sin conexion' : 'conectada',
    ...(dbError && { dbError }),
    // Segundos desde que arranco el proceso: el estado de la base se mide al
    // inicio, asi que sin esto no se sabe si un cambio de variable ya tomo
    // efecto o si sigue corriendo la instancia anterior.
    uptimeSegundos: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  })
})

// Sitemap
app.get('/sitemap.xml', asyncHandler(async (req, res) => {
  const db = getDb()
  const products = await db.collection('products').find().sort({ name: 1 }).toArray()
  const categories = await db.collection('categories').find().sort({ name: 1 }).toArray()

  function slugify(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  xml += '  <url><loc>http://localhost:5175/</loc><priority>1.0</priority></url>\n'

  for (const cat of categories) {
    xml += `  <url><loc>http://localhost:5175/category/${cat.slug}</loc><priority>0.8</priority></url>\n`
  }
  for (const p of products) {
    xml += `  <url><loc>http://localhost:5175/product/${slugify(p.name)}-${p._id}</loc><priority>0.6</priority></url>\n`
  }

  xml += '</urlset>'
  res.header('Content-Type', 'application/xml')
  res.send(xml)
}))

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`\n✓ Yenyleths Backend corriendo en http://localhost:${PORT}`)
  console.log(`✓ MongoDB Atlas + JWT Auth + WebRTC Signaling activo`)
  console.log(`✓ Endpoints:`)
  console.log(`  POST /api/auth/register | /login | /me`)
  console.log(`  GET|POST|PUT|PATCH|DELETE /api/products`)
  console.log(`  GET|POST|DELETE /api/categories`)
  console.log(`  POST /api/orders | GET /api/orders`)
  console.log(`  GET|POST /api/reviews/product/:id`)
  console.log(`  CRUD /api/coupons`)
  console.log(`  GET /api/chat/conversations`)
  console.log(`  GET /api/reports/summary`)
  console.log(`  GET /sitemap.xml`)
})
