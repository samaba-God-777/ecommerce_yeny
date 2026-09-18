import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Package, Heart, Ticket, Star, Clock, CheckCircle,
  RotateCcw, MessageSquare, TrendingUp, ArrowUpRight,
  ShoppingCart, Eye, Gift, ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const stats = [
  { label: 'Total Pedidos', value: '24', icon: Package, color: 'bg-pink-100 text-pink-600', change: '+3 este mes' },
  { label: 'Favoritos', value: '12', icon: Heart, color: 'bg-rose-100 text-rose-500', change: '+2 nuevos' },
  { label: 'Cupones', value: '5', icon: Ticket, color: 'bg-amber-100 text-amber-600', change: '2 por vencer' },
  { label: 'Favoritos Star', value: '18', icon: Star, color: 'bg-yellow-100 text-yellow-600', change: '+5 esta semana' },
  { label: 'Pendientes', value: '3', icon: Clock, color: 'bg-orange-100 text-orange-500', change: 'En tránsito' },
  { label: 'Completados', value: '19', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600', change: '98% satisfacción' },
  { label: 'Reembolsos', value: '2', icon: RotateCcw, color: 'bg-red-100 text-red-500', change: '1 procesando' },
  { label: 'Mensajes', value: '8', icon: MessageSquare, color: 'bg-purple-100 text-purple-500', change: '3 sin leer' },
]

const activities = [
  { text: 'Pedido #YB-2847 enviado', time: 'Hace 2 horas', icon: Package, color: 'bg-pink-500' },
  { text: 'Pago confirmado para pedido #YB-2851', time: 'Hace 5 horas', icon: CheckCircle, color: 'bg-emerald-500' },
  { text: 'Nuevo cupón "VERANO25" disponible', time: 'Hace 1 día', icon: Ticket, color: 'bg-amber-500' },
  { text: 'Reseña liked por 12 personas', time: 'Hace 2 días', icon: Heart, color: 'bg-rose-500' },
  { text: 'Reembolso procesado para pedido #YB-2801', time: 'Hace 3 días', icon: RotateCcw, color: 'bg-orange-500' },
  { text: 'Puntos de fidelidad ganados: +150 pts', time: 'Hace 4 días', icon: Star, color: 'bg-yellow-500' },
]

const monthlyData = [
  { month: 'Ene', orders: 3, color: 'bg-pink-200' },
  { month: 'Feb', orders: 5, color: 'bg-pink-300' },
  { month: 'Mar', orders: 2, color: 'bg-pink-200' },
  { month: 'Abr', orders: 7, color: 'bg-pink-400' },
  { month: 'May', orders: 4, color: 'bg-pink-300' },
  { month: 'Jun', orders: 3, color: 'bg-pink-200' },
]

const recommended = [
  { id: 1, name: 'Vestido de Seda para Noche', price: 289.00, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop' },
  { id: 2, name: 'Suéter de Cachemira', price: 195.00, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a88?w=300&h=400&fit=crop' },
  { id: 3, name: 'Set de Collar de Perlas', price: 145.00, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=300&h=400&fit=crop' },
  { id: 4, name: 'Bolso de Cuero Italiano', price: 320.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=400&fit=crop' },
]

export default function DashboardHome() {
  const maxOrders = Math.max(...monthlyData.map(d => d.orders))
  const [customerUser, setCustomerUser] = useState({ username: 'Usuario' })

  useEffect(() => {
    const saved = localStorage.getItem('yenyleths_customer')
    if (saved) {
      setCustomerUser(JSON.parse(saved))
    }
  }, [])

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-pink-400 to-rose-400 p-6 text-white shadow-xl shadow-pink-200 sm:p-8"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute right-20 top-10 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur-sm">
              {customerUser.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold sm:text-3xl">Hola, {customerUser.username || 'Usuario'} 👋</h1>
              <p className="mt-1 text-sm text-pink-100">Bienvenido de vuelta a tu panel</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-yellow-300 text-yellow-300" />
                <span className="text-xs font-medium text-pink-100">Miembro Dorado</span>
              </div>
              <p className="mt-1 text-lg font-bold">Nivel 3</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-pink-100">Puntos de Recompensa</p>
              <p className="mt-1 text-lg font-bold">2,450</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-pink-100">Saldo de Billetera</p>
              <p className="mt-1 text-lg font-bold">$128.50</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-pink-100">Cupones</p>
              <p className="mt-1 text-lg font-bold">5 Disponibles</p>
            </div>
          </div>
        </div>

        {/* Loyalty Progress */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-pink-100">Progreso a Platino</span>
            <span className="font-bold">2,450 / 3,000 pts</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400"
            />
          </div>
          <p className="mt-1.5 text-xs text-pink-100">550 puntos para alcanzar el nivel Platino</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="group rounded-2xl border border-pink-100/60 bg-white/70 p-4 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-pink-100/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300 transition-colors group-hover:text-pink-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-pink-100/60 bg-white/70 p-5 backdrop-blur-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            <Link to="/dashboard/orders" className="flex items-center gap-1 text-sm font-medium text-pink-500 hover:text-pink-600">
              Ver Todo <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {activities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-pink-50/50"
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${act.color} text-white`}>
                  <act.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{act.text}</p>
                  <p className="text-xs text-gray-400">{act.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Trends Chart */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-pink-100/60 bg-white/70 p-5 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-gray-900">Tendencia de Pedidos</h2>
            <TrendingUp size={18} className="text-pink-400" />
          </div>
          <p className="mb-4 text-xs text-gray-400">Últimos 6 meses</p>

          <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.orders / maxOrders) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg ${d.color} transition-colors hover:opacity-80`}
                />
                <span className="text-[10px] font-medium text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-pink-50 px-3 py-2">
            <span className="text-xs text-gray-500">Total este año</span>
            <span className="text-sm font-bold text-gray-900">24 Pedidos</span>
          </div>
        </motion.div>
      </div>

      {/* Recommended Products */}
      <motion.div variants={item}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-gray-900">Recomendados para Ti</h2>
          <Link to="/category/women" className="flex items-center gap-1 text-sm font-medium text-pink-500 hover:text-pink-600">
            Ver Todo <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {recommended.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-pink-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-pink-100/50 hover:-translate-y-0.5"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-pink-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 backdrop-blur-sm transition-colors hover:bg-pink-500 hover:text-white">
                  <Heart size={16} />
                </button>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm font-bold text-pink-600">${product.price.toFixed(2)}</p>
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-pink-600">
                  <ShoppingCart size={14} /> Agregar al Carrito
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Rastrear Pedido', icon: Package, to: '/dashboard/orders' },
          { label: 'Escribir Reseña', icon: MessageSquare, to: '/dashboard/reviews' },
          { label: 'Invitar Amigos', icon: Gift, to: '/dashboard/referrals' },
          { label: 'Historial', icon: Eye, to: '/dashboard/recently-viewed' },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-3 rounded-2xl border border-pink-100/60 bg-white/70 p-4 backdrop-blur-sm transition-all duration-200 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100/50 hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <action.icon size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
