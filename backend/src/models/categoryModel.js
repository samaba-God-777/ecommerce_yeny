import { getDb } from '../database/connection.js'

export function getAllCategories() {
  return getDb().prepare('SELECT * FROM categories ORDER BY name').all()
}

export function getCategoryById(id) {
  return getDb().prepare('SELECT * FROM categories WHERE id = ?').get(id)
}

export function createCategory({ id, name, slug, image }) {
  getDb().prepare(
    'INSERT INTO categories (id, name, slug, image) VALUES (?, ?, ?, ?)'
  ).run(id, name, slug, image)
  return getCategoryById(id)
}

export function deleteCategory(id) {
  getDb().prepare('DELETE FROM categories WHERE id = ?').run(id)
}
