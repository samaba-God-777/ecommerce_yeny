import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Package, Heart, ShoppingBag, User, MapPin, CreditCard,
  Star, Ticket, Bell, MessageSquare, RotateCcw, Wallet, Users,
  Clock, BarChart3, Shield, HelpCircle, Search, Moon, Sun,
  Menu, X, ChevronLeft, MessageCircle, LogOut, Settings
} from 'lucide-react'
import { logo } from '../../data/productImages'
import { useAuth } from '../../context/AuthContext'

const sidebarLinks = [
  { to: '/dashboard', label: 'Inicio', icon: Home },
  { to: '/dashboard/orders', label: 'Mis Pedidos', icon: Package },
  { to: '/dashboard/wishlist', label: 'Favoritos', icon: Heart },
  { to: '/dashboard/cart', label: 'Carrito', icon: ShoppingBag },
  { to: '/dashboard/profile', label: 'Mi Perfil', icon: User },
  { to: '/dashboard/addresses', label: 'Direcciones', icon: MapPin },
  { to: '/dashboard/payments', label: 'Métodos de Pago', icon: CreditCard },
  { to: '/dashboard/loyalty', label: 'Programa de Fidelidad', icon: Star },
  { to: '/dashboard/coupons', label: 'Cupones', icon: Ticket },
  { to: '/dashboard/notifications', label: 'Notificaciones', icon: Bell },
  { to: '/dashboard/reviews', label: 'Mis Reseñas', icon: MessageSquare },
  { to: '/dashboard/messages', label: 'Chat', icon: MessageSquare },
  { to: '/dashboard/returns', label: 'Devoluciones', icon: RotateCcw },
  { to: '/dashboard/wallet', label: 'Mi Billetera', icon: Wallet },
  { to: '/dashboard/referrals', label: 'Referidos', icon: Users },
  { to: '/dashboard/recently-viewed', label: 'Vistos Reciente', icon: Clock },
  { to: '/dashboard/analytics', label: 'Estadísticas', icon: BarChart3 },
  { to: '/dashboard/security', label: 'Seguridad', icon: Shield },
  { to: '/dashboard/support', label: 'Centro de Ayuda', icon: HelpCircle },
]

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <Link to="/" className={`flex items-center ${collapsed && !isMobile ? 'justify-center px-2' : 'gap-3 px-6'} py-5 hover:bg-pink-50 transition-colors`}>
        <img src={logo} alt="Yenyleths Boutique" className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
        {(!collapsed || isMobile) && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-xl font-bold tracking-wide text-gray-900"
          >
            Yenyleths Boutique
          </motion.span>
        )}
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-none">
        {sidebarLinks.map((link) => {
          const isExact = link.to === '/dashboard'
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={isExact}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  collapsed && !isMobile ? 'justify-center px-2' : ''
                } ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`
              }
            >
              <link.icon size={20} className="flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {link.label}
                </motion.span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className={`border-t border-pink-100 p-3 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500 ${
            collapsed && !isMobile ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-10 hidden flex-shrink-0 border-r border-pink-100 bg-white/70 backdrop-blur-xl lg:block"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-pink-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-pink-50 hover:text-pink-600"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-30 w-72 border-r border-pink-100 bg-white/90 backdrop-blur-xl lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1 text-gray-500 hover:bg-pink-50 hover:text-pink-600"
              >
                <X size={20} />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="relative z-[100] flex items-center justify-between border-b border-pink-100 bg-white/60 px-4 py-3 backdrop-blur-md lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-pink-50 hover:text-pink-600 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en el panel..."
                className="w-64 rounded-xl border border-pink-100 bg-pink-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 lg:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-pink-50 hover:text-pink-600"
              aria-label="Cambiar tema"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-pink-50 hover:text-pink-600">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              onClick={() => window.location.href = 'http://localhost:5175'}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200 transition font-medium text-sm"
              aria-label="Ir a Tienda"
            >
              <ShoppingBag size={18} />
              <span className="hidden md:inline">Ir a Tienda</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setProfileOpen(!profileOpen)
              }}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-pink-50 cursor-pointer active:bg-pink-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'W'}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 md:block">{user?.username || 'Willy'}</span>
            </button>

            {profileOpen ? (
              <>
                <div
                  className="fixed inset-0 z-[99998]"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="fixed right-4 top-16 z-[99999] w-56 rounded-xl bg-white border-2 border-pink-400 shadow-2xl overflow-hidden">
                  <div className="border-b border-pink-100 px-4 py-3 bg-pink-50">
                    <p className="text-sm font-semibold text-gray-900">{user?.username || 'Willy'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'usuario@yenyleths.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate('/dashboard/profile')
                        setProfileOpen(false)
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 active:bg-pink-100 transition-colors font-medium"
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate('/dashboard/security')
                        setProfileOpen(false)
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 active:bg-pink-100 transition-colors font-medium"
                    >
                      <Settings size={16} />
                      Configuración
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.location.href = 'http://localhost:5175'
                        setProfileOpen(false)
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 active:bg-pink-100 transition-colors font-medium"
                    >
                      <ShoppingBag size={16} />
                      Ver Tienda
                    </button>
                    <div className="border-t border-pink-100 my-2"></div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleLogout()
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        onClick={() => navigate('/dashboard/messages')}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-xl shadow-pink-200 transition-transform hover:scale-110"
        aria-label="Abrir chat"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  )
}
