import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  X,
  Lock,
  ShieldCheck,
  Edit3,
  Eye,
  EyeOff,
  Smartphone,
  Wallet,
  Building2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Wifi,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentMethod {
  id: string
  brand: 'visa' | 'mastercard' | 'amex' | 'paypal' | 'applepay' | 'googlepay' | 'bank'
  last4: string
  expiry: string
  holderName: string
  isDefault: boolean
  isVerified: boolean
  type: 'card' | 'digital' | 'bank'
}

const initialMethods: PaymentMethod[] = [
  {
    id: '1',
    brand: 'visa',
    last4: '4242',
    expiry: '12/27',
    holderName: 'Maria Garcia',
    isDefault: true,
    isVerified: true,
    type: 'card',
  },
  {
    id: '2',
    brand: 'mastercard',
    last4: '8888',
    expiry: '03/28',
    holderName: 'Maria Garcia',
    isDefault: false,
    isVerified: true,
    type: 'card',
  },
  {
    id: '3',
    brand: 'amex',
    last4: '1234',
    expiry: '09/26',
    holderName: 'Maria Garcia',
    isDefault: false,
    isVerified: false,
    type: 'card',
  },
  {
    id: '4',
    brand: 'paypal',
    last4: '',
    expiry: '',
    holderName: 'maria@example.com',
    isDefault: false,
    isVerified: true,
    type: 'digital',
  },
  {
    id: '5',
    brand: 'applepay',
    last4: '',
    expiry: '',
    holderName: 'iPhone de Maria',
    isDefault: false,
    isVerified: true,
    type: 'digital',
  },
  {
    id: '6',
    brand: 'bank',
    last4: '5678',
    expiry: '',
    holderName: 'Banco Nacional',
    isDefault: false,
    isVerified: true,
    type: 'bank',
  },
]

const brandColors: Record<string, string> = {
  visa: 'from-blue-800 to-blue-600',
  mastercard: 'from-red-600 to-orange-500',
  amex: 'from-blue-600 to-blue-400',
  paypal: 'from-blue-900 to-blue-500',
  applepay: 'from-gray-800 to-gray-600',
  googlepay: 'from-blue-500 to-green-500',
  bank: 'from-emerald-600 to-emerald-400',
}

const brandNames: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  paypal: 'PayPal',
  applepay: 'Apple Pay',
  googlepay: 'Google Pay',
  bank: 'Bank Transfer',
}

