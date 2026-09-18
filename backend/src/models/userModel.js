import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export function createUser({ id, username, email, password, isAdmin = 0 }) {
  const passwordHash = bcrypt.hashSync(password, 10)
  getDb().prepare(
    'INSERT INTO users (id, username, email, passwordHash, isAdmin) VALUES (?, ?, ?, ?, ?)'
  ).run(id || uuidv4(), username, email, passwordHash, isAdmin ? 1 : 0)
  return getUserByUsername(username)
}

export function getUserByUsername(username) {
  return getDb().prepare('SELECT * FROM users WHERE username = ?').get(username)
}

export function getUserByEmail(email) {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export function getUserById(id) {
  return getDb().prepare('SELECT id, username, email, isAdmin, phone, address, createdAt FROM users WHERE id = ?').get(id)
}

export function getAllUsers() {
  return getDb().prepare('SELECT id, username, email, isAdmin, phone, address, createdAt FROM users ORDER BY createdAt DESC').all()
}

export function updatePassword(id, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10)
  getDb().prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(hash, id)
}

export function updateProfile(id, data) {
  const sets = []
  const params = []
  for (const key of ['username', 'email', 'phone', 'address']) {
    if (data[key] !== undefined) {
      sets.push(`${key}=?`)
      params.push(data[key])
    }
  }
  if (sets.length > 0) {
    params.push(id)
    getDb().prepare(`UPDATE users SET ${sets.join(',')} WHERE id=?`).run(...params)
  }
  return getUserById(id)
}

export function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash)
}
