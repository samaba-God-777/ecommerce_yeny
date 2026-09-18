import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Bell, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'orders', label: 'Mis Pedidos', icon: Package },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'addresses', label: 'Direcciones', icon: MapPin },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

export default function Account() {
  const [active, setActive] = useState('profile')
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const userName = user?.username || 'Invitado'
  const userEmail = user?.email || ''

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl">Mi Cuenta</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* User Profile Card - Always Visible */}
        <div className="sticky top-24 space-y-6">
          <div className="rounded-2xl bg-gradient-to-b from-pink-100 to-pink-200 p-6 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 mx-auto shadow-md">
              <span className="text-2xl font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-pink-900">{userName}</h2>
            <p className="mt-1 text-sm text-pink-700">{userEmail}</p>
            <p className="mt-3 inline-block rounded-full bg-pink-400 px-3 py-1 text-xs font-semibold text-white">
              ⭐ Miembro Dorado
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 rounded-2xl bg-white border border-pink-100 p-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active === tab.id
                      ? 'bg-pink-400 text-white shadow-md'
                      : 'text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </nav>
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-pink-100 p-8 shadow-sm"
        >
          {active === 'orders' && (
            <div>
              <h2 className="mb-4 font-serif text-2xl text-pink-900">Historial de Pedidos</h2>
              <p className="text-sm text-pink-600">Aún no tienes pedidos realizados.</p>
            </div>
          )}
          {active === 'profile' && (
            <div>
              <h2 className="mb-6 font-serif text-2xl text-pink-900">Información Personal</h2>
              <div className="grid max-w-md gap-4">
                <div>
                  <label className="block text-sm font-semibold text-pink-700 mb-2">Nombre completo</label>
                  <input
                    defaultValue={userName}
                    placeholder="Nombre completo"
                    className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-pink-900 placeholder-pink-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-pink-700 mb-2">Correo electrónico</label>
                  <input
                    defaultValue={userEmail}
                    placeholder="Correo electrónico"
                    className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-pink-900 placeholder-pink-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                <button className="w-fit rounded-full bg-pink-400 hover:bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200">
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
          {active === 'addresses' && (
            <div>
              <h2 className="mb-4 font-serif text-2xl text-pink-900">Mis Direcciones</h2>
              <p className="text-sm text-pink-600">No tienes direcciones guardadas.</p>
            </div>
          )}
          {active === 'notifications' && (
            <div>
              <h2 className="mb-4 font-serif text-2xl text-pink-900">Preferencias de Notificación</h2>
              <p className="text-sm text-pink-600">Próximamente.</p>
            </div>
          )}
          {active === 'settings' && (
            <div>
              <h2 className="mb-4 font-serif text-2xl text-pink-900">Configuración</h2>
              <p className="text-sm text-pink-600">Opciones de configuración próximamente.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
