import { motion } from 'framer-motion'
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  Tag,
  DollarSign,
  BarChart3,
  Crown,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const monthlySpending = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 85 },
  { month: 'Mar', amount: 200 },
  { month: 'Apr', amount: 150 },
  { month: 'May', amount: 280 },
  { month: 'Jun', amount: 340 },
]

const maxSpending = Math.max(...monthlySpending.map((m) => m.amount))

const categories = [
  { name: 'Dresses', percent: 35, color: 'from-pink-400 to-pink-500' },
  { name: 'Accessories', percent: 25, color: 'from-amber-400 to-amber-500' },
  { name: 'Bags', percent: 20, color: 'from-purple-400 to-purple-500' },
  { name: 'Jewelry', percent: 12, color: 'from-rose-400 to-rose-500' },
  { name: 'Shoes', percent: 8, color: 'from-cyan-400 to-cyan-500' },
]

const brands = [
  { name: 'Gucci', orders: 8, spent: '$320' },
  { name: 'Prada', orders: 5, spent: '$210' },
  { name: 'Dior', orders: 4, spent: '$185' },
  { name: 'Chanel', orders: 3, spent: '$150' },
  { name: 'Louis Vuitton', orders: 2, spent: '$95' },
]

const categoryBreakdown = [
  { name: 'Dresses', amount: '$385', percent: 28 },
  { name: 'Accessories', amount: '$275', percent: 20 },
  { name: 'Bags', amount: '$220', percent: 16 },
  { name: 'Jewelry', amount: '$195', percent: 14 },
  { name: 'Shoes', amount: '$165', percent: 12 },
  { name: 'Other', amount: '$130', percent: 10 },
]

const monthlyComparison = [
  { month: 'May 2026', spent: '$280', orders: 5 },
  { month: 'Jun 2026', spent: '$340', orders: 7 },
]

export default function DashboardAnalytics() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="font-serif text-3xl text-brown">My Analytics</h1>
          <p className="mt-2 text-brown/60">Track your shopping patterns and savings.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl font-bold text-brown">$1,370</p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <ArrowUpRight size={14} className="text-emerald-500" />
              <span className="font-medium text-emerald-500">+12%</span>
              <span className="text-brown/40">vs last month</span>
            </div>
            <p className="mt-0.5 text-xs text-brown/50">Total Spent</p>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white">
              <ShoppingBag size={20} />
            </div>
            <p className="text-2xl font-bold text-brown">$46.55</p>
            <p className="mt-1 text-xs text-brown/50">Average Order</p>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 text-white">
              <Crown size={20} />
            </div>
            <p className="text-2xl font-bold text-brown">Dresses</p>
            <p className="mt-1 text-xs text-brown/50">Top Category</p>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 text-white">
              <Heart size={20} />
            </div>
            <p className="text-2xl font-bold text-brown">Gucci</p>
            <p className="mt-1 text-xs text-brown/50">Favorite Brand</p>
          </div>
        </motion.div>

        {/* Monthly Spending Chart */}
        <motion.div variants={fadeUp} className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-pink-500" />
            <h2 className="font-serif text-xl text-brown">Monthly Spending</h2>
          </div>
          <div className="flex items-end gap-3 sm:gap-6" style={{ height: 220 }}>
            {monthlySpending.map((m) => {
              const height = (m.amount / maxSpending) * 100
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-brown">${m.amount}</span>
                  <div className="relative w-full rounded-t-lg bg-pink-100" style={{ height: 180 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-pink-400 to-pink-500"
                    />
                  </div>
                  <span className="text-xs font-medium text-brown/60">{m.month}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Favorite Categories */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl text-brown">Favorite Categories</h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-brown">{cat.name}</span>
                    <span className="font-semibold text-brown/70">{cat.percent}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-pink-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Favorite Brands */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl text-brown">Favorite Brands</h2>
            <div className="space-y-3">
              {brands.map((brand, i) => (
                <div
                  key={brand.name}
                  className="flex items-center gap-4 rounded-xl border border-pink-50 bg-pink-50/30 p-3.5 transition hover:bg-pink-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brown">{brand.name}</p>
                    <p className="text-xs text-brown/50">{brand.orders} orders</p>
                  </div>
                  <span className="text-sm font-bold text-brown">{brand.spent}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Total Savings + Coupons */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Tag size={20} className="text-pink-500" />
              <h2 className="font-serif text-xl text-brown">Savings Summary</h2>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-5 text-center">
                <p className="text-3xl font-bold text-pink-500">$245</p>
                <p className="mt-1 text-sm text-brown/60">Total Saved</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-5 text-center">
                <p className="text-3xl font-bold text-pink-500">18</p>
                <p className="mt-1 text-sm text-brown/60">Coupons Used</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-pink-100 bg-pink-50/50 p-4">
              <div className="flex items-center gap-3">
                <Percent size={18} className="text-pink-400" />
                <div>
                  <p className="text-sm font-medium text-brown">Average discount per order</p>
                  <p className="text-lg font-bold text-pink-500">$13.61</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Spending by Category Breakdown */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl text-brown">Spending by Category</h2>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brown">{cat.name}</span>
                      <span className="text-sm font-semibold text-brown/70">{cat.amount}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-pink-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-pink-300 to-pink-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Monthly Comparison */}
        <motion.div variants={fadeUp} className="mt-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-serif text-xl text-brown">Monthly Comparison</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {monthlyComparison.map((m, i) => (
              <div
                key={m.month}
                className={`rounded-xl border-2 p-5 ${
                  i === 1 ? 'border-pink-300 bg-pink-50' : 'border-pink-100 bg-white'
                }`}
              >
                <p className="text-sm font-medium text-brown/60">{m.month}</p>
                <p className="mt-2 text-2xl font-bold text-brown">{m.spent}</p>
                <div className="mt-2 flex items-center gap-1">
                  <ShoppingBag size={14} className="text-pink-400" />
                  <span className="text-sm text-brown/60">{m.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4">
            <ArrowUpRight size={18} className="text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">
              You spent $60 more in June compared to May — that's a 21.4% increase.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
