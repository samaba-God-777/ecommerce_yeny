import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

export function getReviewsByProduct(productId) {
  return getDb().prepare('SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC').all(productId)
}

export function createReview({ productId, author, rating, comment }) {
  const id = uuidv4()
  getDb().prepare(
    'INSERT INTO reviews (id, productId, author, rating, comment) VALUES (?, ?, ?, ?, ?)'
  ).run(id, productId, author, rating, comment)
  return getDb().prepare('SELECT * FROM reviews WHERE id = ?').get(id)
}
