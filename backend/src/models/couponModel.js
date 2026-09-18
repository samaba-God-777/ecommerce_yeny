import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

export function getAllCoupons() {
  return getDb().prepare('SELECT * FROM coupons ORDER BY createdAt DESC').all()
}

export function getCouponByCode(code) {
  return getDb().prepare('SELECT * FROM coupons WHERE code = ?').get(code.toUpperCase())
}

export function createCoupon(data) {
  const id = data.id || uuidv4()
  getDb().prepare(`
    INSERT INTO coupons (id, code, discount, type, maxUses, minAmount, expires, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.code.toUpperCase(), data.discount, data.type, data.maxUses || 100, data.minAmount || 0, data.expires || null, 1)
  return getCouponByCode(data.code)
}

export function updateCoupon(id, data) {
  const sets = ['code=?', 'discount=?', 'type=?', 'maxUses=?', 'minAmount=?', 'expires=?']
  const params = [data.code?.toUpperCase(), data.discount, data.type, data.maxUses, data.minAmount, data.expires, id]
  getDb().prepare(`UPDATE coupons SET ${sets.join(',')} WHERE id=?`).run(...params)
  return getDb().prepare('SELECT * FROM coupons WHERE id=?').get(id)
}

export function deleteCoupon(id) {
  getDb().prepare('DELETE FROM coupons WHERE id=?').run(id)
}

export function incrementCouponUses(code) {
  getDb().prepare('UPDATE coupons SET uses = uses + 1 WHERE code = ?').run(code.toUpperCase())
}

export function toggleCoupon(id) {
  getDb().prepare('UPDATE coupons SET active = CASE WHEN active THEN 0 ELSE 1 END WHERE id=?').run(id)
  return getDb().prepare('SELECT * FROM coupons WHERE id=?').get(id)
}

export function validateCoupon(code, subtotal) {
  const coupon = getCouponByCode(code)
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
    discount = 0 // handled separately
  }

  return { valid: true, coupon, discount, type: coupon.type }
}
