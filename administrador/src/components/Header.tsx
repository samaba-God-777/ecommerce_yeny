import { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Store,
  Moon,
  Sun,
  Command,
  X,
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { useTheme } from '../lib/theme'
import { toast } from 'react-hot-toast'

interface HeaderProps {
  title: string
  subtitle?: string
  onLogout?: () => void
  onTabChange?: (tab: string) => void
}

const searchSuggestions = [
  { icon: Package, label: 'Productos', action: 'products' },
  { icon: ShoppingCart, label: 'Pedidos', action: 'orders' },
  { icon: Users, label: 'Clientes', action: 'customers' },
  { icon: MessageSquare, label: 'Chat', action: 'chat' },
  { icon: Settings, label: 'Configuración', action: 'settings' },
]

export default function Header({ title, subtitle, onLogout, onTabChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const { isDark, toggle: toggleTheme } = useTheme()

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nuevo pedido #1234 de Willy', time: 'Hace 2 min', read: false, icon: ShoppingCart, action: 'orders' },
    { id: 2, text: 'Producto "Vestido Rosa" sin stock', time: 'Hace 15 min', read: false, icon: Package, action: 'products' },
    { id: 3, text: 'Mensaje de cliente en chat', time: 'Hace 1 hora', read: true, icon: MessageSquare, action: 'chat' },
    { id: 4, text: 'Nuevo cliente registrado', time: 'Hace 2 horas', read: true, icon: Users, action: 'customers' },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('Todas las notificaciones marcadas como leídas')
  }

  const handleNotificationClick = (id: number, action?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setNotifOpen(false)
    if (action) {
      onTabChange?.(action)
      toast.success(`Redirigiendo a la sección de ${action === 'orders' ? 'Pedidos' : action === 'products' ? 'Productos' : action === 'chat' ? 'Chat' : 'Clientes'}`)
    }
  }

  const handleDeleteNotification = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notificación eliminada')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchFocused(true)
      }
      if (e.key === 'Escape') {
        setSearchFocused(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-line">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Title */}
        <div className="min-w-0 pl-12 lg:pl-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <button
              onClick={() => setSearchFocused(true)}
              className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-line rounded-lg text-sm text-muted-foreground hover:bg-muted transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Buscar...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background border border-line rounded text-[10px] font-mono">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            {searchFocused && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-line rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar módulos, acciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button onClick={() => { setSearchFocused(false); setSearchQuery('') }}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.action}
                        onClick={() => { onTabChange?.(item.action); setSearchFocused(false); setSearchQuery('') }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </button>
                    )
                  })}
                  {filteredSuggestions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Sin resultados</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-market text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-line rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                  <h3 className="text-sm font-bold text-foreground">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-market hover:text-market-deep font-medium cursor-pointer"
                    >
                      Marcar todo leído
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No tienes notificaciones
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const Icon = notif.icon
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id, notif.action)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group relative ${!notif.read ? 'bg-market/10' : ''}`}
                        >
                          <div className={`p-2 rounded-lg flex-shrink-0 ${!notif.read ? 'bg-market/10' : 'bg-muted'}`}>
                            <Icon className={`h-4 w-4 ${!notif.read ? 'text-market' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{notif.text}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">{notif.time}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!notif.read && <div className="w-2 h-2 bg-market rounded-full mt-2" />}
                            <button
                              onClick={(e) => handleDeleteNotification(e, notif.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-all absolute right-3 top-3"
                              title="Eliminar notificación"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-muted transition-colors hidden sm:flex"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-line hover:bg-muted rounded-lg py-1.5 pr-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-market flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-xs">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-foreground leading-tight">Admin</p>
                <p className="text-[10px] text-muted-foreground">Yenyleths</p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform hidden md:block ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen ? (
              <>
                <div className="fixed inset-0 z-[9999]" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-line rounded-xl shadow-2xl py-2 overflow-hidden z-[10001]">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-bold text-foreground">Admin</p>
                    <p className="text-xs text-muted-foreground">admin@yenyleths.com</p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTabChange?.('settings'); setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings size={16} className="text-muted-foreground" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTabChange?.('settings'); setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings size={16} className="text-muted-foreground" />
                    Configuración
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'http://localhost:5175'; setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Store size={16} className="text-muted-foreground" />
                    Ver Tienda
                  </button>
                  <div className="border-t border-line my-1" />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLogout?.(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}