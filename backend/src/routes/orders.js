import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { orderSchema } from '../schemas/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { createOrder, getAllOrders, getOrderById, getOrdersByCustomer, updateOrderStatus, updateOrderPayment } from '../models/orderModel.js'
import { getProductById } from '../models/productModel.js'
import { validateCoupon, incrementCouponUses } from '../models/couponModel.js'
import { emitNewOrder, emitOrderStatusUpdate } from '../services/socketService.js'

const router = Router()

router.post('/', authenticate, validate(orderSchema), asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, customerName, customerEmail, customerPhone, couponCode } = req.body

  const productDetails = []
  for (const item of items) {
    const product = await getProductById(item.productId)
    if (!product) return res.status(400).json({ success: false, error: `Producto ${item.productId} no encontrado` })
    if (product.stock < item.quantity) return res.status(400).json({ success: false, error: `Stock insuficiente para ${product.name}` })

    productDetails.push({
      ...item,
      productName: product.name,
      productImage: product.image,
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price
    })
  }

  const subtotal = productDetails.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 80 ? 0 : 8
  const tax = subtotal * 0.07

  let discount = 0
  let finalSubtotal = subtotal
  let freeShipping = false
  if (couponCode) {
    const validation = await validateCoupon(couponCode, subtotal)
    if (validation.valid) {
      if (validation.type === 'free_shipping') {
        freeShipping = true
      } else {
        discount = validation.discount
        finalSubtotal = subtotal - discount
      }
      await incrementCouponUses(couponCode)
    }
  }

  const total = finalSubtotal + (freeShipping ? 0 : shipping) + tax

  const order = await createOrder({
    customerId: req.user.isAdmin ? null : req.user.id,
    customerName,
    customerEmail,
    customerPhone,
    address: shippingAddress,
    paymentMethod,
    items: productDetails,
    subtotal: finalSubtotal,
    shipping: freeShipping ? 0 : shipping,
    tax,
    total,
    couponCode: couponCode || null
  })

  emitNewOrder(order)
  res.status(201).json({ success: true, order })
}))

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const filters = {}
  if (req.query.status) filters.status = req.query.status
  if (!req.user.isAdmin) filters.customerId = req.user.id

  const orders = await getAllOrders(filters)
  res.json(orders)
}))

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id)
  if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })
  if (!req.user.isAdmin && order.customerId !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Acceso denegado' })
  }
  res.json(order)
}))

router.patch('/:id/status', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Estado inválido' })
  }

  const order = await updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })

  emitOrderStatusUpdate(order)
  res.json(order)
}))

router.patch('/:id/payment', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body
  const validStatuses = ['pending', 'paid', 'refunded']
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ success: false, error: 'Estado de pago inválido' })
  }

  const order = await updateOrderPayment(req.params.id, paymentStatus)
  if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })

  emitOrderStatusUpdate(order)
  res.json(order)
}))

export default router
