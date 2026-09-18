import { getDb } from '../database/connection.js'
import { getLowStock as getLowStockProducts } from '../models/productModel.js'

export async function decrementStock(productId, quantity) {
  const db = getDb()
  await db.collection('products').updateOne({ _id: productId, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })
}

export async function restoreStock(productId, quantity) {
  const db = getDb()
  await db.collection('products').updateOne({ _id: productId }, { $inc: { stock: quantity } })
}

export async function checkLowStock(threshold = 5) {
  return getLowStockProducts(threshold)
}

export async function getStockAlerts() {
  const db = getDb()
  const lowStock = await checkLowStock(5)
  const outOfStock = await db.collection('products').find({ stock: 0 }).toArray()
  return { lowStock, outOfStock }
}
