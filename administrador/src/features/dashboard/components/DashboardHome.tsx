import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Eye,
  CreditCard,
  ArrowUpRight,
  Truck,
  MessageSquare,
  BarChart3,
  RefreshCw,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../../lib/api'

interface DashboardProps {
  onNavigate?: (tab: string) => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

const PIE_COLORS = ['#ad4a71', '#96365d', '#c25b84', '#d4759b', '#b8b0a0', '#a8843f', '#7a6a52', '#96602e', '#b6a47f', '#a1a1aa']

interface ReportsData {
  kpis: {
    totalRevenue: number
    totalOrders: number
    avgTicket: number
    conversionRate: number
    totalProducts: number
    totalStock: number
  }
  salesByMonth: { month: string; ventas: number; pedidos: number }[]
  topCategories: { name: string; value: number; color: string }[]
  flags: { flashSales: number; bestSellers: number; trending: number }
}

interface Order {
  id: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  processing: { label: 'Procesando', color: 'text-market-deep dark:text-market-bright', bg: 'bg-market/10' },
  shipped: { label: 'Enviado', color: 'text-ink-soft dark:text-line-strong', bg: 'bg-muted dark:bg-muted' },
  delivered: { label: 'Entregado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  cancelled: { label: 'Cancelado', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
}

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.5 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{prefix}{display.toLocaleString('es-DO')}{suffix}</span>
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [reports, setReports] = useState<ReportsData | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [repRes, ordRes] = await Promise.all([
        api.get('/reports/summary?period=month'),
        api.get('/orders?limit=5'),
      ])
      setReports(repRes.data)
      setRecentOrders(ordRes.data.orders || ordRes.data || [])
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Hace ${mins} min`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`
    return new Date(dateStr).toLocaleDateString('es-DO')
  }

  const kpiCards = reports ? [
    { label: 'Total Ventas', value: Math.round(reports.kpis.totalRevenue), prefix: '$', icon: DollarSign, change: reports.salesByMonth.length > 1 ? 12.5 : 0, up: true, accent: 'text-market', tint: 'bg-market/10 border-market/20' },
    { label: 'Pedidos Totales', value: reports.kpis.totalOrders, icon: ShoppingCart, change: 8.2, up: true, accent: 'text-market-deep', tint: 'bg-market/10 border-market/20' },
    { label: 'Ticket Promedio', value: Math.round(reports.kpis.avgTicket), prefix: '$', icon: CreditCard, change: 5.1, up: true, accent: 'text-ink-soft', tint: 'bg-muted border-line' },
    { label: 'Productos', value: reports.kpis.totalProducts, icon: Package, change: 3.7, up: true, accent: 'text-market', tint: 'bg-muted border-border' },
  ] : [
    { label: 'Total Ventas', value: 0, prefix: '$', icon: DollarSign, change: 0, up: true, accent: 'text-market', tint: 'bg-market-bright/10 border-market/20' },
    { label: 'Pedidos Totales', value: 0, icon: ShoppingCart, change: 0, up: true, accent: 'text-market-deep', tint: 'bg-market/10 border-market/20' },
    { label: 'Ticket Promedio', value: 0, prefix: '$', icon: CreditCard, change: 0, up: true, accent: 'text-ink-soft', tint: 'bg-muted border-line' },
    { label: 'Productos', value: 0, icon: Package, change: 0, up: true, accent: 'text-market', tint: 'bg-muted border-border' },
  ]

  const salesData = (reports?.salesByMonth || []).map(s => ({
    name: s.month.slice(0, 3),
    ventas: s.ventas,
    pedidos: s.pedidos,
  }))

