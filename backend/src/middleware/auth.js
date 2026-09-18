import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'yenyleths-dev-secret-key-2026'

function authenticate(req, res, next) {
  let token = null

  // Check Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // Check cookie (for admin panel cross-origin)
  if (!token && req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado. Token requerido.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado.' })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Acceso denegado. Se requieren permisos de administrador.' })
  }
  next()
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.substring(7), JWT_SECRET)
    } catch {
      // Ignore invalid tokens in optional auth
    }
  }
  next()
}

export { authenticate, requireAdmin, optionalAuth }
