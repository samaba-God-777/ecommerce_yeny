import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import api from '../lib/api'
import toast from 'react-hot-toast'

const steps = ['Envío', 'Pago', 'Confirmación'] as const

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState<{ id: string; total: number } | null>(null)
  const [payment, setPayment] = useState('card')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  })

  if (items.length === 0 && !placed) return <Link to="/" replace>Volver al inicio</Link>

  const shipping = subtotal > 80 ? 0 : 8
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id.replace('api-', ''),
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || '',
          productName: item.product.name,
          productImage: item.product.images?.[0] || '',
          price: item.product.price
        })),
        shippingAddress: `${form.address}, ${form.city}`,
        paymentMethod: payment,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        couponCode: ''
      }

      const { data } = await api.post('/orders', orderData)

      if (data.success) {
        setPlaced({ id: data.order.id, total: data.order.total })
        clearCart()
        toast.success('¡Pedido creado exitosamente!')
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear el pedido'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="rounded-full border-2 border-market p-6">
          <CheckCircle2 size={56} className="text-market" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-black tracking-tight">¡Pedido Confirmado!</h1>
        <p className="mt-2 font-mono text-lg font-bold text-ink">Orden: {placed.id}</p>
        <p className="mt-2 text-ink-soft">
          Total pagado: <strong className="money text-ink">{formatPrice(placed.total)}</strong>
        </p>
        <p className="mt-3 text-ink-soft">
          Gracias por tu compra en Yenyleths Boutique. Recibirás un correo con los detalles de tu envío.
        </p>
        <Link to="/" className="mt-8 bg-ink px-8 py-3 font-bold text-paper-elevated transition hover:bg-ink-soft">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <Helmet>
        <title>Checkout - Yenyleths Boutique</title>
        <meta name="description" content="Finaliza tu compra en Yenyleths Boutique." />
      </Helmet>
      <h1 className="mb-8 border-b border-line pb-3 text-3xl font-black tracking-tight">Checkout</h1>

      <div className="mb-10 flex items-center gap-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold ${
              i <= step ? 'bg-market text-paper-elevated' : 'bg-beige text-ink-soft'
            }`}>
              {i + 1}
            </div>
            <span className={`font-mono text-xs font-bold uppercase tracking-[0.08em] ${i <= step ? 'text-ink' : 'text-ink-soft'}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-10 bg-line" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={step === 1 ? handlePlaceOrder : (e) => { e.preventDefault(); setStep((s) => s + 1) }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mb-4 text-xl font-black tracking-tight">Dirección de Envío</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input required placeholder="Nombre completo" className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm sm:col-span-2 focus:ring-2 focus:ring-market focus:outline-none"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input required placeholder="Correo electrónico" type="email" className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm sm:col-span-2 focus:ring-2 focus:ring-market focus:outline-none"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  <input required placeholder="Teléfono" className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm sm:col-span-2 focus:ring-2 focus:ring-market focus:outline-none"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <input required placeholder="Dirección" className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm sm:col-span-2 focus:ring-2 focus:ring-market focus:outline-none"
                    value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  <input required placeholder="Ciudad" className="rounded-lg border border-line bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-market focus:outline-none"
                    value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <button type="submit" className="mt-6 bg-ink px-8 py-3 font-bold text-paper-elevated transition hover:bg-ink-soft">
                  Continuar al pago
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mb-4 font-black tracking-tight">Método de Pago</h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Tarjeta de Crédito/Débito' },
                    { id: 'yappy', label: 'Yappy Panamá' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'cod', label: 'Pago contra entrega' },
                  ].map((opt) => (
                    <label key={opt.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${payment === opt.id ? 'border-market bg-market/5' : 'border-line'}`}>
                      <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setStep(0)} className="rounded-full border border-line px-6 py-3 font-bold">
                    Atrás
                  </button>
                  <button type="submit" disabled={loading} className="rounded-full bg-market px-8 py-3 font-bold text-paper-elevated transition hover:bg-market-deep flex items-center gap-2">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</> : 'Confirmar Pedido'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <aside className="rounded-lg border border-line bg-paper-elevated p-6">
          <h2 className="mb-4 border-b border-line pb-3 font-black tracking-tight">Resumen</h2>
          <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <li key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="truncate pr-2 text-ink">{item.product.name} × {item.quantity}</span>
                <span className="money text-ink-soft">{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span className="money text-ink">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Envío</span><span className="money text-ink">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Impuestos</span><span className="money text-ink">{formatPrice(tax)}</span></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><span className="text-ink">Total</span><span className="money text-market-deep">{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}