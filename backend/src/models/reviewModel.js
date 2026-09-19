import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

const coleccion = () => getDb().collection('reviews')

const formatReview = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)

export async function getReviewsByProduct(productId) {
  // Se ordena en memoria: where + orderBy pediria un indice compuesto que
  // habria que crear a mano en la consola de Firebase.
  const snap = await coleccion().where('productId', '==', productId).get()
  return snap.docs
    .map(formatReview)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export async function createReview({ productId, author, rating, comment }) {
  const id = uuidv4()
  const review = {
    productId,
    author,
    rating: Number(rating),
    comment,
    createdAt: new Date()
  }
  await coleccion().doc(id).set(review)
  return { id, ...review }
}
