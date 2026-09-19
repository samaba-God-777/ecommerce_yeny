import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { io } from 'socket.io-client'
import { ShoppingBag } from 'lucide-react'

import Layout from './components/Layout'
import Header from './components/Header'
import CommandPalette from './features/shared/components/CommandPalette'
import CategoryForm from './components/CategoryForm'
import CategoryTable from './components/CategoryTable'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'
import FlashSalePage from './components/FlashSalePage'
import BestSellersPage from './components/BestSellersPage'
import TrendingPage from './components/TrendingPage'
import SettingsPage from './components/Settings'
import AdminChat from './components/AdminChat'
import OrdersPage from './components/OrdersPage'
import CustomersPage from './components/CustomersPage'
import MarketingPage from './components/MarketingPage'
import PaymentsConfig from './components/PaymentsConfig'
import ReportsPage from './components/ReportsPage'
import Dashboard from './features/dashboard/components/DashboardHome'
import api from './lib/api'
import { STORE_URL, API_ORIGIN } from './lib/urls'

interface Category { id: string; name: string; slug: string; image: string | null }
interface Product {
  id: string; name: string; categoryId: string; brand: string; price: number
  image: string; description: string; stock: number; rating: number
  isFlashSale?: boolean; flashSalePrice?: number | null; flashSaleEnd?: string | null
  isBestSeller?: boolean; isTrending?: boolean
}

