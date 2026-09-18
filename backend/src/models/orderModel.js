import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'
import { decrementStock, restoreStock } from './productModel.js'

function formatOrder(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function createOrder({ customerId, customerName, customerEmail, customerPhone, address, paymentMethod, items, subtotal, shipping, tax, total, couponCode }) {
  const db = getDb()
  const id = 'ORD-' + uuidv4().slice(0, 8).toUpperCase()
  const now = new Date()

  const order = {
    _id: id,
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

  await db.collection('orders').insertOne(order)

  for (const item of items) {
    await decrementStock(item.productId, item.quantity)
  }

  return getOrderById(id)
}

export async function getAllOrders(filters = {}) {
  const db = getDb()
  const query = {}
  if (filters.status) query.orderStatus = filters.status
  if (filters.customerId) query.customerId = filters.customerId

  const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray()
  return orders.map(formatOrder)
}

export async function getOrderById(id) {
  const db = getDb()
  const order = await db.collection('orders').findOne({ _id: id })
  return formatOrder(order)
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

  await db.collection('orders').updateOne({ _id: id }, { $set: { orderStatus: status, updatedAt: new Date() } })
  return getOrderById(id)
}

export async function updateOrderPayment(id, paymentStatus) {
  const db = getDb()
  await db.collection('orders').updateOne({ _id: id }, { $set: { paymentStatus, updatedAt: new Date() } })
  return getOrderById(id)
}

export async function getOrdersStats() {
  const db = getDb()
  const orders = await db.collection('orders').find().toArray()

  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  return { totalOrders, totalRevenue, avgTicket }
}
