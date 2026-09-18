import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

function rowToProduct(row) {
  if (!row) return null
  return {
    ...row,
    isFlashSale: !!row.isFlashSale,
    isBestSeller: !!row.isBestSeller,
    isTrending: !!row.isTrending,
    oldPrice: row.oldPrice || null,
    flashSalePrice: row.flashSalePrice || null,
    flashSaleEnd: row.flashSaleEnd || null
  }
}

export function getAllProducts(filters = {}) {
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params = []

  if (filters.categoryId) {
    sql += ' AND categoryId = ?'
    params.push(filters.categoryId)
  }
  if (filters.flashSale === 'true') {
    sql += ' AND isFlashSale = 1'
  }
  if (filters.bestSeller === 'true') {
    sql += ' AND isBestSeller = 1'
  }
  if (filters.trending === 'true') {
    sql += ' AND isTrending = 1'
  }

  sql += ' ORDER BY createdAt DESC'

  return getDb().prepare(sql).all(...params).map(rowToProduct)
}

export function getProductById(id) {
  return rowToProduct(getDb().prepare('SELECT * FROM products WHERE id = ?').get(id))
}

export function searchProducts({ q, categoryId, minPrice, maxPrice, sortBy }) {
  let sql = 'SELECT * FROM products WHERE (name LIKE ? OR brand LIKE ? OR description LIKE ?)'
  const params = [`%${q}%`, `%${q}%`, `%${q}%`]

  if (categoryId) {
    sql += ' AND categoryId = ?'
    params.push(categoryId)
  }
  if (minPrice) {
    sql += ' AND price >= ?'
    params.push(Number(minPrice))
  }
  if (maxPrice) {
    sql += ' AND price <= ?'
    params.push(Number(maxPrice))
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc': sql += ' ORDER BY price ASC'; break
    case 'price_desc': sql += ' ORDER BY price DESC'; break
    case 'name': sql += ' ORDER BY name ASC'; break
    case 'rating': sql += ' ORDER BY rating DESC'; break
    default: sql += ' ORDER BY createdAt DESC'
  }

  const results = getDb().prepare(sql).all(...params)
  return results.map(rowToProduct)
}

export function createProduct(data) {
  const id = data.id || uuidv4()
  getDb().prepare(`
    INSERT INTO products (id, name, categoryId, brand, price, oldPrice, image, description, stock, rating, isFlashSale, flashSalePrice, flashSaleEnd, isBestSeller, isTrending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.name, data.categoryId, data.brand || '', data.price, data.oldPrice || null,
    data.image || 'product-placeholder.webp', data.description || '', data.stock || 0,
    data.rating || 4.5, data.isFlashSale ? 1 : 0, data.flashSalePrice || null,
    data.flashSaleEnd || null, data.isBestSeller ? 1 : 0, data.isTrending ? 1 : 0
  )
  return getProductById(id)
}

export function updateProduct(id, data) {
  const existing = getProductById(id)
  if (!existing) return null

  const updates = {
    name: data.name || existing.name,
    categoryId: data.categoryId || existing.categoryId,
    brand: data.brand !== undefined ? data.brand : existing.brand,
    price: data.price !== undefined ? Number(data.price) : existing.price,
    description: data.description !== undefined ? data.description : existing.description,
    stock: data.stock !== undefined ? Number(data.stock) : existing.stock,
    image: data.image || existing.image,
    isFlashSale: data.isFlashSale !== undefined ? (data.isFlashSale ? 1 : 0) : (existing.isFlashSale ? 1 : 0),
    flashSalePrice: data.flashSalePrice !== undefined ? data.flashSalePrice : existing.flashSalePrice,
    flashSaleEnd: data.flashSaleEnd !== undefined ? data.flashSaleEnd : existing.flashSaleEnd,
    isBestSeller: data.isBestSeller !== undefined ? (data.isBestSeller ? 1 : 0) : (existing.isBestSeller ? 1 : 0),
    isTrending: data.isTrending !== undefined ? (data.isTrending ? 1 : 0) : (existing.isTrending ? 1 : 0)
  }

  getDb().prepare(`
    UPDATE products SET name=?, categoryId=?, brand=?, price=?, description=?, stock=?, image=?, isFlashSale=?, flashSalePrice=?, flashSaleEnd=?, isBestSeller=?, isTrending=?
    WHERE id=?
  `).run(
    updates.name, updates.categoryId, updates.brand, updates.price, updates.description,
    updates.stock, updates.image, updates.isFlashSale, updates.flashSalePrice,
    updates.flashSaleEnd, updates.isBestSeller, updates.isTrending, id
  )

  return getProductById(id)
}

export function updateProductFlags(id, flags) {
  const sets = []
  const params = []
  for (const [key, value] of Object.entries(flags)) {
    sets.push(`${key}=?`)
    params.push(value)
  }
  params.push(id)
  getDb().prepare(`UPDATE products SET ${sets.join(',')} WHERE id=?`).run(...params)
  return getProductById(id)
}

export function deleteProduct(id) {
  getDb().prepare('DELETE FROM products WHERE id=?').run(id)
}

export function getLowStock(threshold = 5) {
  return getDb().prepare('SELECT * FROM products WHERE stock < ? AND stock > 0 ORDER BY stock ASC').all(threshold)
}

export function decrementStock(id, qty) {
  getDb().prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?').run(qty, id, qty)
}

export function restoreStock(id, qty) {
  getDb().prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(qty, id)
}