const supportedBrands = [
  { id: 'visa', label: 'Visa', icon: '💳' },
  { id: 'mastercard', label: 'Mastercard', icon: '💳' },
  { id: 'amex', label: 'Amex', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'applepay', label: 'Apple Pay', icon: '🍎' },
  { id: 'googlepay', label: 'Google Pay', icon: '🔍' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
]

const CardBrandIcon = ({ brand, size = 'normal' }: { brand: string; size?: 'normal' | 'large' }) => {
  const colors = brandColors[brand] || 'from-gray-200 to-gray-100'
  const iconSize = size === 'large' ? 'h-16 w-24' : 'h-12 w-16'
  const textSize = size === 'large' ? 'text-sm' : 'text-xs'
  
  return (
    <div className={`flex ${iconSize} items-center justify-center rounded-xl bg-gradient-to-br ${colors} ${textSize} font-bold text-white uppercase shadow-lg`}>
      {brand === 'paypal' ? (
        <span className="text-lg font-bold">PP</span>
      ) : brand === 'applepay' ? (
        <span className="text-sm">Pay</span>
      ) : brand === 'googlepay' ? (
        <span className="text-xs">GPay</span>
      ) : brand === 'bank' ? (
        <Building2 size={size === 'large' ? 24 : 18} />
      ) : (
        <span>{brand.slice(0, 4)}</span>
      )}
    </div>
  )
}

const CardPreview = ({ method }: { method: PaymentMethod }) => {
  const colors = brandColors[method.brand] || 'from-gray-200 to-gray-100'
  
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors} p-6 text-white shadow-2xl`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
      
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-10 rounded-md bg-yellow-300/80" />
            <Wifi size={20} className="rotate-90" />
          </div>
          <span className="text-sm font-medium opacity-80">{brandNames[method.brand]}</span>
        </div>
        
        {method.type === 'card' && (
          <p className="mb-4 font-mono text-xl tracking-widest">
            •••• •••• •••• {method.last4}
          </p>
        )}
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-60">Card Holder</p>
            <p className="font-medium">{method.holderName}</p>
          </div>
          {method.expiry && (
            <div className="text-right">
              <p className="text-xs opacity-60">Expires</p>
              <p className="font-medium">{method.expiry}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
  const [showForm, setShowForm] = useState(false)
  const [showPayPalForm, setShowPayPalForm] = useState(false)
  const [showBankForm, setShowBankForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [showCVV, setShowCVV] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: '',
    billingAddress: '1',
  })

  const openAddForm = () => {
    setForm({ cardNumber: '', expiry: '', cvv: '', holderName: '', billingAddress: '1' })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setForm({ cardNumber: '', expiry: '', cvv: '', holderName: '', billingAddress: '1' })
  }

  const detectBrand = (num: string): PaymentMethod['brand'] => {
    const cleaned = num.replace(/\s/g, '')
    if (/^4/.test(cleaned)) return 'visa'
    if (/^5[1-5]/.test(cleaned)) return 'mastercard'
    if (/^3[47]/.test(cleaned)) return 'amex'
    return 'visa'
  }

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16)
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4)
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2)
    return cleaned
  }

  const addMethod = () => {
    if (!form.cardNumber || !form.expiry || !form.cvv || !form.holderName) {
      toast.error('Please fill in all card details')
      return
    }
    const cleaned = form.cardNumber.replace(/\s/g, '')
    if (cleaned.length < 13) {
      toast.error('Invalid card number')
      return
    }
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      brand: detectBrand(cleaned),
      last4: cleaned.slice(-4),
      expiry: form.expiry,
      holderName: form.holderName,
      isDefault: methods.length === 0,
      isVerified: false,
      type: 'card',
    }
    setMethods((prev) => [...prev, newMethod])
    toast.success('Payment method added successfully')
    closeForm()
  }

  const addPayPal = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      brand: 'paypal',
      last4: '',
      expiry: '',
      holderName: 'maria@example.com',
      isDefault: methods.length === 0,
      isVerified: true,
      type: 'digital',
    }
    setMethods((prev) => [...prev, newMethod])
    toast.success('PayPal account linked successfully')
    setShowPayPalForm(false)
  }

  const addBankTransfer = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      brand: 'bank',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiry: '',
      holderName: 'Banco Nacional',
      isDefault: methods.length === 0,
      isVerified: true,
      type: 'bank',
    }
    setMethods((prev) => [...prev, newMethod])
    toast.success('Bank account added successfully')
    setShowBankForm(false)
  }

  const deleteMethod = () => {
    if (!deletingId) return
    const wasDefault = methods.find((m) => m.id === deletingId)?.isDefault
    setMethods((prev) => {
      const remaining = prev.filter((m) => m.id !== deletingId)
      if (wasDefault && remaining.length > 0) remaining[0].isDefault = true
      return remaining
    })
    setDeletingId(null)
    toast.success('Payment method removed')
  }

  const setAsDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })))
    toast.success('Default payment method updated')
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const verifyMethod = (id: string) => {
    setMethods((prev) => prev.map((m) => 
      m.id === id ? { ...m, isVerified: true } : m
    ))
    toast.success('Payment method verified successfully')
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
              <CreditCard size={22} className="text-pink-500" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-brown">Payment Methods</h1>
              <p className="text-sm text-brown/60">
                Manage your cards, digital wallets, and bank accounts
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPayPalForm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-pink-50"
            >
              <Wallet size={16} />
              PayPal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBankForm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-pink-50"
            >
              <Building2 size={16} />
              Bank
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddForm}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition-colors hover:bg-pink-600"
            >
              <Plus size={18} />
              Add Card
            </motion.button>
          </div>
        </motion.div>

        {/* Digital Wallets Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="mb-3 text-sm font-medium text-brown/60">Quick Add Digital Wallets</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!methods.some(m => m.brand === 'applepay')) {
                  setMethods(prev => [...prev, {
                    id: Date.now().toString(),
                    brand: 'applepay',
                    last4: '',
                    expiry: '',
                    holderName: 'Apple Pay',
                    isDefault: false,
                    isVerified: true,
                    type: 'digital',
                  }])
                  toast.success('Apple Pay added')
                } else {
                  toast.error('Apple Pay already added')
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <Smartphone size={20} />
              <span className="font-medium">Apple Pay</span>
            </button>
            <button
              onClick={() => {
                if (!methods.some(m => m.brand === 'googlepay')) {
                  setMethods(prev => [...prev, {
                    id: Date.now().toString(),
                    brand: 'googlepay',
                    last4: '',
                    expiry: '',
                    holderName: 'Google Pay',
                    isDefault: false,
                    isVerified: true,
                    type: 'digital',
                  }])
                  toast.success('Google Pay added')
                } else {
                  toast.error('Google Pay already added')
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <span className="text-lg">🔍</span>
              <span className="font-medium">Google Pay</span>
            </button>
          </div>
        </motion.div>

        {/* Supported Methods */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {supportedBrands.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white px-3 py-1.5 text-xs font-medium text-brown/60"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Payment Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {methods.map((method) => (
            <motion.div
              key={method.id}
              variants={fadeUp}
              layout
              className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
                method.isDefault
                  ? 'border-pink-400 bg-pink-50 shadow-lg shadow-pink-100'
                  : 'border-gray-100 bg-white hover:border-pink-200 hover:shadow-md'
              }`}
            >
              {method.isDefault && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <Star size={12} fill="currentColor" />
                  Default
                </div>
              )}

              <div className="mb-4 flex items-start justify-between">
                <CardBrandIcon brand={method.brand} />
                <div className="flex items-center gap-2">
                  {method.isVerified ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => verifyMethod(method.id)}
                      className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600 hover:bg-yellow-200"
                    >
                      <AlertCircle size={12} />
                      Verify
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                {method.type === 'card' ? (
                  <>
                    <p className="font-mono text-lg tracking-wider text-brown">
                      &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {method.last4}
                    </p>
                    {method.expiry && (
                      <p className="mt-1 text-sm text-brown/50">Expires {method.expiry}</p>
                    )}
                  </>
                ) : method.brand === 'paypal' ? (
                  <p className="text-sm font-medium text-brown">{method.holderName}</p>
                ) : method.brand === 'bank' ? (
                  <p className="font-mono text-sm text-brown">****{method.last4}</p>
                ) : (
                  <p className="text-sm font-medium text-brown">{method.holderName}</p>
                )}
                <p className="mt-0.5 text-sm text-brown/50">{method.holderName}</p>
              </div>

              <div className="flex gap-2 border-t border-gray-100 pt-3">
                {!method.isDefault && (
                  <button
                    onClick={() => setAsDefault(method.id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-pink-500 transition-colors hover:bg-pink-50"
                  >
                    <Star size={12} />
                    Default
                  </button>
                )}
                <button
                  onClick={() => setSelectedMethod(method)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <Eye size={12} />
                  View
                </button>
                <button
                  onClick={() => {
                    setEditingMethod(method)
                    setForm({
                      cardNumber: '',
                      expiry: method.expiry,
                      cvv: '',
                      holderName: method.holderName,
                      billingAddress: '1',
                    })
                  }}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <Edit3 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(method.id)}
                  className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {methods.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 py-16"
          >
            <CreditCard size={48} className="mb-4 text-pink-200" />
            <p className="font-serif text-xl text-brown/40">No payment methods saved</p>
            <p className="mt-1 text-sm text-brown/30">
              Add a card, digital wallet, or bank account to get started
            </p>
          </motion.div>
        )}

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 px-5 py-4"
        >
          <ShieldCheck size={20} className="shrink-0 text-pink-500" />
          <div>
            <p className="text-sm font-medium text-brown">Secure Payment Processing</p>
            <p className="text-xs text-brown/50">
              Your payment information is encrypted with 256-bit SSL. We never store your
              full card number or CVV on our servers.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="font-serif text-xl text-brown">Add Credit/Debit Card</h2>
                <button
                  onClick={closeForm}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-brown"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Card Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4">
                <CardPreview 
                  method={{
                    id: 'preview',
                    brand: form.cardNumber ? detectBrand(form.cardNumber) : 'visa',
                    last4: form.cardNumber ? form.cardNumber.replace(/\s/g, '').slice(-4) : '••••',
                    expiry: form.expiry || 'MM/YY',
                    holderName: form.holderName || 'CARD HOLDER',
                    isDefault: false,
                    isVerified: true,
                    type: 'card',
                  }}
                />
              </div>

              <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            cardNumber: formatCardNumber(e.target.value),
                          }))
                        }
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 font-mono text-sm text-brown placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                      />
                      <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={form.expiry}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            expiry: formatExpiry(e.target.value),
                          }))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm text-brown placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type={showCVV ? 'text' : 'password'}
                          value={form.cvv}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                            }))
                          }
                          placeholder="•••"
                          maxLength={4}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 font-mono text-sm text-brown placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCVV(!showCVV)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={form.holderName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, holderName: e.target.value }))
                      }
                      placeholder="MARIA GARCIA"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-brown placeholder:text-gray-400 uppercase focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Billing Address
                    </label>
                    <select
                      value={form.billingAddress}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, billingAddress: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-brown focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="1">1234 Sunset Boulevard, Los Angeles, CA 90028</option>
                      <option value="2">5678 Oak Avenue, Beverly Hills, CA 90210</option>
                      <option value="3">910 Maple Drive, Santa Monica, CA 90401</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  onClick={closeForm}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addMethod}
                  className="flex-1 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition-colors hover:bg-pink-600"
                >
                  Add Card
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PayPal Modal */}
      <AnimatePresence>
        {showPayPalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setShowPayPalForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Wallet size={32} className="text-blue-600" />
                </div>
                <h3 className="font-serif text-xl text-brown">Link PayPal Account</h3>
                <p className="mt-2 text-sm text-brown/60">
                  Connect your PayPal account for fast and secure checkout
                </p>
              </div>
              
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-brown/60">Email:</p>
                <p className="font-medium text-brown">maria@example.com</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayPalForm(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addPayPal}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Link PayPal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Transfer Modal */}
      <AnimatePresence>
        {showBankForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setShowBankForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Building2 size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-serif text-xl text-brown">Add Bank Account</h3>
                <p className="mt-2 text-sm text-brown/60">
                  Link your bank account for direct transfers
                </p>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-brown/60">Bank Name</p>
                  <p className="font-medium text-brown">Banco Nacional</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-brown/60">Account Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-medium text-brown">****5678</p>
                    <button
                      onClick={() => copyToClipboard('1234567890', 'bank')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedId === 'bank' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBankForm(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addBankTransfer}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Add Bank Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Card Modal */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setSelectedMethod(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl text-brown">Card Details</h3>
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <CardPreview method={selectedMethod} />

              <div className="mt-6 space-y-3">
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-brown/60">Card Type</span>
                  <span className="font-medium text-brown">{brandNames[selectedMethod.brand]}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-brown/60">Card Number</span>
                  <span className="font-mono text-brown">•••• •••• •••• {selectedMethod.last4}</span>
                </div>
                {selectedMethod.expiry && (
                  <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <span className="text-sm text-brown/60">Expires</span>
                    <span className="font-medium text-brown">{selectedMethod.expiry}</span>
                  </div>
                )}
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-brown/60">Cardholder</span>
                  <span className="font-medium text-brown">{selectedMethod.holderName}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-brown/60">Status</span>
                  <span className={`font-medium ${selectedMethod.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedMethod.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedMethod(null)}
                className="mt-6 w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-gray-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Card Modal */}
      <AnimatePresence>
        {editingMethod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setEditingMethod(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl text-brown">Edit Payment Method</h3>
                <button
                  onClick={() => setEditingMethod(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-brown">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingMethod.holderName}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-brown focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                {editingMethod.type === 'card' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      defaultValue={editingMethod.expiry}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm text-brown focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditingMethod(null)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Payment method updated')
                    setEditingMethod(null)
                  }}
                  className="flex-1 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-serif text-lg text-brown">Remove Payment Method?</h3>
              <p className="mt-2 text-sm text-brown/60">
                This payment method will be permanently removed. You can always add it back
                later.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteMethod}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
