import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Send,
  Gift,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  DollarSign,
  Sparkles,
  ArrowRight,
  Receipt,
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  description: string
  type: 'credit' | 'debit'
  amount: string
  balance: string
  category?: string
}

interface GiftCard {
  id: string
  code: string
  balance: string
  originalAmount: string
  expiry: string
  color: string
}

interface CashbackEntry {
  id: string
  order: string
  amount: string
  status: 'pending' | 'credited'
  date: string
}

const transactions: Transaction[] = [
  { id: 'TX-9012', date: '28 Jun 2026', description: 'Compra - Vestido Floral Primavera', type: 'debit', amount: '-$78.00', balance: '$128.50', category: 'Compras' },
  { id: 'TX-9011', date: '27 Jun 2026', description: 'Cashback por pedido #YB-2840', type: 'credit', amount: '+$7.80', balance: '$206.50', category: 'Cashback' },
  { id: 'TX-9010', date: '25 Jun 2026', description: 'Recarga de billetera', type: 'credit', amount: '+$150.00', balance: '$198.70', category: 'Recarga' },
  { id: 'TX-9009', date: '23 Jun 2026', description: 'Compra - Bolso Croco Premium', type: 'debit', amount: '-$125.00', balance: '$48.70', category: 'Compras' },
  { id: 'TX-9008', date: '20 Jun 2026', description: 'Transferencia recibida de María G.', type: 'credit', amount: '+$35.00', balance: '$173.70', category: 'Transferencia' },
  { id: 'TX-9007', date: '18 Jun 2026', description: 'Canje de puntos de fidelidad', type: 'credit', amount: '+$25.00', balance: '$138.70', category: 'Puntos' },
  { id: 'TX-9006', date: '15 Jun 2026', description: 'Compra - Collar Perlas Cultivadas', type: 'debit', amount: '-$62.00', balance: '$113.70', category: 'Compras' },
  { id: 'TX-9005', date: '12 Jun 2026', description: 'Reembolso - Pedido #YB-2780', type: 'credit', amount: '+$89.00', balance: '$175.70', category: 'Reembolso' },
  { id: 'TX-9004', date: '10 Jun 2026', description: 'Recarga de billetera', type: 'credit', amount: '+$100.00', balance: '$86.70', category: 'Recarga' },
  { id: 'TX-9003', date: '8 Jun 2026', description: 'Compra - Abrigo Lino Beige', type: 'debit', amount: '-$89.00', balance: '-$13.30', category: 'Compras' },
]

