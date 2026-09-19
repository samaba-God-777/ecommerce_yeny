import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'
import { decrementStock, restoreStock } from './productModel.js'
import logger from '../utils/logger.js'

const coleccion = () => getDb().collection('orders')

const formatOrder = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)

// Igual que en productos: se filtra con where() y se ordena en memoria, para no
// depender de indices compuestos creados a mano en la consola de Firebase.
const TOPE_LECTURA = 2000

const porFecha = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)

export async function createOrder({ customerId, customerName, customerEmail, customerPhone, address, paymentMethod, items, subtotal, shipping, tax, total, couponCode }) {
  const id = 'ORD-' + uuidv4().slice(0, 8).toUpperCase()
  const now = new Date()

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

  await coleccion().doc(id).set(order)

  for (const item of items) {
    const descontado = await decrementStock(item.productId, item.quantity)
    if (!descontado) {
      // Antes pasaba igual pero en silencio: el pedido queda registrado y el
      // stock sin tocar, asi que conviene que se vea en el log.
      logger.warn(`Pedido ${id}: sin stock suficiente de ${item.productId} (x${item.quantity})`)
    }
  }

  return getOrderById(id)
}

export async function getAllOrders(filters = {}) {
  let query = coleccion()
  if (filters.status) query = query.where('orderStatus', '==', filters.status)
  if (filters.customerId) query = query.where('customerId', '==', filters.customerId)

  const snap = await query.limit(TOPE_LECTURA).get()
  return snap.docs.map(formatOrder).sort(porFecha)
}

export async function getOrderById(id) {
  return formatOrder(await coleccion().doc(String(id)).get())
}

export async function getOrdersByCustomer(customerId) {
  return getAllOrders({ customerId })
}

export async function updateOrderStatus(id, status) {
  const order = await getOrderById(id)
  if (!order) return null

  if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await restoreStock(item.productId, item.quantity)
    }
  }

  await coleccion().doc(String(id)).update({ orderStatus: status, updatedAt: new Date() })
  return getOrderById(id)
}

export async function updateOrderPayment(id, paymentStatus) {
  await coleccion().doc(String(id)).update({ paymentStatus, updatedAt: new Date() })
  return getOrderById(id)
}

export async function getOrdersStats() {
  const snap = await coleccion().limit(TOPE_LECTURA).get()
  const orders = snap.docs.map(formatOrder)

  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  return { totalOrders, totalRevenue, avgTicket }
}
