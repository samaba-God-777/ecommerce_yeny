import { useState } from 'react'
import { Save, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function PaymentsConfig() {
  const [formData, setFormData] = useState({
    merchantId: localStorage.getItem('bg_merchantId') || '',
    apiKey: localStorage.getItem('bg_apiKey') || '',
    secretKey: localStorage.getItem('bg_secretKey') || '',
    endpoint: localStorage.getItem('bg_endpoint') || 'https://api.bancoGeneral.com/v1',
    environment: localStorage.getItem('bg_environment') || 'sandbox',
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = () => {
    localStorage.setItem('bg_merchantId', formData.merchantId)
    localStorage.setItem('bg_apiKey', formData.apiKey)
    localStorage.setItem('bg_secretKey', formData.secretKey)
    localStorage.setItem('bg_endpoint', formData.endpoint)
    localStorage.setItem('bg_environment', formData.environment)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-line">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Configuración de Pagos</h2>
        <p className="text-gray-600 text-sm mt-1">Banco General - Integración de pagos reales</p>
      </div>

      {/* Alert */}
      <div className="mb-6 p-4 bg-muted border border-border rounded-lg flex gap-3">
        <AlertCircle className="text-market flex-shrink-0" size={20} />
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Información importante</p>
          <p className="mt-1">Estas credenciales se guardan en localStorage. Para producción, configúralas en variables de entorno.</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Merchant ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Merchant ID
          </label>
          <input
            type="text"
            name="merchantId"
            value={formData.merchantId}
            onChange={handleChange}
            placeholder="Tu Merchant ID de Banco General"
            className="w-full px-4 py-2.5 rounded-lg border border-line text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-market"
          />
          <p className="text-xs text-gray-500 mt-1">ID del comercio asignado por Banco General</p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Tu API Key de Banco General"
              className="w-full px-4 py-2.5 rounded-lg border border-line text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-market"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Clave de acceso para autenticación</p>
        </div>

        {/* Secret Key */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Secret Key
          </label>
          <div className="relative">
            <input
              type={showSecretKey ? 'text' : 'password'}
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              placeholder="Tu Secret Key de Banco General"
              className="w-full px-4 py-2.5 rounded-lg border border-line text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-market"
            />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Clave secreta para firmar solicitudes</p>
        </div>

        {/* Endpoint */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Endpoint de API
          </label>
          <input
            type="text"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            placeholder="https://api.bancoGeneral.com/v1"
            className="w-full px-4 py-2.5 rounded-lg border border-line text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-market"
          />
          <p className="text-xs text-gray-500 mt-1">URL base de la API de Banco General</p>
        </div>

        {/* Environment */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Ambiente
          </label>
          <select
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-line text-gray-900 focus:outline-none focus:ring-2 focus:ring-market"
          >
            <option value="sandbox">Sandbox (Pruebas)</option>
            <option value="production">Production (En vivo)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Selecciona el ambiente donde quieres procesar pagos</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-market text-white rounded-lg font-semibold hover:bg-market-deep transition-colors"
        >
          <Save size={18} />
          Guardar Configuración
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-semibold">✓ Configuración guardada correctamente</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">¿Cómo obtener las credenciales?</h3>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Ve a Banco General Developer Portal</li>
          <li>Crea o abre tu aplicación</li>
          <li>Copia tu Merchant ID, API Key y Secret Key</li>
          <li>Pégalos en este formulario</li>
          <li>Elige el ambiente (sandbox para pruebas)</li>
          <li>Haz clic en "Guardar Configuración"</li>
        </ol>
      </div>

      {/* Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Estado de la Configuración</h3>
        <div className="space-y-2 text-sm">
          <p className={`${formData.merchantId ? 'text-green-600' : 'text-gray-500'}`}>
            ✓ Merchant ID: {formData.merchantId ? 'Configurado' : 'Pendiente'}
          </p>
          <p className={`${formData.apiKey ? 'text-green-600' : 'text-gray-500'}`}>
            ✓ API Key: {formData.apiKey ? 'Configurado' : 'Pendiente'}
          </p>
          <p className={`${formData.secretKey ? 'text-green-600' : 'text-gray-500'}`}>
            ✓ Secret Key: {formData.secretKey ? 'Configurado' : 'Pendiente'}
          </p>
        </div>
      </div>
    </div>
  )
}
