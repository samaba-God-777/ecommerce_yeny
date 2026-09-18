import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Rutas de recuperacion: llevan su propio cupo (passwordResetLimiter) y no
// gastan el de login. Se comparan contra req.path, que dentro de /api/auth
// llega como '/forgot-password'.
const RESET_PATHS = ['/forgot-password', '/reset-password']

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: (req) => RESET_PATHS.includes(req.path),
  message: { success: false, error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Contador aparte del de login: quien olvida su contrasena falla el login
// varias veces y, si compartieran cupo, quedaria bloqueado justo cuando
// necesita recuperarla. Aun asi se limita, que el envio cuesta correos.
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Demasiadas solicitudes de recuperación. Intenta de nuevo en una hora.' },
  standardHeaders: true,
  legacyHeaders: false
})

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, error: 'Demasiados mensajes. Intenta de nuevo en 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false
})

export { apiLimiter, authLimiter, passwordResetLimiter, chatLimiter }
