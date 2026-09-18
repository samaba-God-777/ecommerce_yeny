import bancoGeneralConfig from '../config/bancoGeneral.js'

class PaymentService {
  async procesarPago(datos) {
    if (process.env.MOCK_PAYMENT_MODE === 'true') {
      return {
        success: true,
        transactionId: 'mock-txn-' + Date.now(),
        status: 'completed',
        message: 'Pago procesado en modo de prueba'
      }
    }

    // Real Banco General integration
    try {
      if (!bancoGeneralConfig.merchantId || !bancoGeneralConfig.apiKey) {
        return {
          success: false,
          error: 'Configuración de Banco General no completada',
          message: 'Por favor, configura las credenciales en el archivo .env o usa MOCK_PAYMENT_MODE=true'
        }
      }
      // Placeholder for real integration
      return {
        success: false,
        error: 'Integración de Banco General pendiente',
        message: 'Usa MOCK_PAYMENT_MODE=true en .env para desarrollo'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async verificarEstadoPago(referencia) {
    if (process.env.MOCK_PAYMENT_MODE === 'true') {
      return { success: true, status: 'completed', referencia }
    }
    return { success: true, status: 'pending', referencia }
  }

  async reembolsarPago(referencia, monto) {
    if (process.env.MOCK_PAYMENT_MODE === 'true') {
      return { success: true, transactionId: 'mock-refund-' + Date.now(), status: 'refunded' }
    }
    return { success: false, error: 'Servicio no configurado' }
  }
}

export default new PaymentService()