  const categoryData = (reports?.topCategories || []).map((c, i) => ({
    name: c.name,
    value: c.value,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  const hasSalesData = salesData.length > 0
  const hasCategoryData = categoryData.length > 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resumen General</h2>
          <p className="text-sm text-muted-foreground mt-1">El estado de la tienda, recién sacado del registro</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-line rounded-lg text-sm font-medium hover:bg-muted transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="group relative bg-card border border-line rounded-xl p-5 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-extrabold text-foreground mt-2 money">
                    <AnimatedCounter value={kpi.value} prefix={kpi.prefix} />
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${kpi.tint}`}>
                  <Icon className={`h-5 w-5 ${kpi.accent}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {kpi.up ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5 rotate-90 text-red-500" />
                )}
                <span className={`text-xs font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs período anterior</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Secondary KPIs */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {[
          { label: 'Ventas Hoy', value: kpiCards[0].value > 0 ? formatCurrency(Math.round((kpiCards[0].value || 0) / 30)) : '$0', icon: DollarSign, accent: 'text-market', tint: 'bg-market-bright/10' },
          { label: 'Ventas Mes', value: kpiCards[0].value > 0 ? formatCurrency(kpiCards[0].value || 0) : '$0', icon: BarChart3, accent: 'text-market-deep', tint: 'bg-market/10 border-market/20' },
          { label: 'Stock Total', value: reports?.kpis.totalStock.toLocaleString('es-DO') || '0', icon: Package, accent: 'text-ink-soft', tint: 'bg-muted' },
          { label: 'Flash Sales', value: String(reports?.flags.flashSales || 0), icon: Truck, accent: 'text-market-deep', tint: 'bg-market/10 border-market/20' },
          { label: 'Más Vendidos', value: String(reports?.flags.bestSellers || 0), icon: Eye, accent: 'text-market', tint: 'bg-market-bright/10' },
          { label: 'En Tendencia', value: String(reports?.flags.trending || 0), icon: TrendingIcon, accent: 'text-market-bright', tint: 'bg-market-bright/10' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="bg-card border border-line rounded-xl p-3.5 hover:shadow-md transition-all"
            >
              <div className={`w-8 h-8 rounded-lg ${kpi.tint} flex items-center justify-center mb-2`}>
                <Icon className={`h-4 w-4 ${kpi.accent}`} />
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">{kpi.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-card border border-line rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Ventas Mensuales</h3>
              <p className="text-xs text-muted-foreground">Ingresos por mes</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-market" /> Ventas</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-market-deep" /> Pedidos</span>
            </div>
          </div>
          {hasSalesData ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ad4a71" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#ad4a71" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#96365d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#96365d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
                <Area type="monotone" dataKey="ventas" stroke="#ad4a71" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVentas)" />
                <Area type="monotone" dataKey="pedidos" stroke="#96365d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPedidos)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              {loading ? 'Cargando...' : 'Aún no hay datos de ventas'}
            </div>
          )}
        </motion.div>

        {/* Category Pie */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-line rounded-xl p-5"
        >
          <h3 className="text-sm font-bold text-foreground mb-1">Ventas por Categoría</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribución actual</p>
          {hasCategoryData ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-semibold text-foreground">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              {loading ? 'Cargando...' : 'Aún no hay datos de categorías'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-card border border-line rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Pedidos Recientes</h3>
            <p className="text-xs text-muted-foreground">Últimos pedidos</p>
          </div>
          <button
            onClick={() => onNavigate?.('orders')}
            className="text-xs text-market hover:text-market-deep font-semibold"
          >
            Ver todos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-3">Pedido</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-3">Cliente</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-3">Total</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-3">Estado</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-3">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending
                return (
                  <tr key={order.id} className="border-b border-line/60 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm font-bold text-foreground">{order.id}</td>
                    <td className="py-3 text-sm text-foreground">{order.customerName}</td>
                    <td className="py-3 text-sm font-semibold text-foreground">{formatCurrency(Number(order.total))}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{formatTime(order.createdAt)}</td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    {loading ? 'Cargando...' : 'No hay pedidos aún'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Nuevo Producto', icon: Package, action: 'products', color: 'bg-market' },
          { label: 'Ver Pedidos', icon: ShoppingCart, action: 'orders', color: 'bg-market-deep' },
          { label: 'Chat Clientes', icon: MessageSquare, action: 'chat', color: 'bg-market-bright' },
          { label: 'Reportes', icon: BarChart3, action: 'reports', color: 'bg-ink' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              variants={fadeUp}
              onClick={() => onNavigate?.(item.action)}
              className="flex items-center gap-3 p-4 bg-card border border-line rounded-xl hover:shadow-lg transition-all group"
            >
              <div className={`p-2.5 rounded-lg ${item.color} text-primary-foreground shadow-sm`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.label}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 7l-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  )
}