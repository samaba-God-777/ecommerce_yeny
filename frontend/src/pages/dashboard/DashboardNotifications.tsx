import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  Tag,
  Settings,
  Gift,
  Truck,
  Star,
  CreditCard,
  AlertCircle,
  Megaphone,
  Shield,
} from 'lucide-react'

type NotificationType = 'order' | 'promotion' | 'system' | 'discount'
type TabFilter = 'all' | NotificationType

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Pedido enviado',
    description: 'Tu pedido #YL-20260301 ha sido enviado. Número de seguimiento: TK123456789.',
    time: 'Hace 2 horas',
    read: false,
  },
  {
    id: '2',
    type: 'discount',
    title: 'Nuevo cupón disponible',
    description: '¡Tienes un cupón de 20% de descuento por ser cliente frecuente! Válido hasta julio.',
    time: 'Hace 5 horas',
    read: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Pedido confirmado',
    description: 'Tu pedido #YL-20260302 ha sido confirmado y está siendo preparado.',
    time: 'Ayer',
    read: false,
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Rebajas de temporada',
    description: 'Hasta 40% de descuento en la nueva colección de verano. ¡No te lo pierdas!',
    time: 'Hace 2 días',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Actualización de privacidad',
    description: 'Hemos actualizado nuestra política de privacidad. Revisa los cambios en la sección de configuración.',
    time: 'Hace 3 días',
    read: true,
  },
  {
    id: '6',
    type: 'discount',
    title: 'Regalo de cumpleaños',
    description: '¡Feliz cumpleaños! Tienes $500 de descuento para usar en tu próxima compra.',
    time: 'Hace 5 días',
    read: true,
  },
  {
    id: '7',
    type: 'order',
    title: 'Entrega completada',
    description: 'Tu pedido #YL-20260215 ha sido entregado. ¡Esperamos que disfrutes tu compra!',
    time: 'Hace 1 semana',
    read: true,
  },
  {
    id: '8',
    type: 'promotion',
    title: 'Flash Sale 24h',
    description: 'Solo por hoy: envío gratis en todas las compras superiores a $150.',
    time: 'Hace 1 semana',
    read: true,
  },
  {
    id: '9',
    type: 'system',
    title: 'Nueva función: lista de deseos',
    description: 'Ya puedes guardar productos en tu lista de deseos para comprarlos después.',
    time: 'Hace 2 semanas',
    read: true,
  },
  {
    id: '10',
    type: 'order',
    title: 'Reembolso procesado',
    description: 'El reembolso de $89.99 por el pedido #YL-20260101 ha sido procesado exitosamente.',
    time: 'Hace 2 semanas',
    read: true,
  },
  {
    id: '11',
    type: 'promotion',
    title: 'Exclusivo para ti',
    description: 'Acceso anticipado a la nueva colección. Compra antes que nadie con 15% off.',
    time: 'Hace 3 semanas',
    read: true,
  },
  {
    id: '12',
    type: 'system',
    title: 'Mantenimiento programado',
    description: 'El sistema estará en mantenimiento el sábado de 2:00 a 4:00 AM.',
    time: 'Hace 1 mes',
    read: true,
  },
]

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  order: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Pedido' },
  promotion: { icon: Megaphone, color: 'text-gold-dark', bg: 'bg-gold/10', label: 'Promoción' },
  system: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Sistema' },
  discount: { icon: Gift, color: 'text-green-600', bg: 'bg-green-50', label: 'Descuento' },
}

const tabs: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'order', label: 'Pedidos' },
  { id: 'promotion', label: 'Promociones' },
  { id: 'system', label: 'Sistema' },
]

function getIcon(type: NotificationType) {
  const icons: Record<string, typeof Bell> = {
    order: Package,
    promotion: Megaphone,
    system: Settings,
    discount: Gift,
  }
  return icons[type] || Bell
}

export default function DashboardNotifications() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [notifs, setNotifs] = useState(notifications)
  const [pushEnabled, setPushEnabled] = useState(true)

  const filtered = activeTab === 'all' ? notifs : notifs.filter((n) => n.type === activeTab)
  const unreadCount = notifs.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotif = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id))
  }

  const markRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-brown">Notificaciones</h1>
            <p className="mt-1 text-sm text-brown/50">
              {unreadCount > 0 ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer` : 'Estás al día'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-full border border-brown/10 px-4 py-2 text-xs font-medium text-brown/60 transition-all hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck size={14} />
              Marcar todo leído
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex items-center justify-between rounded-xl border border-brown/10 bg-white px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-gold-dark" />
          <span className="text-sm font-medium text-brown">Notificaciones push</span>
        </div>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={() => setPushEnabled(!pushEnabled)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-brown/20 transition-colors peer-checked:bg-gold" />
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </label>
      </motion.div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-white shadow-md shadow-gold/25'
                : 'bg-beige text-brown/60 hover:bg-gold/10 hover:text-gold-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((notif) => {
            const config = typeConfig[notif.type]
            const IconComp = getIcon(notif.type)
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => markRead(notif.id)}
                className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all ${
                  notif.read
                    ? 'border-brown/10 bg-white hover:bg-beige/30'
                    : 'border-gold/30 bg-gold/5 hover:bg-gold/10'
                }`}
              >
                {!notif.read && (
                  <div className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-gold shadow-sm shadow-gold/50" />
                )}

                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                  <IconComp size={18} className={config.color} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${notif.read ? 'text-brown/70' : 'text-brown'}`}>
                      {notif.title}
                    </h3>
                    <span className="shrink-0 text-xs text-brown/40">{notif.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-brown/50 leading-relaxed">{notif.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotif(notif.id)
                  }}
                  className="shrink-0 rounded-lg p-2 text-brown/30 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <Bell size={48} className="mx-auto mb-4 text-brown/20" />
            <p className="text-brown/50">No hay notificaciones en esta categoría.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
