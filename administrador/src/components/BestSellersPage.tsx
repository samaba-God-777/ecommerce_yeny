import { Star, Package, Trash2, TrendingUp } from 'lucide-react'
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
}

interface Category {
  id: string
  name: string
}

interface BestSellersPageProps {
  products: Product[]
  categories: Category[]
  onToggleBestSeller: (id: string, value: boolean) => void
}

export default function BestSellersPage({ products, categories, onToggleBestSeller }: BestSellersPageProps) {
  const bestSellerProducts = products.filter(p => p.isBestSeller)

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
          <Star className="h-8 w-8 fill-white" />
          <h2 className="text-2xl font-bold font-serif">Más Vendidos</h2>
        </div>
        <p className="text-white/80">Los productos estrella de tu tienda</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-3xl font-bold">{bestSellerProducts.length}</p>
            <p className="text-sm text-white/80">Productos destacados</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {bestSellerProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Star className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brown font-serif mb-2">No hay productos destacados</h3>
          <p className="text-muted-foreground">Activa la opción de Más Vendidos en la pestaña de Productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellerProducts.map((product, index) => {
            const cat = categories.find(c => c.id === product.categoryId)
            
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-10 h-10 bg-market rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground font-bold text-lg">#{index + 1}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-muted/40">
                  {getImageUrl(product.image) ? (
                    <img src={getImageUrl(product.image) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <button
                    onClick={() => onToggleBestSeller(product.id, false)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                    title="Quitar de Más Vendidos"
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
                        <TrendingUp size={10} className="mr-1" /> Flash: {formatPrice(product.flashSalePrice)}
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
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
