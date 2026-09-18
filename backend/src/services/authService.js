import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import {
  createUser, getUserByUsername, getUserByEmail, getUserById, verifyPassword,
  savePasswordResetToken, getUserByResetToken, clearPasswordResetToken, updatePassword
} from '../models/userModel.js'
import { sendMail, passwordResetEmail, mailConfigured } from './mailService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'yenyleths-dev-secret-key-2026'

// Ventana corta: el enlace llega al correo y se usa enseguida.
const RESET_TTL_MINUTES = 30

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: !!user.isAdmin },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export async function registerUser(username, email, password) {
  const existingUsername = await getUserByUsername(username)
  if (existingUsername) return { success: false, error: 'El usuario ya existe' }

  const existingEmail = await getUserByEmail(email)
  if (existingEmail) return { success: false, error: 'El correo ya está registrado' }

  const user = await createUser({ id: uuidv4(), username, email, password })
  const token = generateToken(user)

  return {
    success: true,
    user: { id: user.id, username: user.username, email: user.email, isAdmin: false },
    token
  }
}

export async function loginUser(identifier, password) {
  const isEmail = identifier.includes('@')
  const user = isEmail ? await getUserByEmail(identifier) : await getUserByUsername(identifier)
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

/**
 * Manda el enlace de recuperacion al correo indicado.
 *
 * Responde igual exista o no la cuenta: si dijera "ese correo no existe",
 * cualquiera podria averiguar quien esta registrado en la tienda.
 */
export async function requestPasswordReset(email, appUrl) {
  const user = await getUserByEmail(email)
  if (!user) return { success: true, mailed: false }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000)
  await savePasswordResetToken(user.id, hashToken(token), expiresAt)

  const url = `${appUrl.replace(/\/$/, '')}/reset-password?token=${token}`
  const { subject, html, text } = passwordResetEmail({
    username: user.username,
    url,
    minutes: RESET_TTL_MINUTES
  })

  await sendMail({ to: user.email, subject, html, text })
  return { success: true, mailed: mailConfigured }
}

/**
 * Cambia la contrasena con el token del correo. El token se quema al usarlo,
 * asi el mismo enlace no sirve dos veces.
 */
export async function resetPassword(token, newPassword) {
  const user = await getUserByResetToken(hashToken(token))
  if (!user) {
    return { success: false, error: 'El enlace no es válido o ya venció. Pide uno nuevo.' }
  }

  await updatePassword(user.id, newPassword)
  await clearPasswordResetToken(user.id)
  return { success: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' }
}

export { getUserById, generateToken }
