import { Zap, Package, Star, Clock, Trash2 } from 'lucide-react'
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

interface FlashSalePageProps {
  products: Product[]
  categories: Category[]
  onToggleFlashSale: (id: string, value: boolean) => void
}

export default function FlashSalePage({ products, categories, onToggleFlashSale }: FlashSalePageProps) {
  const flashSaleProducts = products.filter(p => p.isFlashSale)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDiscount = (price: number, flashPrice: number) => {
    return Math.round(((price - flashPrice) / price) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-ink rounded-2xl p-6 text-primary-foreground border border-line shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8" />
          <h2 className="text-2xl font-bold font-serif">Venta Flash</h2>
        </div>
        <p className="text-primary-foreground/80">Gestiona los productos en oferta relámpago</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-primary-foreground/15 rounded-lg px-4 py-2">
            <p className="text-3xl font-bold">{flashSaleProducts.length}</p>
            <p className="text-sm text-primary-foreground/80">Productos activos</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {flashSaleProducts.length === 0 ? (
        <div className="bg-card rounded-2xl border border-line p-12 text-center">
          <Zap className="h-16 w-16 text-line-strong mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground font-serif mb-2">No hay ventas flash activas</h3>
          <p className="text-muted-foreground">Activa la opción de Venta Flash en la pestaña de Productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashSaleProducts.map((product) => {
            const cat = categories.find(c => c.id === product.categoryId)
            const discount = product.flashSalePrice ? getDiscount(product.price, product.flashSalePrice) : 0
            
            return (
              <div key={product.id} className="bg-card rounded-2xl border border-line shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative aspect-square bg-muted">
                  {getImageUrl(product.image) ? (
                    <img src={getImageUrl(product.image) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-line-strong" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" className="text-primary-foreground">
                      <Zap size={12} className="mr-1 fill-current" /> -{discount}%
                    </Badge>
                  </div>
                  <button
                    onClick={() => onToggleFlashSale(product.id, false)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                    title="Quitar de Venta Flash"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{cat?.name || 'Sin categoría'}</p>
                  <h3 className="font-bold text-brown font-serif truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  
                  {/* Prices */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-lg font-bold text-market">{formatPrice(product.flashSalePrice || 0)}</span>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </div>

                  {/* Stock */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    {product.flashSaleEnd && (
                      <div className="flex items-center gap-1 text-xs text-market">
                        <Clock size={12} />
                        <span>{formatDate(product.flashSaleEnd)}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{product.rating}</span>
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
