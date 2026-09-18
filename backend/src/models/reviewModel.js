import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'

function formatReview(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function getReviewsByProduct(productId) {
  const db = getDb()
  const reviews = await db.collection('reviews').find({ productId }).sort({ createdAt: -1 }).toArray()
  return reviews.map(formatReview)
}

export async function createReview({ productId, author, rating, comment }) {
  const db = getDb()
  const id = uuidv4()
  const review = {
    _id: id,
    productId,
    author,
    rating: Number(rating),
    comment,
    createdAt: new Date()
  }
  await db.collection('reviews').insertOne(review)
  return formatReview(review)
}
