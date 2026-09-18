import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Star,
  Truck,
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

interface OrderItem {
  name: string
  image: string
  price: number
  quantity: number
  size: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  trackingNumber: string | null
  estimatedDelivery: string | null
  courier: string | null
  timeline: { step: string; date: string; done: boolean }[]
}

const ORDERS: Order[] = [
  {
    id: 'YNY-2026-001',
    date: '2026-06-28',
    items: [
      { name: 'Vestido Flor de Luna', image: 'https://picsum.photos/seed/vestido1/200/200', price: 2890, quantity: 1, size: 'M' },
      { name: 'Bolso Perlé Clutch', image: 'https://picsum.photos/seed/bolso1/200/200', price: 1450, quantity: 1, size: 'Único' },
    ],
    total: 4340,
    status: 'shipped',
    trackingNumber: 'TRK-987654321',
    estimatedDelivery: '2026-07-03',
    courier: 'DHL Express',
    timeline: [
      { step: 'Pedido Confirmado', date: '28 Jun, 2:14 PM', done: true },
      { step: 'Preparando', date: '28 Jun, 4:30 PM', done: true },
      { step: 'Empacado', date: '29 Jun, 10:00 AM', done: true },
      { step: 'Enviado', date: '29 Jun, 3:45 PM', done: true },
      { step: 'En Camino', date: '30 Jun, 8:00 AM', done: false },
      { step: 'Entregado', date: '', done: false },
    ],
  },
  {
    id: 'YNY-2026-002',
    date: '2026-06-25',
    items: [
      { name: 'Blusa Seda Imperial', image: 'https://picsum.photos/seed/blusa2/200/200', price: 1890, quantity: 2, size: 'S' },
    ],
    total: 3780,
    status: 'delivered',
    trackingNumber: 'TRK-112233445',
    estimatedDelivery: null,
    courier: 'FedEx',
    timeline: [
      { step: 'Pedido Confirmado', date: '25 Jun, 9:00 AM', done: true },
      { step: 'Preparando', date: '25 Jun, 11:30 AM', done: true },
      { step: 'Empacado', date: '26 Jun, 8:15 AM', done: true },
      { step: 'Enviado', date: '26 Jun, 2:00 PM', done: true },
      { step: 'En Camino', date: '27 Jun, 7:00 AM', done: true },
      { step: 'Entregado', date: '28 Jun, 11:20 AM', done: true },
    ],
  },
  {
    id: 'YNY-2026-003',
    date: '2026-06-20',
    items: [
      { name: 'Falda Plisada Dorada', image: 'https://picsum.photos/seed/falda3/200/200', price: 1650, quantity: 1, size: 'M' },
      { name: 'Collar Perla Cadena', image: 'https://picsum.photos/seed/collar3/200/200', price: 890, quantity: 1, size: 'Único' },
      { name: 'Aretes Luminis', image: 'https://picsum.photos/seed/aretes3/200/200', price: 650, quantity: 2, size: 'Único' },
    ],
    total: 3840,
    status: 'processing',
    trackingNumber: null,
    estimatedDelivery: '2026-07-05',
    courier: null,
    timeline: [
      { step: 'Pedido Confirmado', date: '20 Jun, 6:45 PM', done: true },
      { step: 'Preparando', date: '21 Jun, 9:00 AM', done: true },
      { step: 'Empacado', date: '', done: false },
      { step: 'Enviado', date: '', done: false },
      { step: 'En Camino', date: '', done: false },
      { step: 'Entregado', date: '', done: false },
    ],
  },
  {
    id: 'YNY-2026-004',
    date: '2026-06-15',
    items: [
      { name: 'Chaqueta Tweed Rosa', image: 'https://picsum.photos/seed/chaqueta4/200/200', price: 3200, quantity: 1, size: 'L' },
    ],
    total: 3200,
    status: 'cancelled',
    trackingNumber: null,
    estimatedDelivery: null,
    courier: null,
    timeline: [
      { step: 'Pedido Confirmado', date: '15 Jun, 10:30 AM', done: true },
      { step: 'Cancelado', date: '15 Jun, 2:00 PM', done: true },
    ],
  },
  {
    id: 'YNY-2026-005',
    date: '2026-06-10',
    items: [
      { name: 'Zapatos Stiletto Nude', image: 'https://picsum.photos/seed/zapatos5/200/200', price: 2100, quantity: 1, size: '37' },
      { name: 'Bolso Minauri', image: 'https://picsum.photos/seed/bolso5/200/200', price: 2450, quantity: 1, size: 'Único' },
    ],
    total: 4550,
    status: 'delivered',
    trackingNumber: 'TRK-556677889',
    estimatedDelivery: null,
    courier: 'Estafeta',
    timeline: [
      { step: 'Pedido Confirmado', date: '10 Jun, 3:20 PM', done: true },
      { step: 'Preparando', date: '10 Jun, 5:00 PM', done: true },
      { step: 'Empacado', date: '11 Jun, 9:30 AM', done: true },
      { step: 'Enviado', date: '11 Jun, 1:00 PM', done: true },
      { step: 'En Camino', date: '12 Jun, 8:00 AM', done: true },
      { step: 'Entregado', date: '13 Jun, 10:45 AM', done: true },
    ],
  },
  {
    id: 'YNY-2026-006',
    date: '2026-06-05',
    items: [
      { name: 'Retoque Maquillaje Luxury', image: 'https://picsum.photos/seed/retoque6/200/200', price: 780, quantity: 3, size: 'Único' },
    ],
    total: 2340,
    status: 'refunded',
    trackingNumber: 'TRK-998877665',
    estimatedDelivery: null,
    courier: 'DHL Express',
    timeline: [
      { step: 'Pedido Confirmado', date: '5 Jun, 11:00 AM', done: true },
      { step: 'Preparando', date: '5 Jun, 2:30 PM', done: true },
      { step: 'Empacado', date: '6 Jun, 8:00 AM', done: true },
      { step: 'Enviado', date: '6 Jun, 12:00 PM', done: true },
      { step: 'Reembolsado', date: '9 Jun, 4:15 PM', done: true },
    ],
  },
  {
    id: 'YNY-2026-007',
    date: '2026-05-28',
    items: [
      { name: 'Enterizo Floral Primavera', image: 'https://picsum.photos/seed/enterizo7/200/200', price: 2650, quantity: 1, size: 'S' },
      { name: 'Pashmina Cachemire', image: 'https://picsum.photos/seed/pashmina7/200/200', price: 1200, quantity: 1, size: 'Único' },
    ],
    total: 3850,
    status: 'delivered',
    trackingNumber: 'TRK-443322110',
    estimatedDelivery: null,
    courier: 'FedEx',
    timeline: [
      { step: 'Pedido Confirmado', date: '28 May, 8:00 AM', done: true },
      { step: 'Preparando', date: '28 May, 10:30 AM', done: true },
      { step: 'Empacado', date: '29 May, 9:00 AM', done: true },
      { step: 'Enviado', date: '29 May, 2:00 PM', done: true },
      { step: 'En Camino', date: '30 May, 7:30 AM', done: true },
      { step: 'Entregado', date: '31 May, 11:00 AM', done: true },
    ],
  },
  {
    id: 'YNY-2026-008',
    date: '2026-05-20',
    items: [
      { name: 'Gafas Sol Aviador', image: 'https://picsum.photos/seed/gafas8/200/200', price: 1580, quantity: 1, size: 'Único' },
      { name: 'Pañuelo Seda Floral', image: 'https://picsum.photos/seed/panuelo8/200/200', price: 690, quantity: 1, size: 'Único' },
      { name: 'Brazalete Torque Dorado', image: 'https://picsum.photos/seed/brazalete8/200/200', price: 980, quantity: 1, size: 'Único' },
    ],
    total: 3250,
    status: 'shipped',
    trackingNumber: 'TRK-667788990',
    estimatedDelivery: '2026-06-02',
    courier: 'DHL Express',
    timeline: [
      { step: 'Pedido Confirmado', date: '20 May, 4:00 PM', done: true },
      { step: 'Preparando', date: '20 May, 6:00 PM', done: true },
      { step: 'Empacado', date: '21 May, 10:00 AM', done: true },
      { step: 'Enviado', date: '21 May, 3:30 PM', done: true },
      { step: 'En Camino', date: '22 May, 8:00 AM', done: true },
      { step: 'Entregado', date: '', done: false },
    ],
  },
  {
    id: 'YNY-2026-009',
    date: '2026-05-12',
    items: [
      { name: 'Vestido Noche Estrellas', image: 'https://picsum.photos/seed/vestido9/200/200', price: 4200, quantity: 1, size: 'M' },
    ],
    total: 4200,
    status: 'processing',
    trackingNumber: null,
    estimatedDelivery: '2026-07-08',
    courier: null,
    timeline: [
      { step: 'Pedido Confirmado', date: '12 May, 1:30 PM', done: true },
      { step: 'Preparando', date: '', done: false },
      { step: 'Empacado', date: '', done: false },
      { step: 'Enviado', date: '', done: false },
      { step: 'En Camino', date: '', done: false },
      { step: 'Entregado', date: '', done: false },
    ],
  },
  {
    id: 'YNY-2026-010',
    date: '2026-05-01',
    items: [
      { name: 'Conjunto Yoga Luxe', image: 'https://picsum.photos/seed/conjunto10/200/200', price: 1950, quantity: 1, size: 'S' },
      { name: 'Botella Cristal Rosa', image: 'https://picsum.photos/seed/botella10/200/200', price: 580, quantity: 2, size: 'Único' },
    ],
    total: 3110,
    status: 'delivered',
    trackingNumber: 'TRK-221133446',
    estimatedDelivery: null,
    courier: 'Estafeta',
    timeline: [
      { step: 'Pedido Confirmado', date: '1 May, 9:00 AM', done: true },
      { step: 'Preparando', date: '1 May, 11:00 AM', done: true },
      { step: 'Empacado', date: '2 May, 8:30 AM', done: true },
      { step: 'Enviado', date: '2 May, 1:30 PM', done: true },
      { step: 'En Camino', date: '3 May, 7:00 AM', done: true },
      { step: 'Entregado', date: '4 May, 10:00 AM', done: true },
    ],
  },
]

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  processing: { label: 'Procesando', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  shipped: { label: 'Enviado', color: 'text-blue-700', bg: 'bg-blue-50', icon: Truck },
  delivered: { label: 'Entregado', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
  refunded: { label: 'Reembolsado', color: 'text-purple-700', bg: 'bg-purple-50', icon: AlertCircle },
}

const TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'processing', label: 'Procesando' },
  { id: 'shipped', label: 'Enviados' },
  { id: 'delivered', label: 'Entregados' },
  { id: 'cancelled', label: 'Cancelados' },
  { id: 'refunded', label: 'Reembolsados' },
]

