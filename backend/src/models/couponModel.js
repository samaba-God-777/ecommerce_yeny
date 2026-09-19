import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

const COLLECTION = 'coupons'

function formatCoupon(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function getAllCoupons() {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(formatCoupon)
}

export async function getCouponByCode(code) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).where('code', '==', code.toUpperCase()).limit(1).get()
  if (snapshot.empty) return null
  return formatCoupon(snapshot.docs[0])
}

export async function createCoupon(data) {
  const db = getDb()
  const id = data.id || uuidv4()
  const coupon = {
    code: data.code.toUpperCase(),
    discount: data.discount,
    type: data.type,
    uses: 0,
    maxUses: data.maxUses || 100,
    minAmount: data.minAmount || 0,
    expires: data.expires || null,
    active: true,
    createdAt: new Date().toISOString()
  }
  await db.collection(COLLECTION).doc(id).set(coupon)
  return { id, ...coupon }
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
  await db.collection(COLLECTION).doc(id).update(updates)
  const doc = await db.collection(COLLECTION).doc(id).get()
  return formatCoupon(doc)
}

export async function deleteCoupon(id) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).delete()
}

export async function incrementCouponUses(code) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).where('code', '==', code.toUpperCase()).limit(1).get()
  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    await doc.ref.update({ uses: (doc.data().uses || 0) + 1 })
  }
}

export async function toggleCoupon(id) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  await doc.ref.update({ active: !doc.data().active })
  const updated = await db.collection(COLLECTION).doc(id).get()
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
