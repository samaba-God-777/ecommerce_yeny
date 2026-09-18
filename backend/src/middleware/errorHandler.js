const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack)

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, error: `Error de carga: ${err.message}` })
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || []
    return res.status(400).json({
      success: false,
      error: issues[0]?.message || 'Error de validación',
      details: issues.map(e => ({ path: e.path.join('.'), message: e.message }))
    })
  }

  // Custom AppError
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, error: err.message })
  }

  // Generic
  const status = err.status || 500
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message
  })
}

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}

export { errorHandler, notFoundHandler }
