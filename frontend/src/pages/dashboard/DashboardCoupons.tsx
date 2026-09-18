import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Tag, Clock, Percent, DollarSign, History, Ticket } from 'lucide-react'

type CouponStatus = 'available' | 'used' | 'expired'

interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  expiryDate: string
  status: CouponStatus
  autoApply: boolean
}

interface PromoHistory {
  id: string
  couponCode: string
  orderNumber: string
  date: string
  discount: number
  total: number
}

const coupons: Coupon[] = [
  {
    id: '1',
    code: 'BIENVENIDA20',
    description: '20% de descuento en tu primera compra. Válido para todos los productos de la tienda.',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 100,
    expiryDate: '2026-07-31',
    status: 'available',
    autoApply: false,
  },
  {
    id: '2',
    code: 'VERANO15',
    description: '15% off en la colección de verano. Combina con envío gratis en pedidos mayores a $200.',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 150,
    expiryDate: '2026-08-15',
    status: 'available',
    autoApply: true,
  },
  {
    id: '3',
    code: 'FRETELIBRE',
    description: 'Envío gratuito sin mínimo de compra. Válido para envíos estándar dentro del país.',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 0,
    expiryDate: '2026-07-20',
    status: 'available',
    autoApply: false,
  },
  {
    id: '4',
    code: 'VIP50',
    description: '$50 de descuento exclusivo para miembros VIP. Aplica en cualquier categoría.',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 200,
    expiryDate: '2026-09-01',
    status: 'available',
    autoApply: false,
  },
  {
    id: '5',
    code: 'NAV2025',
    description: '25% de descuento en la colección navideña del 2025.',
    discountType: 'percentage',
    discountValue: 25,
    minPurchase: 120,
    expiryDate: '2025-12-31',
    status: 'used',
    autoApply: false,
  },
  {
    id: '6',
    code: 'FLASH10',
    description: '10% off en flash sale. Se aplicó automáticamente al finalizar la compra.',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 75,
    expiryDate: '2026-01-15',
    status: 'used',
    autoApply: true,
  },
  {
    id: '7',
    code: 'PRIMAVERA',
    description: '20% de descuento en la colección primavera 2025.',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 100,
    expiryDate: '2025-05-31',
    status: 'expired',
    autoApply: false,
  },
  {
    id: '8',
    code: 'REGALO30',
    description: '$30 de descuento en categorías seleccionadas.',
    discountType: 'fixed',
    discountValue: 30,
    minPurchase: 80,
    expiryDate: '2025-12-25',
    status: 'expired',
    autoApply: false,
  },
]

const promoHistory: PromoHistory[] = [
  { id: '1', couponCode: 'NAV2025', orderNumber: 'YL-20251215', date: '15 Dic 2025', discount: 45.0, total: 135.0 },
  { id: '2', couponCode: 'FLASH10', orderNumber: 'YL-20260110', date: '10 Ene 2026', discount: 18.5, total: 166.5 },
  { id: '3', couponCode: 'PRIMAVERA', orderNumber: 'YL-20250422', date: '22 Abr 2025', discount: 36.0, total: 144.0 },
]

const tabs: { id: CouponStatus; label: string }[] = [
  { id: 'available', label: 'Disponibles' },
  { id: 'used', label: 'Usados' },
  { id: 'expired', label: 'Expirados' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function DashboardCoupons() {
  const [activeTab, setActiveTab] = useState<CouponStatus>('available')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [autoApplyMap, setAutoApplyMap] = useState<Record<string, boolean>>(
    Object.fromEntries(coupons.map((c) => [c.id, c.autoApply]))
  )

  const filtered = coupons.filter((c) => c.status === activeTab)

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleAutoApply = (id: string) => {
    setAutoApplyMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-serif text-3xl text-brown">Mis Cupones</h1>
        <p className="mb-8 text-sm text-brown/50">Gestiona tus cupones de descuento y promociones exclusivas.</p>
      </motion.div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
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
            {tab.id === activeTab && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {filtered.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gold/40 bg-white p-0 transition-all hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <div className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-cream" />
              <div className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-cream" />

              <div className="flex items-stretch">
                <div className="flex flex-col items-center justify-center border-r border-dashed border-gold/20 px-6 py-6">
                  {coupon.discountType === 'percentage' ? (
                    <div className="flex items-center gap-1 text-gold-dark">
                      <Percent size={20} />
                      <span className="font-serif text-3xl font-bold">{coupon.discountValue}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gold-dark">
                      <DollarSign size={20} />
                      <span className="font-serif text-3xl font-bold">{coupon.discountValue}</span>
                    </div>
                  )}
                  <span className="mt-1 text-xs text-brown/50">
                    {coupon.discountType === 'percentage' ? 'descuento' : 'de descuento'}
                  </span>
                </div>

                <div className="flex-1 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-gold/10 px-3 py-1 font-mono text-sm font-bold tracking-wider text-gold-dark">
                      {coupon.code}
                    </span>
                    {coupon.status === 'used' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Usado
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-brown/70">{coupon.description}</p>

                  <div className="mb-4 flex flex-wrap gap-3 text-xs text-brown/50">
                    {coupon.minPurchase > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Compra mínima ${coupon.minPurchase}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {coupon.status === 'expired' ? (
                        <span className="text-red-500">Expirado</span>
                      ) : (
                        <span>
                          {daysUntil(coupon.expiryDate)} días restantes
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {coupon.status === 'available' && (
                      <button
                        onClick={() => handleCopy(coupon.id, coupon.code)}
                        className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gold-dark active:scale-95"
                      >
                        {copiedId === coupon.id ? (
                          <>
                            <Check size={14} /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copiar código
                          </>
                        )}
                      </button>
                    )}

                    {coupon.status === 'available' && (
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-brown/50">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={autoApplyMap[coupon.id]}
                            onChange={() => toggleAutoApply(coupon.id)}
                            className="peer sr-only"
                          />
                          <div className="h-5 w-9 rounded-full bg-brown/20 transition-colors peer-checked:bg-gold" />
                          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                        Auto-aplicar
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Ticket size={48} className="mx-auto mb-4 text-brown/20" />
              <p className="text-brown/50">
                {activeTab === 'available' && 'No tienes cupones disponibles.'}
                {activeTab === 'used' && 'Aún no has usado ningún cupón.'}
                {activeTab === 'expired' && 'No tienes cupones expirados.'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="mb-4 flex items-center gap-2">
          <History size={20} className="text-gold-dark" />
          <h2 className="font-serif text-xl text-brown">Historial de Promociones</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-brown/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brown/10 bg-beige/50">
                <th className="px-4 py-3 font-medium text-brown/60">Cupón</th>
                <th className="px-4 py-3 font-medium text-brown/60">Pedido</th>
                <th className="px-4 py-3 font-medium text-brown/60">Fecha</th>
                <th className="px-4 py-3 text-right font-medium text-brown/60">Descuento</th>
                <th className="px-4 py-3 text-right font-medium text-brown/60">Total</th>
              </tr>
            </thead>
            <tbody>
              {promoHistory.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="border-b border-brown/5 last:border-0 hover:bg-beige/30"
                >
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-gold-dark">{item.couponCode}</td>
                  <td className="px-4 py-3 text-brown/70">{item.orderNumber}</td>
                  <td className="px-4 py-3 text-brown/50">{item.date}</td>
                  <td className="px-4 py-3 text-right text-green-600">-${item.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium text-brown">${item.total.toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
