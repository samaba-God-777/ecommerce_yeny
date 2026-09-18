import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {
  getAllProducts, getProductById, searchProducts,
  createProduct, updateProduct, updateProductFlags,
  deleteProduct, getLowStock
} from '../models/productModel.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { productSchema } from '../schemas/index.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products'
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    cb(ext && mime ? null : new Error('Solo imágenes (jpeg, jpg, png, gif, webp)'), ext && mime)
  }
})

router.get('/', asyncHandler(async (req, res) => {
  const products = getAllProducts(req.query)
  res.json(products)
}))

router.get('/search', asyncHandler(async (req, res) => {
  const { q, categoryId, minPrice, maxPrice, sortBy } = req.query
  if (!q || q.trim().length < 1) {
    return res.json([])
  }
  const results = searchProducts({ q: q.trim(), categoryId, minPrice, maxPrice, sortBy })
  res.json(results)
}))

router.get('/low-stock', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5
  res.json(getLowStock(threshold))
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const product = getProductById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
}))

router.post('/', authenticate, requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const data = req.body
  if (req.file) data.image = `/uploads/products/${req.file.filename}`
  const product = createProduct(data)
  res.status(201).json(product)
}))

router.put('/:id', authenticate, requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const data = req.body
  if (req.file) data.image = `/uploads/products/${req.file.filename}`
  const product = updateProduct(req.params.id, data)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
}))

router.patch('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const product = updateProductFlags(req.params.id, req.body)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
}))

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const product = getProductById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  if (product.image && product.image !== 'product-placeholder.webp' && !product.image.startsWith('/')) {
    const imgPath = path.join(process.cwd(), product.image)
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
  }
  deleteProduct(req.params.id)
  res.json({ success: true, deleted: product })
}))

export default router
