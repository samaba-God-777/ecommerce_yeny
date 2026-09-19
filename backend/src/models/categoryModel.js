import { getDb } from '../database/firestore.js'

const COLLECTION = 'categories'

function formatCategory(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function getAllCategories() {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).orderBy('name').get()
  return snapshot.docs.map(formatCategory)
}

export async function getCategoryById(id) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return formatCategory(doc)
}

export async function createCategory({ id, name, slug, image }) {
  const db = getDb()
  const category = { name, slug, image: image || null, createdAt: new Date().toISOString() }
  await db.collection(COLLECTION).doc(id).set(category)
  return { id, ...category }
}

export async function deleteCategory(id) {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).delete()
}
