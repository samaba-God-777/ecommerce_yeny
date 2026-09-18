import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'
import { decrementStock, restoreStock } from './productModel.js'

export function createOrder({ customerId, customerName, customerEmail, customerPhone, address, paymentMethod, items, subtotal, shipping, tax, total, couponCode }) {
  const id = 'ORD-' + uuidv4().slice(0, 8).toUpperCase()
  const now = new Date().toISOString()

  getDb().prepare(`
    INSERT INTO orders (id, customerId, customerName, customerEmail, customerPhone, address, paymentMethod, paymentStatus, orderStatus, subtotal, shipping, tax, total, couponCode, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, customerId || null, customerName, customerEmail, customerPhone, address, paymentMethod, 'pending', 'pending', subtotal, shipping, tax, total, couponCode || null, now, now)

  // Insert items and decrement stock
  const insertItem = getDb().prepare(`
    INSERT INTO order_items (id, orderId, productId, productName, productImage, price, quantity, size, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const item of items) {
    insertItem.run(uuidv4(), id, item.productId, item.productName, item.productImage || '', item.price, item.quantity, item.size || '', item.color || '')
    decrementStock(item.productId, item.quantity)
  }

  return getOrderById(id)
}

export function getAllOrders(filters = {}) {
  let sql = `
    SELECT o.*,
      (SELECT json_group_array(json_object('id', oi.id, 'productId', oi.productId, 'productName', oi.productName, 'productImage', oi.productImage, 'price', oi.price, 'quantity', oi.quantity, 'size', oi.size, 'color', oi.color))
       FROM order_items oi WHERE oi.orderId = o.id) as items
    FROM orders o WHERE 1=1
  `
  const params = []

  if (filters.status) {
    sql += ' AND o.orderStatus = ?'
    params.push(filters.status)
  }
  if (filters.customerId) {
    sql += ' AND o.customerId = ?'
    params.push(filters.customerId)
  }

  sql += ' ORDER BY o.createdAt DESC'

  return getDb().prepare(sql).all(...params).map(row => ({
    ...row,
    items: JSON.parse(row.items || '[]'),
    total: row.total
  }))
}

export function getOrderById(id) {
  const row = getDb().prepare('SELECT * FROM orders WHERE id = ?').get(id)
  if (!row) return null
  const items = getDb().prepare('SELECT * FROM order_items WHERE orderId = ?').all(id)
  return { ...row, items }
}

export function getOrdersByCustomer(customerId) {
  return getAllOrders({ customerId })
}

export function updateOrderStatus(id, status) {
  const order = getOrderById(id)
  if (!order) return null

  // If cancelling, restore stock
  if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      restoreStock(item.productId, item.quantity)
    }
  }

  getDb().prepare('UPDATE orders SET orderStatus = ?, updatedAt = datetime(\'now\') WHERE id = ?').run(status, id)
  return getOrderById(id)
}

export function updateOrderPayment(id, paymentStatus) {
  getDb().prepare('UPDATE orders SET paymentStatus = ?, updatedAt = datetime(\'now\') WHERE id = ?').run(paymentStatus, id)
  return getOrderById(id)
}

export function getOrdersStats() {
  const stats = getDb().prepare(`
    SELECT
      COUNT(*) as totalOrders,
      COALESCE(SUM(CASE WHEN paymentStatus = 'paid' THEN total ELSE 0 END), 0) as totalRevenue,
      COALESCE(AVG(CASE WHEN paymentStatus = 'paid' THEN total END), 0) as avgTicket
    FROM orders
  `).get()

  return stats
}
