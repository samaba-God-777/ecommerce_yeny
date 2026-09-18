function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      // Zod 4 usa issues; errors queda por si se vuelve a una version vieja.
      const issues = err.issues || err.errors
      if (issues) {
        return res.status(400).json({
          success: false,
          error: issues[0]?.message || 'Error de validación',
          details: issues.map(e => ({ path: e.path.join('.'), message: e.message }))
        })
      }
      next(err)
    }
  }
}

export default validate
