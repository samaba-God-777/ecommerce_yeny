// Configuración de Banco General para Pagos
export const bancoGeneralConfig = {
  // Pega tus credenciales aquí
  merchantId: process.env.BANCO_GENERAL_MERCHANT_ID || '',
  apiKey: process.env.BANCO_GENERAL_API_KEY || '',
  secretKey: process.env.BANCO_GENERAL_SECRET_KEY || '',

  // Endpoints
  apiEndpoint: process.env.BANCO_GENERAL_ENDPOINT || 'https://api.bancoGeneral.com/v1',

  // Configuración
  currency: 'USD',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',

  // Timeout
  timeout: 30000,
}

export default bancoGeneralConfig
