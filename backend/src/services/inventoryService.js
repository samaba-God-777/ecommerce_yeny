import { getDb } from '../database/connection.js'
import { getLowStock as getLowStockProducts } from '../models/productModel.js'

export function decrementStock(productId, quantity) {
  getDb().prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?').run(quantity, productId, quantity)
}

export function restoreStock(productId, quantity) {
  getDb().prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(quantity, productId)
}

export function checkLowStock(threshold = 5) {
  return getLowStockProducts(threshold)
}

export function getStockAlerts() {
  const lowStock = checkLowStock(5)
  const outOfStock = getDb().prepare('SELECT * FROM products WHERE stock = 0').all()
  return { lowStock, outOfStock }
}
