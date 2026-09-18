import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, MessageSquare, Settings, BarChart3, Zap, Star, TrendingUp, Home, ShoppingCart, Users, Megaphone, FolderOpen } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (tab: string) => void
}

const commands = [
  { id: 'dashboard', label: 'Dashboard', description: 'Panel principal', icon: Home, category: 'Principal' },
  { id: 'products', label: 'Productos', description: 'Gestionar catálogo', icon: Package, category: 'Catálogo' },
  { id: 'categories', label: 'Categorías', description: 'Organizar productos', icon: FolderOpen, category: 'Catálogo' },
  { id: 'flash-sale', label: 'Venta Flash', description: 'Ofertas relámpago', icon: Zap, category: 'Catálogo' },
  { id: 'best-sellers', label: 'Más Vendidos', description: 'Productos estrella', icon: Star, category: 'Catálogo' },
  { id: 'trending', label: 'Tendencia', description: 'Productos en tendencia', icon: TrendingUp, category: 'Catálogo' },
  { id: 'orders', label: 'Pedidos', description: 'Gestionar pedidos', icon: ShoppingCart, category: 'Operaciones' },
  { id: 'customers', label: 'Clientes', description: 'Base de clientes', icon: Users, category: 'Operaciones' },
  { id: 'chat', label: 'Chat en Vivo', description: 'Soporte en tiempo real', icon: MessageSquare, category: 'Operaciones' },
  { id: 'marketing', label: 'Marketing', description: 'Campañas y promociones', icon: Megaphone, category: 'Herramientas' },
  { id: 'reports', label: 'Reportes', description: 'Análisis y métricas', icon: BarChart3, category: 'Herramientas' },
  { id: 'settings', label: 'Configuración', description: 'Ajustes de la tienda', icon: Settings, category: 'Herramientas' },
]

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      onNavigate(filtered[selectedIndex].id)
      onClose()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search size={20} className="text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar módulos, acciones..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <kbd className="rounded-lg border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No se encontraron resultados
                  </div>
                ) : (
                  filtered.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => { onNavigate(cmd.id); onClose() }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === selectedIndex ? 'bg-market/10 text-market dark:text-market-bright' : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        i === selectedIndex ? 'bg-muted text-ink-soft' : 'bg-muted text-muted-foreground'
                      }`}>
                        <cmd.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{cmd.label}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 font-medium">{cmd.category}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
