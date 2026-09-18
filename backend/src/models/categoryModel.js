import { getDb } from '../database/connection.js'

function formatCategory(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function getAllCategories() {
  const db = getDb()
  const categories = await db.collection('categories').find().sort({ name: 1 }).toArray()
  return categories.map(formatCategory)
}

export async function getCategoryById(id) {
  const db = getDb()
  const category = await db.collection('categories').findOne({ _id: id })
  return formatCategory(category)
}

export async function createCategory({ id, name, slug, image }) {
  const db = getDb()
  const category = { _id: id, name, slug, image, createdAt: new Date() }
  await db.collection('categories').insertOne(category)
  return formatCategory(category)
}

export async function deleteCategory(id) {
  const db = getDb()
  await db.collection('categories').deleteOne({ _id: id })
}
