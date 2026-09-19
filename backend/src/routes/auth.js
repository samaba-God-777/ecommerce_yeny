import { Router } from 'express'
import { ensureProfile, getUserById, updateProfile, getAllUsers, setAdmin } from '../services/authService.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

/**
 * Rutas de cuenta.
 *
 * Registrarse, iniciar sesion y recuperar la contrasena ocurren en el cliente
 * contra Firebase Auth. Aqui solo queda el perfil, que vive en Firestore.
 */

// Crea el perfil tras registrarse en el cliente. Es idempotente: si ya existe,
// devuelve el que hay, asi el front puede llamarla sin miedo en cada arranque.
router.post('/ensure-profile', authenticate, asyncHandler(async (req, res) => {
  const result = await ensureProfile(req.user.id, {
    username: req.body.username,
    email: req.body.email || req.user.email
  })
  if (!result.success) return res.status(400).json(result)
  res.status(result.creado ? 201 : 200).json(result)
}))

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id)
  if (!user) {
    // Cuenta valida en Auth sin perfil: el front llama a /ensure-profile
    return res.status(404).json({ success: false, error: 'Perfil no encontrado', needsProfile: true })
  }
  res.json({ success: true, user })
}))

router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body)
  res.json({ success: true, user })
}))

router.get('/users', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const users = await getAllUsers()
  res.json({ success: true, users })
}))

// Dar o quitar permisos de administrador. El cambio viaja en el token, asi que
// al afectado le aplica cuando su sesion renueva el token (hasta una hora).
router.put('/users/:id/admin', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await setAdmin(req.params.id, !!req.body.isAdmin)
  res.json({ success: true, message: 'Permisos actualizados' })
}))

// La sesion la cierra el cliente con Firebase; aqui solo se limpia la cookie
// que usa el panel para sobrevivir a la recarga.
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken')
  res.json({ success: true, message: 'Sesión cerrada' })
})

export default router
