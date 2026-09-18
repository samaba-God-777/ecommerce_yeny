import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu, X, User, Settings, TrendingUp, Clock, LogOut } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAllProducts } from '../../context/ProductsContext'
import { useAuth } from '../../context/AuthContext'
import { categories } from '../../data/categories'
import { logo } from '../../data/productImages'
import { ADMIN_URL } from '../../lib/urls'

const navLinks = [
  { label: 'Mujer', slug: 'women' },
  { label: 'Hombre', slug: 'men' },
  { label: 'Niños', slug: 'kids' },
  { label: 'Zapatos', slug: 'shoes' },
  { label: 'Accesorios', slug: 'jewelry' },
  { label: 'Sale', slug: 'sale' },
]

const popularSearches = [
  'Jersey', 'Crocs', 'Zapatos', 'Mujer', 'Hombre', 'Niños', 'Premium', 'Oferta'
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { itemCount, openCart } = useCart()
  const { products } = useAllProducts()
  const { user, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = useMemo(() => {
    if (!search.trim()) return []

    const searchTerm = search.toLowerCase()
    const matched = new Set<string>()

    products.forEach(p => {
      if (p.name.toLowerCase().includes(searchTerm)) matched.add(p.name)
      if (p.brand.toLowerCase().includes(searchTerm)) matched.add(p.brand)
      if (p.category.toLowerCase().includes(searchTerm)) matched.add(p.category)
      p.sizes?.forEach(size => {
        if (size.toLowerCase().includes(searchTerm)) matched.add(`Talla ${size}`)
      })
    })

    return Array.from(matched).slice(0, 6)
  }, [search, products])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      const newRecent = [search.trim(), ...recentSearches.filter(s => s !== search.trim())].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion)
    const newRecent = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
    setShowSuggestions(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-line ${
        scrolled ? 'bg-paper-elevated/95 backdrop-blur-md shadow-[0_1px_0_#e9e5da]' : 'bg-paper-elevated/80'
      }`}
    >
      {/* stockroom floor strip */}
      <div className="h-1.5 w-full hazard" aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8 lg:py-4">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
          <Menu size={22} className="text-ink" />
        </button>

        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden border-2 border-ink">
            <img src={logo} alt="Yenyleths Boutique" className="h-full w-full object-cover" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="q font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-ink lg:text-[26px]">
              Yenyleths
            </span>
            <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-market">
              Boutique · en venta
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              to={`/category/${link.slug}`}
              className="q font-display text-sm font-bold uppercase tracking-[0.06em] text-ink-soft transition-colors hover:text-market"
            >
              {link.label}
            </Link>
          ))}

          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full w-full border-y border-line bg-paper-elevated shadow-[0_24px_48px_-24px_rgba(30,28,24,0.25)]"
              >
                <div className="mx-auto grid max-w-7xl grid-cols-6 gap-4 px-8 py-6">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="group text-center"
                      onClick={() => setMegaOpen(false)}
                    >
                      <div className="overflow-hidden rounded-lg bg-beige">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <span className="mt-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <div ref={searchRef} className="relative hidden lg:block">
            <form onSubmit={submitSearch} className="flex items-center">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                type="text"
                placeholder="Buscar en la cuenta..."
                className="w-44 border-b border-line-strong bg-transparent px-1 py-1 font-mono text-[13px] text-ink outline-none transition-all focus:w-60 focus:border-market"
              />
              <button type="submit" aria-label="Buscar">
                <Search size={18} className="ml-2 text-ink-soft" />
              </button>
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-lg border border-line bg-paper-elevated shadow-[0_24px_48px_-24px_rgba(30,28,24,0.25)] z-50"
                >
                  {search.trim() ? (
                    <div className="p-3">
                      <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Sugerencias</p>
                      {suggestions.length > 0 ? (
                        <div className="space-y-1">
                          {suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-paper"
                            >
                              <Search size={14} className="text-ink-soft/60" />
                              <span>{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="px-2 text-sm text-ink-soft">No hay sugerencias</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3">
                      {recentSearches.length > 0 && (
                        <div className="mb-3">
                          <p className="mb-2 flex items-center gap-1 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                            <Clock size={12} />
                            Recientes
                          </p>
                          <div className="space-y-1">
                            {recentSearches.map((term, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(term)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-paper"
                              >
                                <Clock size={14} className="text-ink-soft/60" />
                                <span>{term}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="mb-2 flex items-center gap-1 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                          <TrendingUp size={12} />
                          Populares
                        </p>
                        <div className="flex flex-wrap gap-2 px-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSuggestionClick(term)}
                              className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-ink-soft transition-colors hover:border-market hover:text-market"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user && (
            <>
              <Link to="/dashboard" aria-label="Mi Panel" className="flex items-center gap-1.5 bg-ink px-3 py-2 text-[13px] font-bold text-paper-elevated transition hover:bg-ink-soft">
                <User size={16} />
                <span className="hidden sm:inline">Mi Panel</span>
              </Link>
              <Link to="/account" aria-label="Configuración del usuario" className="hidden lg:block">
                <Settings size={19} className="text-ink-soft hover:text-market transition" />
              </Link>
            </>
          )}
          <div className="relative" ref={userMenuRef}>
            {authLoading ? (
              <div className="hidden lg:flex h-8 w-8 items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-market border-t-transparent" />
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Menú de usuario"
                  className="hidden lg:flex items-center gap-1"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-xs font-bold text-paper-elevated">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-lg border border-line bg-paper-elevated shadow-[0_24px_48px_-24px_rgba(30,28,24,0.25)]">
                    <div className="border-b border-line px-4 py-3">
                      <p className="text-sm font-bold text-ink">{user.username}</p>
                      <p className="font-mono text-xs text-ink-soft">{user.email || 'usuario@yenyleths.com'}</p>
                    </div>
                    <div className="space-y-1 p-2">
                      <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-paper">
                        <User size={16} /> Mi Cuenta
                      </Link>
                      <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-paper">
                        <Settings size={16} /> Configuración
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-market-deep transition-colors hover:bg-paper">
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" aria-label="Iniciar Sesión" className="flex items-center gap-1.5 border border-ink px-3 py-2 text-[13px] font-bold text-ink transition hover:bg-ink hover:text-paper-elevated">
                <User size={16} />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
            )}
          </div>
          <Link to="/wishlist" aria-label="Favoritos">
            <Heart size={20} className="text-ink-soft hover:text-market transition" />
          </Link>
          <button onClick={openCart} aria-label="Carrito" className="relative">
            <ShoppingBag size={20} className="text-ink-soft hover:text-market transition" />
            {itemCount > 0 && (
              <span className="swing swing-tag hover-swing absolute -right-3 -top-3 flex h-6 min-w-6 items-center justify-center px-1.5 font-mono text-[11px]">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-paper-elevated p-6 shadow-[24px_0_48px_-32px_rgba(30,28,24,0.4)]"
          >
            <button onClick={() => setMobileOpen(false)} className="mb-8" aria-label="Cerrar menú">
              <X size={24} className="text-ink" />
            </button>
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={`/category/${link.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-mono text-lg font-bold uppercase tracking-[0.08em] text-ink hover:text-market transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-line pt-4">
                <a
                  href={ADMIN_URL}
                  className="flex items-center gap-2 font-mono text-lg font-bold text-market transition hover:text-market-deep"
                >
                  <Settings size={20} />
                  Panel Admin
                </a>
              </li>
              {authLoading ? null : user ? (
                <li className="border-t border-line pt-4">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-mono text-lg font-bold text-market transition hover:text-market-deep">
                    <User size={20} />
                    Mi Panel
                  </Link>
                </li>
              ) : (
                <li className="border-t border-line pt-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-mono text-lg font-bold text-market transition hover:text-market-deep">
                    <User size={20} />
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  )
}