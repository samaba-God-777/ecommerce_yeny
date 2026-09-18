import { useState } from 'react'
import { 
  Settings, Store, Bell, Shield, Save, Check, 
  Mail, Lock, Eye, EyeOff, Smartphone,
  Package, ShoppingCart, TrendingUp, AlertTriangle
} from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'
import { STORE_URL, API_ORIGIN } from '../lib/urls'

interface SettingsProps {
  username: string
}

type SettingsTab = 'general' | 'notifications' | 'security'

export default function SettingsPage({ username }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [saved, setSaved] = useState(false)

  // General Settings
  const [storeName, setStoreName] = useState('Yenyleths Boutique')
  const [storeEmail, setStoreEmail] = useState('admin@yenyleths.com')
  const [storePhone, setStorePhone] = useState('+58 412 123 4567')
  const [currency, setCurrency] = useState('USD')

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [stockAlerts, setStockAlerts] = useState(true)
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }
    alert('Contraseña cambiada exitosamente')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const tabs = [
    { id: 'general' as SettingsTab, name: 'General', icon: Store },
    { id: 'notifications' as SettingsTab, name: 'Notificaciones', icon: Bell },
    { id: 'security' as SettingsTab, name: 'Seguridad', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown font-serif">Configuración</h1>
          <p className="text-muted-foreground text-sm">Administra la configuración de tu tienda</p>
        </div>
        <Button onClick={handleSave} variant="primary">
          {saved ? (
            <>
              <Check size={18} />
              Guardado
            </>
          ) : (
            <>
              <Save size={18} />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-market-bright to-market text-white shadow-md'
                        : 'hover:bg-market/5 text-muted-foreground'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-market-bright'}`} />
                    <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-2xl border border-border shadow-sm mt-6 p-6">
            <h3 className="font-bold text-brown font-serif mb-4">Información del Admin</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-market-bright to-market flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-brown">{username}</p>
                <p className="text-sm text-muted-foreground">Administrador</p>
                <p className="text-xs text-market mt-1">Último acceso: Ahora</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Store className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Datos de la Tienda</h3>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Nombre de la tienda"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email de contacto"
                      type="email"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="+58 412 000 0000"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-brown mb-1.5 font-serif">Moneda</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-brown focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                    >
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="VES">VES - Bolívar Venezolano</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Información del Sistema</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-beige/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Versión</p>
                    <p className="font-semibold text-brown">v1.0.0</p>
                  </div>
                  <div className="p-4 bg-beige/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Backend</p>
                    <p className="font-semibold text-brown break-all">{API_ORIGIN}</p>
                  </div>
                  <div className="p-4 bg-beige/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Frontend</p>
                    <p className="font-semibold text-brown break-all">{STORE_URL}</p>
                  </div>
                  <div className="p-4 bg-beige/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Base de datos</p>
                    <p className="font-semibold text-brown">db.json</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Preferencias de Notificación</h3>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    icon={<Mail className="h-5 w-5" />}
                    title="Notificaciones por email"
                    description="Recibe actualizaciones importantes en tu correo"
                    enabled={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                  <ToggleSetting
                    icon={<Smartphone className="h-5 w-5" />}
                    title="Notificaciones push"
                    description="Recibe notificaciones en el navegador"
                    enabled={pushNotifications}
                    onChange={setPushNotifications}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Alertas de Inventario</h3>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    icon={<AlertTriangle className="h-5 w-5" />}
                    title="Alertas de stock bajo"
                    description="Notificar cuando un producto tenga menos de 5 unidades"
                    enabled={stockAlerts}
                    onChange={setStockAlerts}
                  />
                  <ToggleSetting
                    icon={<ShoppingCart className="h-5 w-5" />}
                    title="Alertas de pedidos"
                    description="Notificar cuando se realice un nuevo pedido"
                    enabled={orderAlerts}
                    onChange={setOrderAlerts}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Reportes</h3>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    icon={<Mail className="h-5 w-5" />}
                    title="Reporte semanal"
                    description="Recibe un resumen semanal de ventas e inventario"
                    enabled={weeklyReport}
                    onChange={setWeeklyReport}
                  />
                  <ToggleSetting
                    icon={<Mail className="h-5 w-5" />}
                    title="Emails de marketing"
                    description="Recibe consejos y novedades para vendedores"
                    enabled={marketingEmails}
                    onChange={setMarketingEmails}
                  />
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Cambiar Contraseña</h3>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Contraseña actual"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-brown transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      label="Nueva contraseña"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-brown transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <Input
                    label="Confirmar nueva contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button onClick={handleChangePassword} variant="secondary">
                    <Lock size={18} />
                    Actualizar Contraseña
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Autenticación de Dos Factores</h3>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    icon={<Smartphone className="h-5 w-5" />}
                    title="2FA Habilitado"
                    description="Agrega una capa extra de seguridad a tu cuenta"
                    enabled={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="h-5 w-5 text-market" />
                  <h3 className="font-bold text-brown font-serif">Sesiones</h3>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    icon={<Mail className="h-5 w-5" />}
                    title="Alertas de inicio de sesión"
                    description="Notificar cuando se inicie sesión desde un nuevo dispositivo"
                    enabled={loginAlerts}
                    onChange={setLoginAlerts}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button variant="destructive">
                    <Lock size={18} />
                    Cerrar todas las sesiones
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Toggle Setting Component
function ToggleSetting({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-market/5 transition-colors">
      <div className="p-2 rounded-lg bg-market/10 text-market mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-brown">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-market focus:ring-offset-2 ${
          enabled ? 'bg-market' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
