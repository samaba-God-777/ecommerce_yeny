import { Router } from 'express'
import { registerUser, loginUser, getUserById } from '../services/authService.js'
import { updateProfile, updatePassword, getAllUsers } from '../models/userModel.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../schemas/index.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  const result = await registerUser(username, email, password)
  if (!result.success) return res.status(400).json(result)
  res.status(201).json(result)
}))

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { username, password } = req.body
  const result = await loginUser(username, password)
  if (!result.success) return res.status(401).json(result)

  res.cookie('adminToken', result.token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json(result)
}))

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id)
  if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
  res.json({ success: true, user })
}))

router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body)
  res.json({ success: true, user })
}))

router.put('/me/password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const { verifyPassword } = await import('../models/userModel.js')
  const user = await getUserById(req.user.id)
  if (!verifyPassword(user, currentPassword)) {
    return res.status(400).json({ success: false, error: 'Contraseña actual incorrecta' })
  }
  await updatePassword(req.user.id, newPassword)
  res.json({ success: true, message: 'Contraseña actualizada' })
}))

router.post('/logout', (req, res) => {
  res.clearCookie('adminToken')
  res.json({ success: true, message: 'Sesión cerrada' })
})

router.get('/users', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const users = await getAllUsers()
  res.json({ success: true, users })
}))

export default router
