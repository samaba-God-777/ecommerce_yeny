import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw,
  Package,
  Upload,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  FileText,
  ArrowRight,
  Image,
  X,
} from 'lucide-react'

interface ReturnRequest {
  id: string
  orderId: string
  product: string
  productImage: string
  reason: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  dateSubmitted: string
  description?: string
}

interface RefundTimeline {
  status: string
  date: string
  completed: boolean
  description: string
}

interface HistoryItem {
  id: string
  orderId: string
  product: string
  type: 'refund' | 'exchange' | 'store_credit'
  amount: string
  date: string
  status: 'completed' | 'processing'
}

const activeReturns: ReturnRequest[] = [
  {
    id: 'RT-7841',
    orderId: 'YB-2847',
    product: 'Vestido Floral Primavera - Talla M',
    productImage: '🌸',
    reason: 'Talla incorrecta',
    status: 'pending',
    dateSubmitted: '28 Jun 2026',
    description: 'Necesito cambiar la talla de M a L. El vestido me queda muy ajustado.',
  },
  {
    id: 'RT-7823',
    orderId: 'YB-2835',
    product: 'Bolso Croco Premium Negro',
    productImage: '👜',
    reason: 'Producto dañado',
    status: 'approved',
    dateSubmitted: '25 Jun 2026',
    description: 'El cierre del bolso llegó dañado.',
  },
  {
    id: 'RT-7810',
    orderId: 'YB-2820',
    product: 'Collar Perlas Cultivadas',
    productImage: '📿',
    reason: 'No es lo que esperaba',
    status: 'processing',
    dateSubmitted: '22 Jun 2026',
  },
]

const refundHistory: HistoryItem[] = [
  { id: 'RF-9012', orderId: 'YB-2801', product: 'Abrigo Lino Beige', type: 'refund', amount: '$89.00', date: '20 Jun 2026', status: 'completed' },
  { id: 'RF-8998', orderId: 'YB-2780', product: 'Retrato Familiar en Marco Dorado', type: 'store_credit', amount: '$145.00', date: '16 Jun 2026', status: 'completed' },
  { id: 'RF-8970', orderId: 'YB-2755', product: 'Vestido Cóctel Rojo', type: 'exchange', amount: '$75.00', date: '10 Jun 2026', status: 'completed' },
  { id: 'RF-8945', orderId: 'YB-2730', product: 'Anillo Zafiro Estrellas', type: 'refund', amount: '$210.00', date: '5 Jun 2026', status: 'completed' },
  { id: 'RF-8920', orderId: 'YB-2710', product: 'Cartera Piel Color Caramelo', type: 'store_credit', amount: '$62.00', date: '1 Jun 2026', status: 'completed' },
]

const refundTimeline: RefundTimeline[] = [
  { status: 'Solicitud recibida', date: '25 Jun 2026, 10:30 AM', completed: true, description: 'Hemos recibido tu solicitud de reembolso.' },
  { status: 'Revisión en curso', date: '26 Jun 2026, 09:15 AM', completed: true, description: 'Nuestro equipo está revisando tu solicitud.' },
  { status: 'Aprobado', date: '27 Jun 2026, 02:45 PM', completed: true, description: 'Tu solicitud ha sido aprobada.' },
  { status: 'Procesando reembolso', date: '28 Jun 2026, 11:00 AM', completed: false, description: 'El reembolso está siendo procesado.' },
  { status: 'Reembolso completado', date: 'Pendiente', completed: false, description: 'El monto será acreditado en 3-5 días hábiles.' },
]

const reasons = [
  'Talla incorrecta',
  'Producto dañado',
  'No es lo que esperaba',
  'Producto no llegó',
  'Color diferente',
  'Cambio de opinión',
  'Otro',
]

