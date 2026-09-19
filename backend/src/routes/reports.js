import { Router } from 'express'
import { getDb } from '../database/firestore.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.get('/summary', asyncHandler(async (req, res) => {
  const db = getDb()
  const { period } = req.query

  // Tope de lectura: los reportes recorren las colecciones enteras y en
  // Firestore cada documento leido se cobra.
  const TOPE = 5000
  const [ordersSnap, productsSnap, categoriesSnap] = await Promise.all([
    db.collection('orders').limit(TOPE).get(),
    db.collection('products').limit(TOPE).get(),
    db.collection('categories').limit(TOPE).get()
  ])
  const aObjetos = (snap) => snap.docs.map(d => ({ id: d.id, ...d.data() }))
  const orders = aObjetos(ordersSnap)
  const products = aObjetos(productsSnap)
  const categories = aObjetos(categoriesSnap)

  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  const kpis = {
    totalRevenue,
    totalOrders: orders.length,
    avgTicket: paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0,
    conversionRate: 4.2,
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0)
  }

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const salesByMonth = months.map((month, i) => {
    const monthOrders = paidOrders.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt)
      return d.getMonth() === i
    })
    return {
      month,
      ventas: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      pedidos: monthOrders.length
    }
  })

  const catValueMap = {}
  for (const cat of categories) {
    catValueMap[cat.name] = 0
  }
  for (const p of products) {
    const cat = categories.find(c => c.id === p.categoryId)
    if (cat) catValueMap[cat.name] += (p.price || 0) * (p.stock || 0)
  }

  const totalCatValue = Object.values(catValueMap).reduce((s, v) => s + v, 0)
  const pieColors = ['#f472b6', '#c8a75a', '#a78bfa', '#34d399', '#60a5fa', '#f97316', '#06b6d4', '#ef4444', '#84cc16', '#a1a1aa']
  const topCategories = Object.entries(catValueMap)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], i) => ({
      name,
      value: totalCatValue > 0 ? Math.round((value / totalCatValue) * 100) : 0,
      color: pieColors[i % pieColors.length]
    }))

  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.categoryId === cat.id).length
  })).filter(c => c.count > 0)

  const flags = {
    flashSales: products.filter(p => p.isFlashSale).length,
    bestSellers: products.filter(p => p.isBestSeller).length,
    trending: products.filter(p => p.isTrending).length
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
