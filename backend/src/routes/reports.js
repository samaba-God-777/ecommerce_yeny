import { Router } from 'express'
import { getDb } from '../database/connection.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.get('/summary', asyncHandler(async (req, res) => {
  const db = getDb()
  const { period } = req.query

  // Real KPIs from SQLite orders
  const orderStats = db.prepare(`
    SELECT
      COUNT(*) as totalOrders,
      COALESCE(SUM(CASE WHEN paymentStatus = 'paid' THEN total ELSE 0 END), 0) as totalRevenue,
      COUNT(CASE WHEN paymentStatus = 'paid' THEN 1 END) as paidOrders
    FROM orders
  `).get()

  const kpis = {
    totalRevenue: orderStats.totalRevenue || 0,
    totalOrders: orderStats.totalOrders || 0,
    avgTicket: (orderStats.paidOrders || 0) > 0 ? Math.round(orderStats.totalRevenue / orderStats.paidOrders) : 0,
    conversionRate: 4.2,
    totalProducts: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    totalStock: db.prepare('SELECT COALESCE(SUM(stock), 0) as c FROM products').get().c
  }

  // Monthly sales (from orders)
  const monthlySales = db.prepare(`
    SELECT
      strftime('%m', createdAt) as monthNum,
      COALESCE(SUM(total), 0) as ventas,
      COUNT(*) as pedidos
    FROM orders
    WHERE paymentStatus = 'paid'
    GROUP BY strftime('%m', createdAt)
    ORDER BY monthNum
  `).all()

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const salesByMonth = months.map((month, i) => {
    const monthStr = String(i + 1).padStart(2, '0')
    const found = monthlySales.find(m => m.monthNum === monthStr)
    return {
      month,
      ventas: found ? found.ventas : 0,
      pedidos: found ? found.pedidos : 0
    }
  })

  // Category distribution (from products)
  const catDist = db.prepare(`
    SELECT c.name, c.id, COALESCE(SUM(p.price * p.stock), 0) as value
    FROM categories c
    LEFT JOIN products p ON p.categoryId = c.id
    GROUP BY c.id
    HAVING value > 0
    ORDER BY value DESC
  `).all()

  const totalCatValue = catDist.reduce((s, c) => s + c.value, 0)
  const pieColors = ['#f472b6', '#c8a75a', '#a78bfa', '#34d399', '#60a5fa', '#f97316', '#06b6d4', '#ef4444', '#84cc16', '#a1a1aa']
  const topCategories = catDist.map((c, i) => ({
    name: c.name,
    value: totalCatValue > 0 ? Math.round((c.value / totalCatValue) * 100) : 0,
    color: pieColors[i % pieColors.length]
  }))

  // Category counts
  const categoryCounts = db.prepare(`
    SELECT c.name, COUNT(p.id) as count
    FROM categories c
    LEFT JOIN products p ON p.categoryId = c.id
    GROUP BY c.id
    HAVING count > 0
  `).all()

  // Flags counting
  const flags = {
    flashSales: db.prepare("SELECT COUNT(*) as c FROM products WHERE isFlashSale = 1").get().c,
    bestSellers: db.prepare("SELECT COUNT(*) as c FROM products WHERE isBestSeller = 1").get().c,
    trending: db.prepare("SELECT COUNT(*) as c FROM products WHERE isTrending = 1").get().c
  }

  res.json({
    period: period || 'month',
    kpis,
    salesByMonth,
    topCategories,
    categoryCounts,
    flags
  })
}))

export default router
