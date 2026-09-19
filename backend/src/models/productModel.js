import { getDb, FieldValue } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

const COLLECTION = 'products'

function formatProduct(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function getAllProducts(filters = {}) {
  const db = getDb()
  let query = db.collection(COLLECTION)

  if (filters.categoryId) query = query.where('categoryId', '==', filters.categoryId)
  if (filters.flashSale === 'true') query = query.where('isFlashSale', '==', true)
  if (filters.bestSeller === 'true') query = query.where('isBestSeller', '==', true)
  if (filters.trending === 'true') query = query.where('isTrending', '==', true)

  query = query.orderBy('createdAt', 'desc')

  const snapshot = await query.get()
  return snapshot.docs.map(formatProduct)
}

export async function getProductById(id) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return formatProduct(doc)
}

export async function searchProducts({ q, categoryId, minPrice, maxPrice, sortBy }) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).get()

  let results = snapshot.docs.map(formatProduct).filter(p => {
    const searchLower = q.toLowerCase()
    return (p.name?.toLowerCase().includes(searchLower) ||
            p.brand?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower))
  })

  if (categoryId) results = results.filter(p => p.categoryId === categoryId)
  if (minPrice) results = results.filter(p => p.price >= Number(minPrice))
  if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice))

  switch (sortBy) {
    case 'price_asc': results.sort((a, b) => a.price - b.price); break
    case 'price_desc': results.sort((a, b) => b.price - a.price); break
    case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break
    case 'rating': results.sort((a, b) => b.rating - a.rating); break
    default: results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return results
}

export async function createProduct(data) {
  const db = getDb()
  const id = data.id || uuidv4()
  const product = {
    name: data.name,
    categoryId: data.categoryId,
    brand: data.brand || '',
    price: Number(data.price),
    oldPrice: data.oldPrice || null,
    image: data.image || 'product-placeholder.webp',
    description: data.description || '',
    stock: Number(data.stock) || 0,
    rating: Number(data.rating) || 4.5,
    isFlashSale: !!data.isFlashSale,
    flashSalePrice: data.flashSalePrice || null,
    flashSaleEnd: data.flashSaleEnd || null,
    isBestSeller: !!data.isBestSeller,
    isTrending: !!data.isTrending,
    createdAt: new Date().toISOString()
  }
  await db.collection(COLLECTION).doc(id).set(product)
  return { id, ...product }
}

export async function updateProduct(id, data) {
  const db = getDb()
  const existing = await getProductById(id)
  if (!existing) return null

  const updates = {
    name: data.name || existing.name,
    categoryId: data.categoryId || existing.categoryId,
    brand: data.brand !== undefined ? data.brand : existing.brand,
    price: data.price !== undefined ? Number(data.price) : existing.price,
    description: data.description !== undefined ? data.description : existing.description,
    stock: data.stock !== undefined ? Number(data.stock) : existing.stock,
    image: data.image || existing.image,
    isFlashSale: data.isFlashSale !== undefined ? !!data.isFlashSale : existing.isFlashSale,
    flashSalePrice: data.flashSalePrice !== undefined ? data.flashSalePrice : existing.flashSalePrice,
    flashSaleEnd: data.flashSaleEnd !== undefined ? data.flashSaleEnd : existing.flashSaleEnd,
    isBestSeller: data.isBestSeller !== undefined ? !!data.isBestSeller : existing.isBestSeller,
    isTrending: data.isTrending !== undefined ? !!data.isTrending : existing.isTrending
  }

  await db.collection(COLLECTION).doc(id).update(updates)
  return getProductById(id)
}

export async function updateProductFlags(id, flags) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).update(flags)
  return getProductById(id)
}

export async function deleteProduct(id) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).delete()
}

export async function getLowStock(threshold = 5) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION)
    .where('stock', '>', 0)
    .where('stock', '<', threshold)
    .orderBy('stock', 'asc')
    .get()
  return snapshot.docs.map(formatProduct)
}

export async function decrementStock(id, qty) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (doc.exists && doc.data().stock >= qty) {
    await db.collection(COLLECTION).doc(id).update({ stock: FieldValue.increment(-qty) })
  }
}

export async function restoreStock(id, qty) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).update({ stock: FieldValue.increment(qty) })
}