const tabs = [
  { id: 'active', label: 'Devoluciones Activas', icon: Package },
  { id: 'refunds', label: 'Estado de Reembolsos', icon: Clock },
  { id: 'history', label: 'Historial', icon: FileText },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function ReturnsRefunds() {
  const [activeTab, setActiveTab] = useState('active')
  const [showNewReturnForm, setShowNewReturnForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [returnDescription, setReturnDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const statusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', color: 'bg-pink-50 text-pink-700 border-pink-200', icon: <Clock size={14} /> }
      case 'approved':
        return { label: 'Aprobado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={14} /> }
      case 'processing':
        return { label: 'En proceso', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <ArrowRight size={14} /> }
      case 'completed':
        return { label: 'Completado', color: 'bg-gold/10 text-gold-dark border-gold/20', icon: <CheckCircle2 size={14} /> }
      case 'rejected':
        return { label: 'Rechazado', color: 'bg-red-50 text-red-600 border-red-200', icon: <XCircle size={14} /> }
      default:
        return { label: status, color: 'bg-beige text-brown/60 border-brown/10', icon: null }
    }
  }

  const typeLabel = (type: string) => {
    switch (type) {
      case 'refund': return 'Reembolso'
      case 'exchange': return 'Cambio'
      case 'store_credit': return 'Crédito en tienda'
      default: return type
    }
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'refund': return 'bg-emerald-50 text-emerald-700'
      case 'exchange': return 'bg-blue-50 text-blue-700'
      case 'store_credit': return 'bg-gold/10 text-gold-dark'
      default: return 'bg-beige text-brown/60'
    }
  }

  const filteredReturns = activeReturns.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  )

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <RotateCcw size={20} className="text-gold-dark" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-brown">Devoluciones y Reembolsos</h1>
              <p className="text-sm text-brown/50">Gestiona tus devoluciones y consulta el estado de tus reembolsos</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewReturnForm(!showNewReturnForm)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold/20"
          >
            <RotateCcw size={16} />
            Nueva Devolución
          </motion.button>
        </div>
      </motion.div>

      {/* New Return Form */}
      <AnimatePresence>
        {showNewReturnForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-beige to-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-brown">Solicitar Nueva Devolución</h3>
                <button
                  onClick={() => setShowNewReturnForm(false)}
                  className="rounded-lg p-1 text-brown/40 hover:bg-brown/5 hover:text-brown transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brown/60">Número de pedido</label>
                  <div className="relative">
                    <select
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-brown/10 bg-white px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none"
                    >
                      <option value="">Seleccionar pedido...</option>
                      <option value="YB-2847">YB-2847 - Vestido Floral Primavera</option>
                      <option value="YB-2835">YB-2835 - Bolso Croco Premium</option>
                      <option value="YB-2820">YB-2820 - Collar Perlas Cultivadas</option>
                      <option value="YB-2801">YB-2801 - Abrigo Lino Beige</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/40" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brown/60">Motivo de devolución</label>
                  <div className="relative">
                    <select
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-brown/10 bg-white px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none"
                    >
                      <option value="">Seleccionar motivo...</option>
                      {reasons.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/40" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-brown/60">Descripción adicional</label>
                  <textarea
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe el motivo de tu devolución..."
                    className="w-full rounded-xl border border-brown/10 bg-white px-4 py-2.5 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-brown/60">Fotos del producto (opcional)</label>
                  <div className="flex flex-wrap gap-3">
                    {uploadedFiles.map((_file, i) => (
                      <div key={i} className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-brown/10 bg-white">
                        <Image size={20} className="text-brown/30" />
                        <button
                          onClick={() => handleRemoveFile(i)}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brown/20 text-brown/40 transition-colors hover:border-gold hover:text-gold-dark">
                      <Upload size={18} />
                      <span className="mt-1 text-[10px]">Subir foto</span>
                      <input type="file" accept="image/*" className="hidden" onChange={() => setUploadedFiles((prev) => [...prev, 'photo'])} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewReturnForm(false)}
                  className="rounded-full border border-brown/20 px-5 py-2.5 text-sm font-medium text-brown/60 transition-colors hover:bg-brown/5"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold/20"
                >
                  Enviar Solicitud
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-6 flex gap-1 rounded-xl bg-beige p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gold-dark shadow-sm'
                  : 'text-brown/50 hover:text-brown/70'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Active Returns Tab */}
        {activeTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
                <input
                  type="text"
                  placeholder="Buscar por pedido..."
                  className="w-full rounded-xl border border-brown/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none rounded-xl border border-brown/10 bg-white py-2.5 pl-10 pr-8 text-sm text-brown focus:border-gold focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobados</option>
                  <option value="processing">En proceso</option>
                </select>
                <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/40" />
              </div>
            </div>

            {filteredReturns.map((ret) => {
              const cfg = statusConfig(ret.status)
              return (
                <motion.div
                  key={ret.id}
                  variants={itemVariants}
                  className="rounded-2xl bg-beige p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
                      {ret.productImage}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-brown">{ret.product}</h4>
                          <p className="mt-0.5 text-xs text-brown/40">Pedido: {ret.orderId} · Devolución: {ret.id}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      {ret.description && (
                        <p className="mt-2 text-sm text-brown/60">{ret.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-brown/40">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {ret.dateSubmitted}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle size={12} />
                          {ret.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {filteredReturns.length === 0 && (
              <div className="rounded-2xl bg-beige p-12 text-center">
                <Package size={40} className="mx-auto mb-3 text-brown/20" />
                <p className="text-sm text-brown/50">No se encontraron devoluciones con este filtro.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Refund Status Tab */}
        {activeTab === 'refunds' && (
          <motion.div
            key="refunds"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl bg-beige p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-brown">Reembolso Pendiente - Pedido YB-2835</h3>
                  <p className="text-sm text-brown/50">Bolso Croco Premium Negro · $125.00</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700">
                  <ArrowRight size={14} />
                  En proceso
                </span>
              </div>

              <div className="relative">
                {refundTimeline.map((step, i) => (
                  <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < refundTimeline.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 h-full w-0.5 ${
                          step.completed ? 'bg-gold' : 'bg-brown/10'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        step.completed
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-white'
                          : 'border-2 border-brown/20 bg-white text-brown/30'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-brown/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${step.completed ? 'text-brown' : 'text-brown/40'}`}>
                        {step.status}
                      </h4>
                      <p className="mt-0.5 text-xs text-brown/40">{step.date}</p>
                      <p className="mt-1 text-xs text-brown/50">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl bg-beige p-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brown/10">
                      <th className="px-4 py-3 font-medium text-brown/50">ID</th>
                      <th className="px-4 py-3 font-medium text-brown/50">Producto</th>
                      <th className="px-4 py-3 font-medium text-brown/50">Tipo</th>
                      <th className="px-4 py-3 font-medium text-brown/50">Monto</th>
                      <th className="px-4 py-3 font-medium text-brown/50">Fecha</th>
                      <th className="px-4 py-3 font-medium text-brown/50">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundHistory.map((item) => (
                      <tr key={item.id} className="border-b border-brown/5 last:border-0 hover:bg-white/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-brown">{item.id}</td>
                        <td className="px-4 py-3 text-brown/70 max-w-[200px] truncate">{item.product}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${typeColor(item.type)}`}>
                            {typeLabel(item.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-brown">{item.amount}</td>
                        <td className="px-4 py-3 text-brown/50">{item.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {item.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {item.status === 'completed' ? 'Completado' : 'En proceso'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
