import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, Folders, ChevronRight } from 'lucide-react'
import { useAllProducts } from '../context/ProductsContext'
import { categories } from '../data/categories'
import { ProductCard } from '../components/product/ProductCard'
import { QuickViewModal } from '../components/product/QuickViewModal'
import type { Product } from '../types'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = categories.find((c) => c.slug === slug)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState<SortKey>('newest')
  const [maxPrice, setMaxPrice] = useState(500)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const { products } = useAllProducts()

  const list = useMemo(() => {
    let result = slug === 'sale'
      ? products.filter((p) => p.oldPrice)
      : products.filter((p) => p.category === slug)
    result = result.filter((p) => p.price <= maxPrice)
    if (selectedSizes.length) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)))
    }
    switch (sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating)
      default:
        return result
    }
  }, [slug, sort, maxPrice, selectedSizes])

  const allSizes = ['XS', 'S', 'M', 'L', 'XL']
  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const getCategoryProductCount = (categorySlug: string) => {
    return products.filter(p => p.category === categorySlug).length
  }

  const categoryName = category?.name ?? 'Sale'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Helmet>
        <title>{categoryName} - Yenyleths Boutique</title>
        <meta name="description" content={`Explora nuestra colección de ${categoryName} en Yenyleths Boutique. Moda premium.`} />
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <div className="mb-2 flex items-center gap-2 font-mono text-xs text-ink-soft">
          <Link to="/" className="transition-colors hover:text-market">Inicio</Link>
          <ChevronRight size={14} />
          <span className="text-ink">{categoryName}</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">{categoryName}</h1>
        <p className="mt-1 font-mono text-sm text-ink-soft">{list.length} productos</p>
      </motion.div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="mb-6 overflow-hidden rounded-lg border border-line bg-paper-elevated sticky top-24">
            <div className="flex items-center gap-2 border-b border-line bg-ink px-5 py-4">
              <Folders className="h-5 w-5 text-paper-elevated" />
              <h3 className="font-bold text-paper-elevated">Categorías</h3>
            </div>
            <div className="space-y-1 p-3">
              {categories.map((cat) => {
                const isActive = cat.slug === slug
                const count = getCategoryProductCount(cat.slug)
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`flex items-center gap-3 rounded-md p-3 transition-all duration-200 ${
                      isActive ? 'bg-paper text-market' : 'hover:bg-paper'
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      isActive ? 'bg-market' : 'bg-paper'
                    }`}>
                      <span className={`font-bold text-sm ${isActive ? 'text-paper-elevated' : 'text-ink-soft'}`}>
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${isActive ? 'text-market' : 'text-ink'}`}>
                        {cat.name}
                      </p>
                      <p className="font-mono text-[11px] text-ink-soft">{count} productos</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <FilterPanel
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            allSizes={allSizes}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filtros
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="ml-auto rounded-full border border-line bg-transparent px-4 py-2 text-sm"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>

          {list.length === 0 ? (
            <p className="py-20 text-center text-ink-soft">No se encontraron productos con estos filtros.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="relative h-full w-72 overflow-y-auto bg-paper-elevated p-6"
          >
            <button onClick={() => setFiltersOpen(false)} className="mb-6"><X size={22} /></button>

            <div className="mb-6 lg:hidden">
              <h3 className="mb-3 font-mono text-sm font-bold uppercase tracking-wide text-ink">Categorías</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setFiltersOpen(false)}
                    className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                      cat.slug === slug ? 'bg-paper' : 'hover:bg-paper'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-paper">
                      <span className="font-mono text-xs font-bold text-ink-soft">{cat.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-semibold text-ink">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <FilterPanel
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              allSizes={allSizes}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
            />
          </motion.div>
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}

function FilterPanel({
  maxPrice,
  setMaxPrice,
  allSizes,
  selectedSizes,
  toggleSize,
}: {
  maxPrice: number
  setMaxPrice: (n: number) => void
  allSizes: string[]
  selectedSizes: string[]
  toggleSize: (s: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper-elevated">
      <div className="border-b border-line bg-paper px-5 py-4">
        <h3 className="font-bold text-ink">Filtros</h3>
      </div>
      <div className="p-5">
        <div className="mb-6">
          <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Precio</h4>
          <input
            type="range"
            min={20}
            max={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-market"
          />
          <p className="money mt-1 text-sm text-ink-soft">Hasta ${maxPrice}</p>
        </div>
        <div>
          <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Talla</h4>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`h-9 w-9 rounded-full border font-mono text-xs transition-all ${
                  selectedSizes.includes(s)
                    ? 'border-market bg-market text-paper-elevated'
                    : 'border-line hover:border-market'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}