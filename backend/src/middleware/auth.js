import { getAuth } from '../database/firestore.js'

/**
 * Autenticacion con Firebase Auth.
 *
 * El cliente inicia sesion contra Firebase y manda el ID token en la cabecera
 * Authorization. Aqui solo se verifica: el backend nunca ve contrasenas.
 *
 * "isAdmin" viaja dentro del token como custom claim, asi que no hace falta
 * leer Firestore para decidir permisos.
 */

function tokenDeLaPeticion(req) {
  const cabecera = req.headers.authorization
  if (cabecera && cabecera.startsWith('Bearer ')) return cabecera.substring(7)
  // El panel guarda el token en cookie para sobrevivir a la recarga
  if (req.cookies?.adminToken) return req.cookies.adminToken
  return null
}

async function usuarioDelToken(token) {
  const decoded = await getAuth().verifyIdToken(token)
  return {
    id: decoded.uid,
    uid: decoded.uid,
    email: decoded.email,
    username: decoded.name || decoded.email,
    isAdmin: !!decoded.isAdmin
  }
}

async function authenticate(req, res, next) {
  const token = tokenDeLaPeticion(req)
  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado. Token requerido.' })
  }

  try {
    req.user = await usuarioDelToken(token)
    next()
  } catch {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado.' })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, error: 'Acceso denegado. Se requieren permisos de administrador.' })
  }
  next()
}

async function optionalAuth(req, res, next) {
  const token = tokenDeLaPeticion(req)
  if (token) {
    try {
      req.user = await usuarioDelToken(token)
    } catch {
      // En las rutas opcionales, un token invalido se trata como visitante
    }
  }
  next()
}

export { authenticate, requireAdmin, optionalAuth }
