import express from 'express'
import paymentService from '../services/paymentService.js'

const router = express.Router()

// Procesar pago
router.post('/process', async (req, res) => {
  try {
    const { monto, referencia, descripcion, email, nombreTitular, numeroTarjeta } = req.body

    // Validar datos
    if (!monto || !referencia || !email) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos',
      })
    }

    // Procesar pago
    const resultado = await paymentService.procesarPago({
      monto,
      referencia,
      descripcion,
      email,
      nombreTitular,
      numeroTarjeta,
    })

    res.json(resultado)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Verificar estado de pago
router.get('/verify/:referencia', async (req, res) => {
  try {
    const { referencia } = req.params

    const resultado = await paymentService.verificarEstadoPago(referencia)

    res.json(resultado)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Reembolsar pago
router.post('/refund', async (req, res) => {
  try {
    const { referencia, monto } = req.body

    if (!referencia || !monto) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos',
      })
    }

    const resultado = await paymentService.reembolsarPago(referencia, monto)

    res.json(resultado)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