const ITEMS_PER_PAGE = 4

export default function MyOrders() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = ORDERS.filter((o) => {
    const matchesTab = activeTab === 'all' || o.status === activeTab
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    return matchesTab && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const toggle = (id: string) => setExpandedOrder((prev) => (prev === id ? null : id))

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 font-serif text-3xl text-brown">Mis Pedidos</h1>
        <p className="mb-8 text-sm text-brown/50">Gestiona y da seguimiento a tus compras</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por ID o nombre de producto..."
          className="w-full rounded-xl border border-gold/20 bg-beige py-3 pl-11 pr-4 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 flex gap-2 overflow-x-auto scrollbar-none pb-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1) }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-white shadow-md shadow-gold/20'
                : 'bg-beige text-brown/60 hover:bg-gold/10 hover:text-brown'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Orders */}
      {paginated.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl bg-beige py-20"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
            <Package size={36} className="text-gold" />
          </div>
          <h3 className="mb-2 font-serif text-xl text-brown">No se encontraron pedidos</h3>
          <p className="text-sm text-brown/50">
            {search ? 'Intenta con otro término de búsqueda' : 'Aún no has realizado ningún pedido'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {paginated.map((order, i) => {
              const isOpen = expandedOrder === order.id
              const statusInfo = STATUS_CONFIG[order.status]
              const StatusIcon = statusInfo.icon
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="overflow-hidden rounded-2xl border border-gold/10 bg-beige"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggle(order.id)}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gold/5"
                  >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div>
                        <p className="text-xs text-brown/40">Pedido</p>
                        <p className="font-semibold text-brown">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brown/40">Fecha</p>
                        <p className="text-sm text-brown">{formatDate(order.date)}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-brown/40">Total</p>
                        <p className="font-semibold text-brown">${order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon size={13} />
                        {statusInfo.label}
                      </span>
                      <div className="text-brown/30">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gold/10 px-5 pb-5 pt-4">
                          {/* Items */}
                          <div className="mb-4 space-y-3">
                            {order.items.map((item, j) => (
                              <div key={j} className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-sm font-medium text-brown">{item.name}</p>
                                  <p className="text-xs text-brown/40">
                                    Talla {item.size} &middot; Cant. {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-brown">
                                  ${(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {order.trackingNumber && (
                              <div className="rounded-xl bg-cream p-3">
                                <p className="text-xs text-brown/40">Rastreo</p>
                                <p className="text-sm font-medium text-brown">{order.trackingNumber}</p>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="rounded-xl bg-cream p-3">
                                <p className="text-xs text-brown/40">Entrega estimada</p>
                                <p className="text-sm font-medium text-brown">{formatDate(order.estimatedDelivery)}</p>
                              </div>
                            )}
                            {order.courier && (
                              <div className="rounded-xl bg-cream p-3">
                                <p className="text-xs text-brown/40">Paquetería</p>
                                <p className="text-sm font-medium text-brown">{order.courier}</p>
                              </div>
                            )}
                          </div>

                          {/* Timeline */}
                          <div className="mb-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brown/40">Historial</p>
                            <div className="flex items-start gap-0 overflow-x-auto scrollbar-none pb-1">
                              {order.timeline.map((step, s) => (
                                <div key={s} className="flex items-start">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                        step.done
                                          ? 'bg-gold text-white'
                                          : 'bg-brown/10 text-brown/30'
                                      }`}
                                    >
                                      {step.done ? <CheckCircle2 size={14} /> : s + 1}
                                    </div>
                                    <p className="mt-1.5 max-w-[80px] text-center text-[10px] leading-tight text-brown/60">
                                      {step.step}
                                    </p>
                                    {step.date && (
                                      <p className="text-[9px] text-brown/30">{step.date}</p>
                                    )}
                                  </div>
                                  {s < order.timeline.length - 1 && (
                                    <div
                                      className={`mx-1 mt-3 h-[2px] min-w-[24px] rounded-full ${
                                        step.done ? 'bg-gold' : 'bg-brown/10'
                                      }`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-brown/10 bg-white px-3.5 py-1.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                              <Download size={13} /> Factura
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-brown/10 bg-white px-3.5 py-1.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                              <RotateCcw size={13} /> Reembolso
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-brown/10 bg-white px-3.5 py-1.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                              <Star size={13} /> Reseña
                            </button>
                            {order.trackingNumber && (
                              <button className="inline-flex items-center gap-1.5 rounded-full border border-brown/10 bg-white px-3.5 py-1.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                                <ExternalLink size={13} /> Rastrear
                              </button>
                            )}
                            <button className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-gold/20 transition-all hover:bg-gold-dark">
                              <RefreshCw size={13} /> Comprar de nuevo
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-all ${
                p === page
                  ? 'bg-gold text-white shadow-md shadow-gold/20'
                  : 'bg-beige text-brown/50 hover:bg-gold/10'
              }`}
            >
              {p}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
