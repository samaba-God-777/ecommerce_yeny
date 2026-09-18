"use client"
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FolderOpen,
  Package,
  LogOut,
  Settings,
  ShoppingCart,
  Zap,
  Star,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Users,
  Megaphone,
  Store,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from '../../lib/theme'
import { STORE_URL } from '../../lib/urls'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  username: string
}

interface NavItem {
  id: string
  name: string
  icon: LucideIcon
  badge?: string
  color?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { id: 'categories', name: 'Categorías', icon: FolderOpen },
      { id: 'products', name: 'Productos', icon: Package },
      { id: 'flash-sale', name: 'Venta Flash', icon: Zap, badge: 'Nuevo', color: 'bg-market' },
      { id: 'best-sellers', name: 'Más Vendidos', icon: Star },
      { id: 'trending', name: 'Tendencia', icon: TrendingUp },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
      { id: 'customers', name: 'Clientes', icon: Users },
      { id: 'chat', name: 'Chat en Vivo', icon: MessageCircle, badge: '3', color: 'bg-market' },
    ],
  },
  {
    label: 'Herramientas',
    items: [
      { id: 'marketing', name: 'Marketing', icon: Megaphone },
      { id: 'reports', name: 'Reportes', icon: BarChart3 },
      { id: 'pagos', name: 'Configurar Pagos', icon: CreditCard, badge: 'Nuevo', color: 'bg-market' },
      { id: 'settings', name: 'Configuración', icon: Settings },
    ],
  },
]

export function YenylethsSidebar({ activeTab, onTabChange, onLogout, username }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isDark, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId)
    if (window.innerWidth < 1024) setIsOpen(false)
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-line shadow-lg lg:hidden hover:bg-muted transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out flex flex-col
          bg-sidebar border-r border-line
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-[72px]' : 'w-[272px]'}
          lg:translate-x-0 lg:static lg:z-auto
          shadow-xl lg:shadow-none
        `}
      >
        {/* Wordmark */}
        <div className={`flex items-center border-b border-line px-5 h-16 flex-shrink-0 ${isCollapsed ? 'justify-center px-3' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-extrabold text-sm">Y</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-foreground text-sm leading-tight tracking-tight">Yenyleths</span>
                <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Admin · Registro</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-sm">Y</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-all"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Operator pill */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/60 border border-line/60">
              <div className="w-8 h-8 rounded-full bg-market flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-primary-foreground font-bold text-xs">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{username}</p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Administrador</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!isCollapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`
                        w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative border
                        ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                        ${isActive
                          ? 'bg-market text-primary-foreground border-market shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground border-transparent'
                        }
                      `}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`} />
                      {!isCollapsed && (
                        <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${item.color || 'bg-market'}`}>
                          {item.badge}
                        </span>
                      )}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                          {item.name}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-foreground rotate-45" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-line p-3 space-y-1 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 rounded-lg transition-all text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
            title={isCollapsed ? (isDark ? 'Modo claro' : 'Modo oscuro') : undefined}
          >
            <div className={`w-[18px] h-[18px] flex items-center justify-center ${isCollapsed ? '' : ''}`}>
              {isDark ? '☀️' : '🌙'}
            </div>
            {!isCollapsed && <span className="text-sm font-medium">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>

          {/* Store link */}
          <a
            href={STORE_URL}
            className={`w-full flex items-center gap-3 rounded-lg transition-all text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
          >
            <Store className="h-[18px] w-[18px] flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Ver Tienda</span>}
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 rounded-lg transition-all text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>

          {/* Version */}
          {!isCollapsed && (
            <div className="text-center pt-2">
              <p className="text-[10px] text-muted-foreground/60 font-mono tracking-wider">v2.0.0 · Yenyleths Store</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}