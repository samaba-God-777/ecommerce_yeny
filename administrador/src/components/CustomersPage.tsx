import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Star,
  Ban,
  UserPlus,
} from 'lucide-react'

const mockCustomers = [
  { id: '1', name: 'Willy', email: 'degraciawilliams10@gmail.com', phone: '+1 809-555-0101', orders: 12, spent: 34500, joined: '2026-01-15', lastPurchase: '2026-06-30', vip: true, status: 'active', address: 'Santo Domingo, DR' },
  { id: '2', name: 'María García', email: 'maria@email.com', phone: '+1 809-555-0102', orders: 8, spent: 22400, joined: '2026-02-20', lastPurchase: '2026-06-29', vip: true, status: 'active', address: 'Santiago, DR' },
  { id: '3', name: 'Ana López', email: 'ana@email.com', phone: '+1 809-555-0103', orders: 5, spent: 12800, joined: '2026-03-10', lastPurchase: '2026-06-28', vip: false, status: 'active', address: 'La Romana, DR' },
  { id: '4', name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '+1 809-555-0104', orders: 15, spent: 45200, joined: '2025-11-05', lastPurchase: '2026-06-27', vip: true, status: 'active', address: 'Puerto Plata, DR' },
  { id: '5', name: 'Laura Martínez', email: 'laura@email.com', phone: '+1 809-555-0105', orders: 3, spent: 8900, joined: '2026-04-18', lastPurchase: '2026-06-25', vip: false, status: 'active', address: 'Punta Cana, DR' },
  { id: '6', name: 'Pedro Sánchez', email: 'pedro@email.com', phone: '+1 809-555-0106', orders: 1, spent: 2100, joined: '2026-06-01', lastPurchase: '2026-06-28', vip: false, status: 'inactive', address: 'San Cristóbal, DR' },
  { id: '7', name: 'Sofia Hernández', email: 'sofia@email.com', phone: '+1 809-555-0107', orders: 7, spent: 19500, joined: '2026-01-25', lastPurchase: '2026-06-28', vip: false, status: 'active', address: 'La Vega, DR' },
  { id: '8', name: 'Diego Torres', email: 'diego@email.com', phone: '+1 809-555-0108', orders: 2, spent: 5400, joined: '2026-05-10', lastPurchase: '2026-06-20', vip: false, status: 'active', address: 'San Pedro de Macorís, DR' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const filtered = mockCustomers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'vip' && c.vip) || (filter === 'active' && c.status === 'active') || (filter === 'inactive' && c.status === 'inactive')
    return matchSearch && matchFilter
  })

  const customer = mockCustomers.find(c => c.id === selectedCustomer)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Stats */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Clientes', value: mockCustomers.length },
          { label: 'Clientes VIP', value: mockCustomers.filter(c => c.vip).length },
          { label: 'Activos', value: mockCustomers.filter(c => c.status === 'active').length },
          { label: 'Inactivos', value: mockCustomers.filter(c => c.status === 'inactive').length },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
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
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm outline-none"
          >
            <option value="all">Todos</option>
            <option value="vip">VIP</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`bg-card border border-border rounded-2xl overflow-hidden ${selectedCustomer ? 'flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Cliente</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Pedidos</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Total Gastado</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Nivel</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Estado</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Última Compra</th>
                  <th className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${selectedCustomer === c.id ? 'bg-market/5' : ''}`} onClick={() => setSelectedCustomer(c.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-market to-market-deep flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">{c.orders}</td>
                    <td className="px-5 py-4 text-sm font-bold text-foreground">${c.spent.toLocaleString('es-DO')}</td>
                    <td className="px-5 py-4">
                      {c.vip ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          <Star className="h-3 w-3" /> VIP
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Regular</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {c.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{new Date(c.lastPurchase).toLocaleDateString('es-DO')}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Ver">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Email">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Bloquear">
                          <Ban className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Customer Detail Panel */}
        {customer && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-card border border-border rounded-2xl p-5 h-fit sticky top-20 hidden lg:block"
          >
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-market to-market-deep flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {customer.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-foreground">{customer.name}</h3>
              <p className="text-xs text-muted-foreground">{customer.email}</p>
              {customer.vip && (
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <Star className="h-3 w-3" /> Cliente VIP
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{customer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{customer.orders} pedidos</span>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total gastado</span>
                <span className="font-bold text-foreground">${customer.spent.toLocaleString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Miembro desde</span>
                <span className="text-foreground">{new Date(customer.joined).toLocaleDateString('es-DO')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última compra</span>
                <span className="text-foreground">{new Date(customer.lastPurchase).toLocaleDateString('es-DO')}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors">
                <Mail className="h-4 w-4" /> Email
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                <Phone className="h-4 w-4" /> Llamar
              </button>
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full mt-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Cerrar panel
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
