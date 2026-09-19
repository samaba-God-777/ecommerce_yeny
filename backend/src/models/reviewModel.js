import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

const COLLECTION = 'reviews'

function formatReview(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function getReviewsByProduct(productId) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).where('productId', '==', productId).orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(formatReview)
}

export async function createReview({ productId, author, rating, comment }) {
  const db = getDb()
  const id = uuidv4()
  const review = {
    productId,
    author,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  }
  await db.collection(COLLECTION).doc(id).set(review)
  return { id, ...review }
}
