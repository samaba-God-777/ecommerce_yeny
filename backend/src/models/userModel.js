import { getDb } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

const COLLECTION = 'users'

function formatUser(doc) {
  if (!doc) return null
  return { id: doc.id, ...doc.data() }
}

export async function createUser({ id, username, email, password, isAdmin = false }) {
  const db = getDb()
  const passwordHash = bcrypt.hashSync(password, 10)
  const user = {
    username,
    email,
    passwordHash,
    isAdmin: !!isAdmin,
    phone: '',
    address: '',
    createdAt: new Date().toISOString()
  }
  await db.collection(COLLECTION).doc(id || uuidv4()).set(user)
  return getUserByUsername(username)
}

export async function getUserByUsername(username) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).where('username', '==', username).limit(1).get()
  if (snapshot.empty) return null
  return formatUser(snapshot.docs[0])
}

export async function getUserByEmail(email) {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).where('email', '==', email).limit(1).get()
  if (snapshot.empty) return null
  return formatUser(snapshot.docs[0])
}

export async function getUserById(id) {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return formatUser(doc)
}

export async function getAllUsers() {
  const db = getDb()
  const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(formatUser)
}

export async function updatePassword(id, newPassword) {
  const db = getDb()
  const hash = bcrypt.hashSync(newPassword, 10)
  await db.collection(COLLECTION).doc(id).update({ passwordHash: hash })
}

export async function updateProfile(id, data) {
  const db = getDb()
  const updates = {}
  for (const key of ['username', 'email', 'phone', 'address']) {
    if (data[key] !== undefined) updates[key] = data[key]
  }
  if (Object.keys(updates).length > 0) {
    await db.collection(COLLECTION).doc(id).update(updates)
  }
  return getUserById(id)
}

export function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash)
}
