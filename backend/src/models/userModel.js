import { getDb } from '../database/connection.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

function formatUser(doc) {
  if (!doc) return null
  const { _id, passwordHash, ...rest } = doc
  return { id: _id.toString(), ...rest, passwordHash }
}

function formatUserPublic(doc) {
  if (!doc) return null
  const { _id, passwordHash, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

export async function createUser({ id, username, email, password, isAdmin = false }) {
  const db = getDb()
  const passwordHash = bcrypt.hashSync(password, 10)
  const user = {
    _id: id || uuidv4(),
    username,
    email,
    passwordHash,
    isAdmin: !!isAdmin,
    phone: '',
    address: '',
    createdAt: new Date()
  }
  await db.collection('users').insertOne(user)
  return formatUser(user)
}

export async function getUserByUsername(username) {
  const db = getDb()
  const user = await db.collection('users').findOne({ username })
  return formatUser(user)
}

export async function getUserByEmail(email) {
  const db = getDb()
  const user = await db.collection('users').findOne({ email })
  return formatUser(user)
}

export async function getUserById(id) {
  const db = getDb()
  const user = await db.collection('users').findOne({ _id: id })
  return formatUserPublic(user)
}

export async function getAllUsers() {
  const db = getDb()
  const users = await db.collection('users').find().sort({ createdAt: -1 }).toArray()
  return users.map(formatUserPublic)
}

export async function updatePassword(id, newPassword) {
  const db = getDb()
  const hash = bcrypt.hashSync(newPassword, 10)
  await db.collection('users').updateOne({ _id: id }, { $set: { passwordHash: hash } })
}

export async function updateProfile(id, data) {
  const db = getDb()
  const updates = {}
  for (const key of ['username', 'email', 'phone', 'address']) {
    if (data[key] !== undefined) updates[key] = data[key]
  }
  if (Object.keys(updates).length > 0) {
    await db.collection('users').updateOne({ _id: id }, { $set: updates })
  }
  return getUserById(id)
}

export function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash)
}
