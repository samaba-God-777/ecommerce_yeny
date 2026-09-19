import { getDb } from '../database/firestore.js'

const coleccion = () => getDb().collection('categories')

const formatCategory = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)

export async function getAllCategories() {
  const snap = await coleccion().orderBy('name').get()
  return snap.docs.map(formatCategory)
}

export async function getCategoryById(id) {
  return formatCategory(await coleccion().doc(String(id)).get())
}

export async function createCategory({ id, name, slug, image }) {
  const category = { name, slug, image, createdAt: new Date() }
  await coleccion().doc(String(id)).set(category)
  return { id: String(id), ...category }
}

export async function deleteCategory(id) {
  await coleccion().doc(String(id)).delete()
}
