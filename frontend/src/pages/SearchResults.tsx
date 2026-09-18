import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAllProducts } from '../context/ProductsContext'
import { ProductCard } from '../components/product/ProductCard'
import { QuickViewModal } from '../components/product/QuickViewModal'
import { Loader2 } from 'lucide-react'
import api from '../lib/api'
import type { Product } from '../types'

export default function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [apiResults, setApiResults] = useState<Product[] | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const { products } = useAllProducts()
  const navigate = useNavigate()

  useEffect(() => {
    if (!q) {
      setApiResults(null)
      return
    }
    setApiLoading(true)
    api.get('/products/search', { params: { q } })
      .then(({ data }) => setApiResults(data))
      .catch(() => setApiResults(null))
      .finally(() => setApiLoading(false))
  }, [q])

  const results = useMemo(() => {
    if (apiResults) return apiResults
    if (apiLoading) return []
    if (!q) return []

    const searchTerm = q.toLowerCase()

    return products.filter((p) => {
      if (p.name.toLowerCase().includes(searchTerm)) return true
      if (p.brand.toLowerCase().includes(searchTerm)) return true
      if (p.category?.toLowerCase().includes(searchTerm)) return true
      if (p.description?.toLowerCase().includes(searchTerm)) return true
      if (p.sizes?.some(size => size.toLowerCase().includes(searchTerm))) return true
      if (p.colors?.some(color => color.toLowerCase().includes(searchTerm))) return true
      if (p.slug?.toLowerCase().includes(searchTerm)) return true
      return false
    })
  }, [q, apiResults, apiLoading, products])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Helmet>
        <title>{q ? `Búsqueda: "${q}" - Yenyleths Boutique` : 'Buscar - Yenyleths Boutique'}</title>
        <meta name="description" content={q ? `Resultados de búsqueda para "${q}" en Yenyleths Boutique` : 'Busca productos en Yenyleths Boutique'} />
      </Helmet>

      <h1 className="mb-2 text-3xl font-black tracking-tight">Resultados para &quot;{q}&quot;</h1>
      <p className="mb-8 font-mono text-sm text-ink-soft">
        {apiLoading ? 'Buscando...' : `${results.length} productos encontrados`}
      </p>

      {apiLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-market" />
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-ink-soft">No encontramos productos que coincidan con tu búsqueda.</p>
          <p className="text-sm text-ink-soft">Intenta con otros términos como:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {['zapatos', 'hombre', 'mujer', 'niños', 'jersey', 'crocs', 'premium', 'oferta'].map((term) => (
              <span
                key={term}
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="cursor-pointer rounded-full border border-line px-3 py-1 font-mono text-xs transition-colors hover:border-market hover:text-market"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      )}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
