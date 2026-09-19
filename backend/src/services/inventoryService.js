import { getDb } from '../database/firestore.js'
import {
  getLowStock as getLowStockProducts,
  decrementStock as decrementProductStock,
  restoreStock as restoreProductStock
} from '../models/productModel.js'

// El control de stock vive en productModel: alli el descuento va dentro de una
// transaccion para que dos compras del ultimo articulo no lo dejen negativo.
export const decrementStock = decrementProductStock
export const restoreStock = restoreProductStock

export async function checkLowStock(threshold = 5) {
  return getLowStockProducts(threshold)
}

export async function getStockAlerts() {
  const lowStock = await checkLowStock(5)
  const snap = await getDb().collection('products').where('stock', '==', 0).get()
  const outOfStock = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return { lowStock, outOfStock }
}
