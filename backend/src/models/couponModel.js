import { getDb, FieldValue } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

const coleccion = () => getDb().collection('coupons')

const formatCoupon = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)

export async function getAllCoupons() {
  const snap = await coleccion().get()
  return snap.docs
    .map(formatCoupon)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export async function getCouponByCode(code) {
  const snap = await coleccion().where('code', '==', String(code).toUpperCase()).limit(1).get()
  return snap.empty ? null : formatCoupon(snap.docs[0])
}

export async function createCoupon(data) {
  const id = String(data.id || uuidv4())
  const coupon = {
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
  await coleccion().doc(id).set(coupon)
  return { id, ...coupon }
}

export async function updateCoupon(id, data) {
  // Firestore rechaza los undefined, asi que solo se mandan los campos que
  // realmente vienen en la peticion.
  const updates = {}
  if (data.code !== undefined) updates.code = String(data.code).toUpperCase()
  for (const campo of ['discount', 'type', 'maxUses', 'minAmount', 'expires']) {
    if (data[campo] !== undefined) updates[campo] = data[campo]
  }

  const ref = coleccion().doc(String(id))
  if (Object.keys(updates).length) await ref.update(updates)
  return formatCoupon(await ref.get())
}

export async function deleteCoupon(id) {
  await coleccion().doc(String(id)).delete()
}

export async function incrementCouponUses(code) {
  const cupon = await getCouponByCode(code)
  if (!cupon) return
  await coleccion().doc(cupon.id).update({
    uses: FieldValue.increment(1)
  })
}

export async function toggleCoupon(id) {
  const ref = coleccion().doc(String(id))
  const doc = await ref.get()
  if (!doc.exists) return null
  await ref.update({ active: !doc.data().active })
  return formatCoupon(await ref.get())
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
