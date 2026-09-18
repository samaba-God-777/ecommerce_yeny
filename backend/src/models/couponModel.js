import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

function formatCoupon(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function getAllCoupons() {
  const db = getDb()
  const coupons = await db.collection('coupons').find().sort({ createdAt: -1 }).toArray()
  return coupons.map(formatCoupon)
}

export async function getCouponByCode(code) {
  const db = getDb()
  const coupon = await db.collection('coupons').findOne({ code: code.toUpperCase() })
  return formatCoupon(coupon)
}

export async function createCoupon(data) {
  const db = getDb()
  const id = data.id || uuidv4()
  const coupon = {
    _id: id,
    code: data.code.toUpperCase(),
    discount: data.discount,
    type: data.type,
    uses: 0,
    maxUses: data.maxUses || 100,
    minAmount: data.minAmount || 0,
    expires: data.expires || null,
    active: true,
    createdAt: new Date()
  }
  await db.collection('coupons').insertOne(coupon)
  return formatCoupon(coupon)
}

export async function updateCoupon(id, data) {
  const db = getDb()
  const updates = {
    code: data.code?.toUpperCase(),
    discount: data.discount,
    type: data.type,
    maxUses: data.maxUses,
    minAmount: data.minAmount,
    expires: data.expires
  }
  await db.collection('coupons').updateOne({ _id: id }, { $set: updates })
  const coupon = await db.collection('coupons').findOne({ _id: id })
  return formatCoupon(coupon)
}

export async function deleteCoupon(id) {
  const db = getDb()
  await db.collection('coupons').deleteOne({ _id: id })
}

export async function incrementCouponUses(code) {
  const db = getDb()
  await db.collection('coupons').updateOne({ code: code.toUpperCase() }, { $inc: { uses: 1 } })
}

export async function toggleCoupon(id) {
  const db = getDb()
  const coupon = await db.collection('coupons').findOne({ _id: id })
  if (!coupon) return null
  await db.collection('coupons').updateOne({ _id: id }, { $set: { active: !coupon.active } })
  const updated = await db.collection('coupons').findOne({ _id: id })
  return formatCoupon(updated)
}

export async function validateCoupon(code, subtotal) {
  const coupon = await getCouponByCode(code)
  if (!coupon) return { valid: false, error: 'Cupón no encontrado' }
  if (!coupon.active) return { valid: false, error: 'Cupón inactivo' }
  if (coupon.expires && new Date(coupon.expires) < new Date()) return { valid: false, error: 'Cupón expirado' }
  if (coupon.uses >= coupon.maxUses) return { valid: false, error: 'Cupón agotado' }
  if (coupon.minAmount > 0 && subtotal < coupon.minAmount) return { valid: false, error: `Mínimo de compra: $${coupon.minAmount}` }

  let discount = 0
  if (coupon.type === 'percent') {
    discount = subtotal * (coupon.discount / 100)
  } else if (coupon.type === 'fixed') {
    discount = coupon.discount
  } else if (coupon.type === 'free_shipping') {
    discount = 0
  }

  return { valid: true, coupon, discount, type: coupon.type }
}
