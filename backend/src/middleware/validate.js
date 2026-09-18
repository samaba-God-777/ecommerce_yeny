function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        })
      }
      next(err)
    }
  }
}

export default validate
