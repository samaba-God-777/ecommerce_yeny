import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import http from 'http'
import { initializeSignalingServer, getIO } from './modules/signalingServer.js'
import { initDatabase, getDb } from './src/database/connection.js'
import { apiLimiter, authLimiter } from './src/middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js'
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
const PORT = 5000

// Initialize database
initDatabase()

// Initialize Socket.io
const io = initializeSignalingServer(server)
setIO(io)

// Global middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5000'], credentials: true }))
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api', apiLimiter)

// Static files
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('../frontend/src/assets/images/products'))

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/payments', paymentRoutes)

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  const db = getDb()
  const products = db.prepare("SELECT id, name FROM products ORDER BY name").all()
  const categories = db.prepare("SELECT slug, name FROM categories ORDER BY name").all()

  function slugify(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  xml += '  <url><loc>http://localhost:5175/</loc><priority>1.0</priority></url>\n'

  for (const cat of categories) {
    xml += `  <url><loc>http://localhost:5175/category/${cat.slug}</loc><priority>0.8</priority></url>\n`
  }
  for (const p of products) {
    xml += `  <url><loc>http://localhost:5175/product/${slugify(p.name)}-${p.id}</loc><priority>0.6</priority></url>\n`
  }

  xml += '</urlset>'
  res.header('Content-Type', 'application/xml')
  res.send(xml)
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`\n✓ Yenyleths Backend corriendo en http://localhost:${PORT}`)
  console.log(`✓ SQLite + JWT Auth + WebRTC Signaling activo`)
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
