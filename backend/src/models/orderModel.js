import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'
import { decrementStock, restoreStock } from './productModel.js'

const COLLECTION = 'orders'

function formatOrder(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function createOrder({ customerId, customerName, customerEmail, customerPhone, address, paymentMethod, items, subtotal, shipping, tax, total, couponCode }) {
  const db = getDb()
  const id = 'ORD-' + uuidv4().slice(0, 8).toUpperCase()
  const now = new Date().toISOString()

  const order = {
    customerId: customerId || null,
    customerName,
    customerEmail,
    customerPhone,
    address,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    subtotal,
    shipping,
    tax,
    total,
    couponCode: couponCode || null,
    items: items.map(item => ({
      id: uuidv4(),
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage || '',
      price: item.price,
      quantity: item.quantity,
      size: item.size || '',
      color: item.color || ''
    })),
    createdAt: now,
    updatedAt: now
  }

  await db.collection(COLLECTION).doc(id).set(order)

  for (const item of items) {
    await decrementStock(item.productId, item.quantity)
  }

  return getOrderById(id)
}

export async function getAllOrders(filters = {}) {
  const db = getDb()
  let query = db.collection(COLLECTION)

  if (filters.status) query = query.where('orderStatus', '==', filters.status)
  if (filters.customerId) query = query.where('customerId', '==', filters.customerId)

  query = query.orderBy('createdAt', 'desc')
  const snapshot = await query.get()
  return snapshot.docs.map(formatOrder)
}

export async function getOrderById(id) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return formatOrder(doc)
}

export async function getOrdersByCustomer(customerId) {
  return getAllOrders({ customerId })
}

export async function updateOrderStatus(id, status) {
  const db = getDb()
  const order = await getOrderById(id)
  if (!order) return null

  if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await restoreStock(item.productId, item.quantity)
    }
  }

  await db.collection(COLLECTION).doc(id).update({ orderStatus: status, updatedAt: new Date().toISOString() })
  return getOrderById(id)
}

export async function updateOrderPayment(id, paymentStatus) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).update({ paymentStatus, updatedAt: new Date().toISOString() })
  return getOrderById(id)
}

export async function getOrdersStats() {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).get()
  const orders = snapshot.docs.map(formatOrder)

  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  return { totalOrders, totalRevenue, avgTicket }
}
