import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { createUser, getUserByUsername, getUserByEmail, getUserById, verifyPassword } from '../models/userModel.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yenyleths-dev-secret-key-2026'

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: !!user.isAdmin },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export function registerUser(username, email, password) {
  const existingUsername = getUserByUsername(username)
  if (existingUsername) return { success: false, error: 'El usuario ya existe' }

  const existingEmail = getUserByEmail(email)
  if (existingEmail) return { success: false, error: 'El correo ya está registrado' }

  const user = createUser({ id: uuidv4(), username, email, password })
  const token = generateToken(user)

  return {
    success: true,
    user: { id: user.id, username: user.username, email: user.email, isAdmin: false },
    token
  }
}

export function loginUser(identifier, password) {
  const isEmail = identifier.includes('@')
  const user = isEmail ? getUserByEmail(identifier) : getUserByUsername(identifier)
  if (!user) return { success: false, error: 'Usuario o contraseña incorrectos' }

  const valid = verifyPassword(user, password)
  if (!valid) return { success: false, error: 'Usuario o contraseña incorrectos' }

  const token = generateToken(user)

  return {
    success: true,
    user: { id: user.id, username: user.username, email: user.email, isAdmin: !!user.isAdmin },
    token
  }
}

export { getUserById, generateToken }