const giftCards: GiftCard[] = [
  {
    id: 'GC-001',
    code: 'YB-GIFT-****-7821',
    balance: '$45.00',
    originalAmount: '$100.00',
    expiry: 'Dic 2026',
    color: 'from-gold via-gold-dark to-pink-600',
  },
  {
    id: 'GC-002',
    code: 'YB-GIFT-****-3394',
    balance: '$20.00',
    originalAmount: '$50.00',
    expiry: 'Mar 2027',
    color: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
]

const cashbackEntries: CashbackEntry[] = [
  { id: 'CB-045', order: 'YB-2840', amount: '$7.80', status: 'credited', date: '27 Jun 2026' },
  { id: 'CB-042', order: 'YB-2835', amount: '$12.50', status: 'pending', date: '25 Jun 2026' },
  { id: 'CB-039', order: 'YB-2820', amount: '$6.20', status: 'credited', date: '22 Jun 2026' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardWallet() {
  const [showBalance, setShowBalance] = useState(true)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferRecipient, setTransferRecipient] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showTransactions, setShowTransactions] = useState(true)

  const quickAmounts = ['25', '50', '100', '200', '500']

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
            <Wallet size={20} className="text-gold-dark" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-brown">Mi Billetera</h1>
            <p className="text-sm text-brown/50">Gestiona tus fondos, tarjetas de regalo y cashback</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Balance Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold via-gold-dark to-pink-600 p-6 text-white shadow-xl shadow-gold/20"
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Saldo disponible</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    {showBalance ? (
                      <motion.span
                        key="visible"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl font-bold"
                      >
                        $128.50
                      </motion.span>
                    ) : (
                      <motion.span
                        key="hidden"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl font-bold"
                      >
                        ••••
                      </motion.span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                <TrendingUp size={14} />
                <span>+12.3% este mes</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            {[
              { id: 'recharge', label: 'Recargar', icon: Plus, color: 'bg-gold/10 text-gold-dark hover:bg-gold/20' },
              { id: 'transfer', label: 'Transferir', icon: Send, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { id: 'withdraw', label: 'Retirar', icon: ArrowUpRight, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
            ].map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveAction(activeAction === action.id ? null : action.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${action.color} ${
                  activeAction === action.id ? 'ring-2 ring-gold shadow-md' : ''
                }`}
              >
                <action.icon size={22} />
                <span className="text-xs font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Action Panels */}
          <AnimatePresence mode="wait">
            {activeAction === 'recharge' && (
              <motion.div
                key="recharge"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-gold/20 bg-beige p-5">
                  <h3 className="mb-3 font-serif text-lg text-brown">Recargar Billetera</h3>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setRechargeAmount(amt)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          rechargeAmount === amt
                            ? 'border-gold bg-gold/10 text-gold-dark'
                            : 'border-brown/10 text-brown/60 hover:border-gold/30'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative mb-3">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
                    <input
                      type="number"
                      placeholder="Otra cantidad"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      className="w-full rounded-xl border border-brown/10 bg-white py-2.5 pl-9 pr-4 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold/20"
                  >
                    Recargar ${rechargeAmount || '0'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeAction === 'transfer' && (
              <motion.div
                key="transfer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-blue-200 bg-beige p-5">
                  <h3 className="mb-3 font-serif text-lg text-brown">Transferir Fondos</h3>
                  <input
                    type="text"
                    placeholder="Nombre o correo del destinatario"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-brown/10 bg-white px-4 py-2.5 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                  />
                  <div className="relative mb-3">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
                    <input
                      type="number"
                      placeholder="Monto a transferir"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full rounded-xl border border-brown/10 bg-white py-2.5 pl-9 pr-4 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    Transferir ${transferAmount || '0'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeAction === 'withdraw' && (
              <motion.div
                key="withdraw"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-emerald-200 bg-beige p-5">
                  <h3 className="mb-3 font-serif text-lg text-brown">Retirar Fondos</h3>
                  <p className="mb-3 text-xs text-brown/50">El retiro se procesará en 1-3 días hábiles a tu cuenta bancaria.</p>
                  <div className="relative mb-3">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
                    <input
                      type="number"
                      placeholder="Monto a retirar"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full rounded-xl border border-brown/10 bg-white py-2.5 pl-9 pr-4 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                  >
                    Retirar ${withdrawAmount || '0'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction History */}
          <motion.div variants={itemVariants}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-brown">Historial de Transacciones</h3>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="flex items-center gap-1 text-xs text-brown/40 hover:text-brown/60 transition-colors"
              >
                <Receipt size={14} />
                {showTransactions ? 'Ocultar' : 'Ver todo'}
              </button>
            </div>

            <AnimatePresence>
              {showTransactions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl bg-beige p-1">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-brown/10">
                            <th className="px-4 py-3 font-medium text-brown/50">Fecha</th>
                            <th className="px-4 py-3 font-medium text-brown/50">Descripción</th>
                            <th className="px-4 py-3 font-medium text-brown/50">Tipo</th>
                            <th className="px-4 py-3 font-medium text-brown/50 text-right">Monto</th>
                            <th className="px-4 py-3 font-medium text-brown/50 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-brown/5 last:border-0 hover:bg-white/50 transition-colors">
                              <td className="whitespace-nowrap px-4 py-3 text-brown/40">{tx.date}</td>
                              <td className="px-4 py-3">
                                <span className="font-medium text-brown">{tx.description}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  tx.type === 'credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {tx.type === 'credit' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                  {tx.type === 'credit' ? 'Crédito' : 'Débito'}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-right font-medium ${
                                tx.type === 'credit' ? 'text-emerald-600' : 'text-brown'
                              }`}>
                                {tx.amount}
                              </td>
                              <td className="px-4 py-3 text-right text-brown/50">{tx.balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Gift Cards */}
          <motion.div variants={itemVariants}>
            <div className="mb-3 flex items-center gap-2">
              <Gift size={18} className="text-gold-dark" />
              <h3 className="font-serif text-lg text-brown">Tarjetas de Regalo</h3>
            </div>

            <div className="space-y-3">
              {giftCards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg`}
                >
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-white/70">Saldo disponible</p>
                        <p className="mt-1 font-serif text-2xl font-bold">{card.balance}</p>
                      </div>
                      <Sparkles size={20} className="text-white/60" />
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-[10px] font-mono text-white/50">{card.code}</p>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Original: {card.originalAmount}</span>
                        <span>Exp: {card.expiry}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brown/20 p-4 text-sm font-medium text-brown/50 transition-colors hover:border-gold/40 hover:text-gold-dark"
              >
                <Plus size={18} />
                Agregar tarjeta de regalo
              </motion.button>
            </div>
          </motion.div>

          {/* Cashback */}
          <motion.div variants={itemVariants}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-gold-dark" />
              <h3 className="font-serif text-lg text-brown">Cashback</h3>
            </div>

            <div className="rounded-2xl bg-beige p-4">
              <div className="mb-4 rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 p-4">
                <p className="text-xs text-brown/50">Cashback acumulado este mes</p>
                <p className="mt-1 font-serif text-2xl font-bold text-gold-dark">$26.50</p>
                <p className="mt-0.5 text-xs text-brown/40">Tasa: 5% en todas las compras</p>
              </div>

              <div className="space-y-2">
                {cashbackEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-brown">Pedido {entry.order}</p>
                      <p className="text-[10px] text-brown/40">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-600">{entry.amount}</span>
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        entry.status === 'credited'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {entry.status === 'credited' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {entry.status === 'credited' ? 'Acreditado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="rounded-2xl bg-beige p-4">
            <h3 className="mb-3 font-serif text-lg text-brown">Resumen</h3>
            <div className="space-y-3">
              {[
                { label: 'Total gastado este mes', value: '$265.00', color: 'text-brown' },
                { label: 'Total ahorrado', value: '$42.30', color: 'text-emerald-600' },
                { label: 'Puntos acumulados', value: '1,250', color: 'text-gold-dark' },
                { label: 'Nivel de fidelidad', value: 'Oro ★', color: 'text-gold-dark' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm text-brown/50">{stat.label}</span>
                  <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
