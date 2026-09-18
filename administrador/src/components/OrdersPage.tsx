import { useState, useEffect } from 'react'
import api from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Download, Eye, Truck, CheckCircle2, XCircle, Clock,
  ArrowUpDown, LayoutGrid, List, MessageSquare, Printer, MapPin,
  X, DollarSign, FileText, Package
} from 'lucide-react'


const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  processing: { label: 'Procesando', color: 'text-market-deep dark:text-market-bright', bg: 'bg-market/10', icon: ArrowUpDown },
  shipped: { label: 'Enviado', color: 'text-ink-soft dark:text-line-strong', bg: 'bg-muted dark:bg-muted', icon: Truck },
  delivered: { label: 'Entregado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

interface OrderItem {
  name: string
  price: number
  quantity: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders')
      // Transform API data to match existing UI shape
      const mapped = Array.isArray(data) ? data.map(o => ({
        id: o.id,
        customer: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone || '+507 6000-0000',
        total: o.total,
        items: o.items?.length || 0,
        productsList: o.items || [],
        status: o.orderStatus,
        payment: o.paymentStatus === 'paid' ? 'pagado' : o.paymentStatus === 'refunded' ? 'reembolsado' : 'pendiente',
        date: o.createdAt,
        address: o.address || 'Dirección no especificada',
        receipt: o.paymentMethod === 'yappy' ? '/yappy_receipt_proof.png' : null
      })) : []
      setOrders(mapped)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus })
      fetchOrders()
    } catch (err) { console.error('Error updating status:', err) }
  }

  const updateOrderPayment = async (id: string, newPayment: string) => {
    const paymentMap: Record<string, string> = { 'pagado': 'paid', 'reembolsado': 'refunded', 'pendiente': 'pending' }
    try {
      await api.patch(`/orders/${id}/payment`, { paymentStatus: paymentMap[newPayment] || newPayment })
      fetchOrders()
    } catch (err) { console.error('Error updating payment:', err) }
  }

  const filtered = orders.filter(order => {
    const matchSearch = (order.customer || '').toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || order.status === statusFilter
    return matchSearch && matchStatus
  })

  const kanbanColumns = ['pending', 'processing', 'shipped', 'delivered']
  const selectedOrder = orders.find(o => o.id === selectedOrderId)

  // Action helpers
  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Factura ${order.id}</title>
          <style>
            body { font-family: 'Archivo', system-ui, sans-serif; padding: 40px; color: #1e1c18; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #b23a2f; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: 800; color: #1e1c18; }
            .details { margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #e2e8f0; padding: 14px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; color: #1e293b; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Yenyleths Store</div>
              <p style="margin: 4px 0;">Boutique de Moda Premium, Belleza & Estilo de Vida</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #1e293b;">FACTURA</h2>
              <p style="margin: 4px 0;"><strong>Pedido:</strong> ${order.id}</p>
              <p style="margin: 4px 0;"><strong>Fecha:</strong> ${new Date(order.date).toLocaleDateString('es-PA')} ${new Date(order.date).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; color: #475569;">Cliente</h3>
              <p style="margin: 4px 0;"><strong>Nombre:</strong> ${order.customer}</p>
              <p style="margin: 4px 0;"><strong>Email:</strong> ${order.email}</p>
              <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${order.phone || 'N/A'}</p>
            </div>
            <div>
              <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; color: #475569;">Destinatario / Envío</h3>
              <p style="margin: 4px 0;"><strong>Dirección:</strong> ${order.address}</p>
              <p style="margin: 4px 0;"><strong>Método de pago:</strong> ${order.payment === 'pagado' ? 'Pagado (Transferencia/Yappy)' : order.payment}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Producto / Artículo</th>
                <th style="text-align: right;">Precio Unitario</th>
                <th style="text-align: center;">Cantidad</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(order.productsList || []).map((p: OrderItem) => `
                <tr>
                  <td>${p.name}</td>
                  <td style="text-align: right;">$${p.price.toLocaleString('es-PA', { minimumFractionDigits: 2 })}</td>
                  <td style="text-align: center;">${p.quantity}</td>
                  <td style="text-align: right;">$${(p.price * p.quantity).toLocaleString('es-PA', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total del Pedido: $${order.total.toLocaleString('es-PA', { minimumFractionDigits: 2 })}
          </div>
          <div class="footer">
            ¡Muchas gracias por su compra! Si tiene alguna pregunta sobre esta factura, contáctenos a soporte@yenyleths.com
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(() => { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const handleWhatsApp = (order: any) => {
    const phone = order.phone.replace(/[^0-9]/g, '')
    const cleanPhone = phone.startsWith('507') ? phone : `507${phone}`
    const statusLabel = statusConfig[order.status]?.label || order.status
    const message = `¡Hola ${order.customer}! Te saludamos de Yenyleths Store 🌸\n\nTe informamos que tu pedido *${order.id}* (total: $${order.total.toLocaleString('es-PA')}) se encuentra ahora en estado: *${statusLabel}*.\n\nCualquier consulta estamos a la orden. ¡Gracias por tu compra!`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleMapPin = (order: any) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`, '_blank')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Stats bar */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', count: orders.length, color: 'text-foreground' },
          { label: 'Pendientes', count: orders.filter(o => o.status === 'pending').length, color: 'text-amber-500' },
          { label: 'Procesando', count: orders.filter(o => o.status === 'processing').length, color: 'text-market-deep' },
          { label: 'Enviados', count: orders.filter(o => o.status === 'shipped').length, color: 'text-ink-soft' },
          { label: 'Entregados', count: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-500' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3.5 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`p-2.5 rounded-xl border transition-all ${view === 'list' ? 'bg-market text-white border-market' : 'bg-card border-border hover:bg-muted'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-2.5 rounded-xl border transition-all ${view === 'kanban' ? 'bg-market text-white border-market' : 'bg-card border-border hover:bg-muted'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse space-y-4 text-center">
            <div className="h-8 w-48 bg-muted rounded mx-auto" />
            <div className="h-4 w-64 bg-muted rounded mx-auto" />
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No hay pedidos aún</p>
          <p className="text-xs mt-1">Los pedidos realizados desde la tienda aparecerán aquí</p>
        </div>
      ) : (
      <>
      {/* List View */}
      {view === 'list' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Pedido</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Cliente</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Artículos</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Total</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Estado</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Pago</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Fecha</th>
                  <th className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const status = statusConfig[order.status]
                  const StatusIcon = status.icon
                  return (
                    <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-foreground">{order.id}</td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{order.items} artículos</td>
                      <td className="px-5 py-4 text-sm font-bold text-foreground">${order.total.toLocaleString('es-PA')}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.bg} ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          order.payment === 'pagado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          order.payment === 'reembolsado' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('es-PA')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setSelectedOrderId(order.id)} 
                            className="p-2 rounded-lg hover:bg-market/10 hover:text-market dark:hover:bg-market/20 dark:hover:text-market-bright transition-colors" 
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handlePrint(order)} 
                            className="p-2 rounded-lg hover:bg-market/10 hover:text-market dark:hover:bg-market/20 dark:hover:text-market-bright transition-colors" 
                            title="Imprimir Factura"
                          >
                            <Printer className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handleWhatsApp(order)} 
                            className="p-2 rounded-lg hover:bg-market/10 hover:text-market dark:hover:bg-market/20 dark:hover:text-market-bright transition-colors" 
                            title="Notificar por WhatsApp"
                          >
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handleMapPin(order)} 
                            className="p-2 rounded-lg hover:bg-market/10 hover:text-market dark:hover:bg-market/20 dark:hover:text-market-bright transition-colors" 
                            title="Rastrear Dirección"
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const config = statusConfig[col]
            const colOrders = filtered.filter(o => o.status === col)
            const StatusIcon = config.icon
            return (
              <div key={col} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  <h3 className="text-sm font-bold text-foreground">{config.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{colOrders.length}</span>
                </div>
                {colOrders.map(order => (
                  <motion.div
                    key={order.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    onClick={() => setSelectedOrderId(order.id)}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-market dark:hover:border-market group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-foreground group-hover:text-market transition-colors">{order.id}</span>
                      <span className="text-xs text-muted-foreground">{order.items} items</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{order.customer}</p>
                    <p className="text-lg font-bold text-foreground">${order.total.toLocaleString('es-PA')}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('es-PA')}
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-1.5 rounded-lg hover:bg-market/10 hover:text-market transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-market" />
                        </button>
                        <button 
                          onClick={() => handleWhatsApp(order)}
                          className="p-1.5 rounded-lg hover:bg-market/10 hover:text-market dark:hover:bg-market/20 transition-colors"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {colOrders.length === 0 && (
                  <div className="bg-card/50 border border-dashed border-border rounded-xl p-8 text-center">
                    <p className="text-xs text-muted-foreground">Sin pedidos</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      </>
      )}

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                    Detalle del Pedido <span className="text-market">{selectedOrder.id}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Realizado el {new Date(selectedOrder.date).toLocaleDateString('es-PA')} a las {new Date(selectedOrder.date).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
                
                {/* Column 1 & 2: Info & Products */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer details card */}
                  <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5">Información del Cliente</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Nombre</p>
                        <p className="font-semibold text-foreground">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                        <p className="font-semibold text-foreground">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Teléfono de Contacto</p>
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          {selectedOrder.phone}
                          <button 
                            onClick={() => handleWhatsApp(selectedOrder)}
                            className="text-market hover:text-market-deep p-0.5 rounded hover:bg-market/10 transition-all"
                            title="Enviar WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dirección de Envío</p>
                        <p className="font-semibold text-foreground flex items-center gap-1">
                          {selectedOrder.address}
                          <button 
                            onClick={() => handleMapPin(selectedOrder)}
                            className="text-market hover:text-market-deep p-0.5 rounded hover:bg-market/10 transition-all"
                            title="Ver en Google Maps"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products table */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-market" /> Artículos Comprados
                    </h3>
                    <div className="border border-border rounded-xl overflow-hidden bg-card">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="text-left p-3 font-semibold text-muted-foreground">Artículo</th>
                            <th className="text-right p-3 font-semibold text-muted-foreground">Precio</th>
                            <th className="text-center p-3 font-semibold text-muted-foreground">Cant.</th>
                            <th className="text-right p-3 font-semibold text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedOrder.productsList || []).map((p: OrderItem, idx: number) => (
                            <tr key={idx} className="border-b border-border/50 last:border-0">
                              <td className="p-3 font-medium text-foreground">{p.name}</td>
                              <td className="p-3 text-right text-foreground">${p.price.toLocaleString('es-PA')}</td>
                              <td className="p-3 text-center text-foreground font-semibold">{p.quantity}</td>
                              <td className="p-3 text-right font-bold text-foreground">${(p.price * p.quantity).toLocaleString('es-PA')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end p-2">
                      <p className="text-base font-bold text-foreground">
                        Total Pedido: <span className="text-market text-lg ml-2">${selectedOrder.total.toLocaleString('es-PA')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Status Updates & Proof of Payment Image */}
                <div className="space-y-6">
                  {/* Status controls */}
                  <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-4">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5">Gestión de Pedido</h3>
                    
                    {/* Order Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-semibold">Estado del Envío</label>
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-market"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-semibold">Estado del Pago</label>
                      <select 
                        value={selectedOrder.payment}
                        onChange={(e) => updateOrderPayment(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-market"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="reembolsado">Reembolsado</option>
                      </select>
                    </div>
                  </div>

                  {/* Proof of payment image! */}
                  <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 flex items-center justify-between">
                      <span>Comprobante de Pago</span>
                      {selectedOrder.receipt && (
                        <span className="text-[10px] bg-market/10 text-market dark:text-market font-bold px-1.5 py-0.5 rounded">
                          Yappy
                        </span>
                      )}
                    </h3>
                    {selectedOrder.receipt ? (
                      <div className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-border bg-card">
                        <img 
                          src={selectedOrder.receipt} 
                          alt="Comprobante Yappy" 
                          onClick={() => setZoomImage(selectedOrder.receipt)}
                          className="w-full h-40 object-cover hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 pointer-events-none">
                          <p className="text-white text-xs font-semibold flex items-center gap-1">
                            <Eye className="h-4 w-4" /> Ampliar Comprobante
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                        <DollarSign className="h-6 w-6 mb-1 text-muted-foreground/60" />
                        <p className="text-xs">No se ha subido comprobante digital para este pedido</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Actions Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap gap-2 justify-between">
                <button
                  onClick={() => handlePrint(selectedOrder)}
                  className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-xl transition-all"
                >
                  <Printer className="h-4 w-4" /> Imprimir Factura
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleWhatsApp(selectedOrder)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-market hover:bg-market-deep text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4" /> Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="px-5 py-2 bg-ink hover:bg-market text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    Cerrar Detalles
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Lightbox zoom */}
      <AnimatePresence>
        {zoomImage && (
          <div 
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <div className="relative max-w-full max-h-full">
              <button 
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all z-10"
              >
                <X className="h-6 w-6" />
              </button>
              <img 
                src={zoomImage} 
                alt="Zoom Comprobante" 
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10" 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