const SOCKET_URL = API_ORIGIN

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setCmdOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Real-time notifications via Socket.io
  useEffect(() => {
    if (!isAuthenticated) return
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })

    socket.on('new-order', (data) => {
      toast.success(`🛵 Nuevo pedido: ${data.id} - $${data.total}`, { duration: 5000 })
    })

    socket.on('low-stock', (data) => {
      toast.error(`⚠️ Stock bajo: ${data.productName} (${data.stock} restantes)`, { duration: 8000 })
    })

    // Con cuerpo de bloque: disconnect() devuelve el socket y React espera
    // que la limpieza no devuelva nada.
    return () => { socket.disconnect() }
  }, [isAuthenticated])

  // Auth check using JWT
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      const cookieToken = document.cookie.split('; ').find(r => r.startsWith('adminToken='))
      if (cookieToken) {
        const val = cookieToken.split('=')[1]
        if (val) localStorage.setItem('adminToken', val)
      }
    }

    const checkAuth = async () => {
      const t = localStorage.getItem('adminToken')
      if (!t) return

      try {
        const { data } = await api.get('/auth/me')
        if (data.success) {
          setIsAuthenticated(true)
          setUsername(data.user.username)
        }
      } catch {
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) { fetchCategories(); fetchProducts() }
  }, [isAuthenticated])

  const fetchCategories = async () => {
    try { const { data } = await api.get('/categories'); setCategories(data) }
    catch (err) { console.error('Error:', err) }
  }

  const fetchProducts = async () => {
    try { const { data } = await api.get('/products'); setProducts(data) }
    catch (err) { console.error('Error:', err) }
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { username, password })
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        document.cookie = `adminToken=${data.token}; path=/; max-age=604800`
        setIsAuthenticated(true)
        setUsername(data.user.username)
        fetchCategories(); fetchProducts()
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión'
      throw new Error(msg)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('adminToken')
    document.cookie = 'adminToken=; path=/; max-age=0'
    setIsAuthenticated(false)
    setUsername('')
    setTab('dashboard')
  }

  const addCategory = async (data: { name: string; slug: string }) => {
    try {
      await api.post('/categories', { ...data, image: null })
      fetchCategories()
    } catch (err) { console.error('Error:', err) }
  }

  const deleteCategory = async (id: string) => {
    try { await api.delete(`/categories/${id}`); fetchCategories() }
    catch (err) { console.error('Error:', err) }
  }

  const addProduct = async (data: any) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val))
      })
      await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      fetchProducts()
    } catch (err) { console.error('Error:', err) }
  }

  const updateProduct = async (id: string, data: any) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val))
      })
      await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      fetchProducts()
    } catch (err) { console.error('Error:', err) }
  }

  const deleteProduct = async (id: string) => {
    try { await api.delete(`/products/${id}`); fetchProducts() }
    catch (err) { console.error('Error:', err) }
  }

  const toggleFlashSale = async (id: string, value: boolean) => {
    try { await api.patch(`/products/${id}`, { isFlashSale: value }); fetchProducts() }
    catch (err) { console.error('Error:', err) }
  }
  const toggleBestSeller = async (id: string, value: boolean) => {
    try { await api.patch(`/products/${id}`, { isBestSeller: value }); fetchProducts() }
    catch (err) { console.error('Error:', err) }
  }
  const toggleTrending = async (id: string, value: boolean) => {
    try { await api.patch(`/products/${id}`, { isTrending: value }); fetchProducts() }
    catch (err) { console.error('Error:', err) }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-paper p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.5]" aria-hidden>
          <div className="absolute inset-y-0 left-6 sm:left-10 w-px bg-line" />
          <div className="absolute inset-y-0 left-10 sm:left-16 w-px bg-line/60" />
          <div className="absolute inset-y-0 right-6 sm:right-10 w-px bg-line" />
          <div className="absolute inset-x-0 top-0 h-px bg-line" />
        </div>
        <div className="relative w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-ink rounded-lg shadow-md mb-4">
            <ShoppingBag className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink mb-1">Yenyleths</h1>
          <p className="text-market font-mono text-xs tracking-[0.2em] uppercase mb-8">Panel de Administración</p>
          <div className="bg-card border border-line rounded-xl shadow-lg p-6 text-left space-y-4">
            <input id="login-user" placeholder="Usuario" className="w-full px-4 py-2.5 border border-line bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" autoComplete="username" />
            <input id="login-pass" type="password" placeholder="Contraseña" className="w-full px-4 py-2.5 border border-line bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" autoComplete="current-password" />
            <button onClick={async () => {
              const u = (document.getElementById('login-user') as HTMLInputElement).value
              const p = (document.getElementById('login-pass') as HTMLInputElement).value
              try { await handleLogin(u, p) } catch (e) { alert(e instanceof Error ? e.message : 'No se pudo iniciar sesión') }
            }} className="w-full px-6 py-3 bg-ink text-primary-foreground rounded-lg font-semibold hover:bg-market transition">Iniciar Sesión</button>
            <a href={`${STORE_URL}/`} className="block text-center text-sm text-market hover:text-market-deep font-medium">Ir a la Tienda</a>
          </div>
        </div>
      </div>
    )
  }

  const getHeaderTitle = () => {
    switch (tab) {
      case 'dashboard': return { title: 'Dashboard', subtitle: 'Resumen de tu tienda Yenyleths Boutique' }
      case 'categories': return { title: 'Categorías', subtitle: 'Gestiona las categorías de tu tienda' }
      case 'products': return { title: 'Productos', subtitle: 'Gestiona el catálogo de tu tienda' }
      case 'flash-sale': return { title: 'Venta Flash', subtitle: 'Gestiona las ofertas relámpago' }
      case 'best-sellers': return { title: 'Más Vendidos', subtitle: 'Los productos estrella de tu tienda' }
      case 'trending': return { title: 'Tendencia', subtitle: 'Los productos que están en tendencia' }
      case 'chat': return { title: 'Chat en Vivo', subtitle: 'Responde a tus clientes en tiempo real' }
      case 'orders': return { title: 'Pedidos', subtitle: 'Gestiona los pedidos de tu tienda' }
      case 'customers': return { title: 'Clientes', subtitle: 'Administra la base de clientes' }
      case 'marketing': return { title: 'Marketing', subtitle: 'Campañas, cupones y promociones' }
      case 'reports': return { title: 'Reportes', subtitle: 'Análisis y métricas de tu tienda' }
      case 'settings': return { title: 'Configuración', subtitle: 'Administra la configuración de tu tienda' }
      default: return { title: 'Dashboard', subtitle: '' }
    }
  }

  const headerInfo = getHeaderTitle()

  return (
    <Layout
      activeTab={tab}
      onTabChange={setTab}
      onLogout={handleLogout}
      username={username}
    >
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        }
      }} />
      <Header title={headerInfo.title} subtitle={headerInfo.subtitle} onLogout={handleLogout} onTabChange={setTab} />

      {tab === 'chat' ? (
        <AdminChat />
      ) : (
        <main className="min-h-[calc(100vh-4rem)]">
          {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}

          {tab === 'categories' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <CategoryForm onSubmit={addCategory} />
                </div>
                <div className="lg:col-span-2">
                  <CategoryTable categories={categories} onDelete={deleteCategory} />
                </div>
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                  <ProductForm categories={categories} onSubmit={addProduct} />
                </div>
                <div className="xl:col-span-2">
                  <ProductTable
                    products={products}
                    categories={categories}
                    onDelete={deleteProduct}
                    onToggleFlashSale={toggleFlashSale}
                    onToggleBestSeller={toggleBestSeller}
                    onToggleTrending={toggleTrending}
                    onUpdate={updateProduct}
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'flash-sale' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <FlashSalePage products={products} categories={categories} onToggleFlashSale={toggleFlashSale} />
            </div>
          )}

          {tab === 'best-sellers' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <BestSellersPage products={products} categories={categories} onToggleBestSeller={toggleBestSeller} />
            </div>
          )}

          {tab === 'trending' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <TrendingPage products={products} categories={categories} onToggleTrending={toggleTrending} />
            </div>
          )}

          {tab === 'orders' && <OrdersPage />}

          {tab === 'customers' && <CustomersPage />}

          {tab === 'marketing' && <MarketingPage />}

          {tab === 'reports' && <ReportsPage />}

          {tab === 'pagos' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <PaymentsConfig />
            </div>
          )}

          {tab === 'settings' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <SettingsPage username={username} />
            </div>
          )}
        </main>
      )}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={setTab} />
    </Layout>
  )
}
