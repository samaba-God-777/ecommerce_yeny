import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

function formatProduct(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function getAllProducts(filters = {}) {
  const db = getDb()
  const query = {}

  if (filters.categoryId) query.categoryId = filters.categoryId
  if (filters.flashSale === 'true') query.isFlashSale = true
  if (filters.bestSeller === 'true') query.isBestSeller = true
  if (filters.trending === 'true') query.isTrending = true

  const products = await db.collection('products').find(query).sort({ createdAt: -1 }).toArray()
  return products.map(formatProduct)
}

export async function getProductById(id) {
  const db = getDb()
  const product = await db.collection('products').findOne({ _id: id })
  return formatProduct(product)
}

export async function searchProducts({ q, categoryId, minPrice, maxPrice, sortBy }) {
  const db = getDb()
  const query = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  }

  if (categoryId) query.categoryId = categoryId
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) }
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) }

  let sort = { createdAt: -1 }
  switch (sortBy) {
    case 'price_asc': sort = { price: 1 }; break
    case 'price_desc': sort = { price: -1 }; break
    case 'name': sort = { name: 1 }; break
    case 'rating': sort = { rating: -1 }; break
  }

  const results = await db.collection('products').find(query).sort(sort).toArray()
  return results.map(formatProduct)
}

export async function createProduct(data) {
  const db = getDb()
  const id = data.id || uuidv4()
  const product = {
    _id: id,
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
    createdAt: new Date()
  }
  await db.collection('products').insertOne(product)
  return formatProduct(product)
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

  await db.collection('products').updateOne({ _id: id }, { $set: updates })
  return getProductById(id)
}

export async function updateProductFlags(id, flags) {
  const db = getDb()
  await db.collection('products').updateOne({ _id: id }, { $set: flags })
  return getProductById(id)
}

export async function deleteProduct(id) {
  const db = getDb()
  await db.collection('products').deleteOne({ _id: id })
}

export async function getLowStock(threshold = 5) {
  const db = getDb()
  const products = await db.collection('products').find({ stock: { $gt: 0, $lt: threshold } }).sort({ stock: 1 }).toArray()
  return products.map(formatProduct)
}

export async function decrementStock(id, qty) {
  const db = getDb()
  await db.collection('products').updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } })
}

export async function restoreStock(id, qty) {
  const db = getDb()
  await db.collection('products').updateOne({ _id: id }, { $inc: { stock: qty } })
}
