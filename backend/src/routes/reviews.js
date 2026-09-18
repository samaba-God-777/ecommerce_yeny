import { Router } from 'express'
import { getReviewsByProduct, createReview } from '../models/reviewModel.js'
import { getProductById } from '../models/productModel.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { reviewSchema } from '../schemas/index.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.get('/product/:productId', asyncHandler(async (req, res) => {
  const product = getProductById(req.params.productId)
  if (!product) return res.status(404).json({ success: false, error: 'Producto no encontrado' })
  res.json(getReviewsByProduct(req.params.productId))
}))

router.post('/product/:productId', authenticate, validate(reviewSchema), asyncHandler(async (req, res) => {
  const product = getProductById(req.params.productId)
  if (!product) return res.status(404).json({ success: false, error: 'Producto no encontrado' })

  const review = createReview({
    productId: req.params.productId,
    author: req.body.author || req.user.username,
    rating: req.body.rating,
    comment: req.body.comment
  })

  res.status(201).json(review)
}))

export default router
