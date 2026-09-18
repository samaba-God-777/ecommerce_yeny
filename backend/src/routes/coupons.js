import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { couponSchema } from '../schemas/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon, validateCoupon as validateCouponCode } from '../models/couponModel.js'

const router = Router()

router.get('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  res.json(getAllCoupons())
}))

router.post('/', authenticate, requireAdmin, validate(couponSchema), asyncHandler(async (req, res) => {
  const coupon = createCoupon(req.body)
  res.status(201).json(coupon)
}))

router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const coupon = updateCoupon(req.params.id, req.body)
  if (!coupon) return res.status(404).json({ success: false, error: 'Cupón no encontrado' })
  res.json(coupon)
}))

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  deleteCoupon(req.params.id)
  res.json({ success: true })
}))

router.patch('/:id/toggle', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const coupon = toggleCoupon(req.params.id)
  res.json(coupon)
}))

router.post('/validate', asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body
  if (!code) return res.status(400).json({ valid: false, error: 'Código requerido' })
  res.json(validateCouponCode(code, subtotal || 0))
}))

export default router
