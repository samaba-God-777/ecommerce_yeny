import { TrendingUp, Package, Star, Trash2, ArrowUp } from 'lucide-react'
import Badge from './ui/Badge'
import { getImageUrl } from '../lib/image'

interface Product {
  id: string
  name: string
  categoryId: string
  brand: string
  price: number
  image: string
  description: string
  stock: number
  rating: number
  isFlashSale?: boolean
  flashSalePrice?: number | null
  flashSaleEnd?: string | null
  isBestSeller?: boolean
  isTrending?: boolean
}

interface Category {
  id: string
  name: string
}

interface TrendingPageProps {
  products: Product[]
  categories: Category[]
  onToggleTrending: (id: string, value: boolean) => void
}

export default function TrendingPage({ products, categories, onToggleTrending }: TrendingPageProps) {
  const trendingProducts = products.filter(p => p.isTrending)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-ink rounded-2xl p-6 text-primary-foreground border border-line shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8" />
          <h2 className="text-2xl font-bold font-serif">Tendencia</h2>
        </div>
        <p className="text-primary-foreground/80">Los productos que están en tendencia ahora mismo</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-primary-foreground/15 rounded-lg px-4 py-2">
            <p className="text-3xl font-bold">{trendingProducts.length}</p>
            <p className="text-sm text-primary-foreground/80">Productos en tendencia</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {trendingProducts.length === 0 ? (
        <div className="bg-card rounded-2xl border border-line p-12 text-center">
          <TrendingUp className="h-16 w-16 text-line-strong mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground font-serif mb-2">No hay productos en tendencia</h3>
          <p className="text-muted-foreground">Activa la opción de Tendencia en la pestaña de Productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => {
            const cat = categories.find(c => c.id === product.categoryId)
            
            return (
              <div key={product.id} className="bg-card rounded-2xl border border-line shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
                {/* Trending Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="gold" className="text-primary-foreground">
                    <ArrowUp size={12} className="mr-1" /> Tendencia
                  </Badge>
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-muted">
                  {getImageUrl(product.image) ? (
                    <img src={getImageUrl(product.image) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-line-strong" />
                    </div>
                  )}
                  <button
                    onClick={() => onToggleTrending(product.id, false)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                    title="Quitar de Tendencia"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{cat?.name || 'Sin categoría'}</p>
                  <h3 className="font-bold text-brown font-serif truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  
                  {/* Price */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-lg font-bold text-market">{formatPrice(product.price)}</span>
                    {product.isFlashSale && product.flashSalePrice && (
                      <Badge variant="warning" className="text-xs">
                        Flash: {formatPrice(product.flashSalePrice)}
                      </Badge>
                    )}
                  </div>

                  {/* Stock & Rating */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-sm ${product.stock <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      Stock: {product.stock}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-brown">{product.rating}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.isBestSeller && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-700 text-[10px]">
                        <Star size={10} className="mr-1 fill-yellow-500" /> Más Vendido
                      </Badge>
                    )}
                    {product.isFlashSale && (
                      <Badge variant="warning" className="text-[10px]">
                        ⚡ Flash Sale
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
