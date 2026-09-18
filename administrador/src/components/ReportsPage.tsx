import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  FileText,
  FileSpreadsheet,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  ArrowUpRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { API_BASE as API } from '../lib/urls'



const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const PIE_COLORS = ['#f472b6', '#c8a75a', '#a78bfa', '#34d399', '#60a5fa', '#f97316', '#06b6d4', '#ef4444', '#84cc16', '#a1a1aa']

interface SummaryData {
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

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [period, setPeriod] = useState('month')
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/reports/summary?period=${period}`)
      const json = await res.json()
      setData(json)
    } catch {
      // mantener datos anteriores si hay error
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleExportPDF = () => {
    if (!data) return
    const rows = [
      ['Métrica', 'Valor'],
      ['Ingresos Totales', formatCurrency(data.kpis.totalRevenue)],
      ['Pedidos Totales', String(data.kpis.totalOrders)],
      ['Ticket Promedio', formatCurrency(data.kpis.avgTicket)],
      ['Tasa Conversión', data.kpis.conversionRate + '%'],
      ['Productos Totales', String(data.kpis.totalProducts)],
      ['Stock Total', String(data.kpis.totalStock)],
      ['Flash Sales', String(data.flags.flashSales)],
      ['Más Vendidos', String(data.flags.bestSellers)],
      ['En Tendencia', String(data.flags.trending)],
      [],
      ['Mes', 'Ventas', 'Pedidos'],
      ...data.salesByMonth.map(m => [m.month, formatCurrency(m.ventas), String(m.pedidos)]),
    ]
    downloadCSV(rows, `reporte-yenyleths-${period}.csv`)
  }

  const handleExportExcel = () => {
    if (!data) return
    const rows = [
      ['Categoría', 'Porcentaje'],
      ...data.topCategories.map(c => [c.name, c.value + '%']),
      [],
      ['Mes', 'Ventas', 'Pedidos'],
      ...data.salesByMonth.map(m => [m.month, formatCurrency(m.ventas), String(m.pedidos)]),
    ]
    downloadCSV(rows, `categorias-ventas-${period}.csv`)
  }

  if (loading && !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
          <div className="h-4 w-64 bg-muted rounded mx-auto" />
        </div>
      </div>
    )
  }

  const kpis = data ? [
    { label: 'Ingresos Totales', value: formatCurrency(data.kpis.totalRevenue), change: 15.3, up: true, icon: DollarSign, tint: 'bg-market/10 border-market/25', accent: 'text-market' },
    { label: 'Pedidos Totales', value: data.kpis.totalOrders.toLocaleString('en-US'), change: 12.1, up: true, icon: ShoppingCart, tint: 'bg-muted border-line', accent: 'text-ink-soft' },
    { label: 'Ticket Promedio', value: formatCurrency(data.kpis.avgTicket), change: 3.2, up: true, icon: BarChart3, tint: 'bg-muted border-line', accent: 'text-market-deep' },
    { label: 'Tasa Conversión', value: data.kpis.conversionRate + '%', change: 0.8, up: true, icon: TrendingUp, tint: 'bg-market-bright/10 border-market-bright/25', accent: 'text-market' },
  ] : []

  const emptyCategories = !data || data.topCategories.length === 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-serif">Reportes</h2>
          <p className="text-sm text-muted-foreground mt-1">Análisis detallado del rendimiento de tu tienda</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm outline-none"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Este Año</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2 font-serif">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-xl border ${kpi.tint}`}>
                  <Icon className={`h-5 w-5 ${kpi.accent}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600">{kpi.change}%</span>
                <span className="text-xs text-muted-foreground">vs período anterior</span>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Stats extras */}
      {data && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Productos</p>
            <p className="text-lg font-bold text-foreground">{data.kpis.totalProducts}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Stock Total</p>
            <p className="text-lg font-bold text-foreground">{data.kpis.totalStock}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Flash Sales</p>
            <p className="text-lg font-bold text-foreground">{data.flags.flashSales}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Más Vendidos</p>
            <p className="text-lg font-bold text-foreground">{data.flags.bestSellers}</p>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-1">Ventas Mensuales</h3>
          <p className="text-xs text-muted-foreground mb-4">Ingresos por mes</p>
          {data ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), '']}
                />
                <Bar dataKey="ventas" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">Cargando...</div>
          )}
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-1">Distribución por Categoría</h3>
          <p className="text-xs text-muted-foreground mb-4">Ingresos por categoría</p>
          {data && !emptyCategories ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={data.topCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {data.topCategories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value ?? 0)}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {data.topCategories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {cat.name}
                    </span>
                    <span className="text-sm font-bold text-foreground">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
              <Package className="h-8 w-8 mr-2 opacity-40" />
              No hay datos de categorías con productos
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
