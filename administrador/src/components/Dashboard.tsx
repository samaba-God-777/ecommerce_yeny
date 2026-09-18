import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Package,
  FolderOpen,
  ArrowUpRight,
  Star,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock
} from 'lucide-react'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { getImageUrl } from '../lib/image'

const API = 'http://localhost:5000/api'

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
}

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

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryImages, setCategoryImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`)
      ])
      setCategories(catRes.data)
      setProducts(prodRes.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category)
    try {
      const { data } = await axios.get(`${API}/categories/${category.slug}/images`)
      setCategoryImages(data.images)
      setCurrentImageIndex(0)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching images:', err)
      setCategoryImages([])
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
    setCategoryImages([])
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % categoryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + categoryImages.length) % categoryImages.length)
  }

  const flashSaleProducts = products.filter(p => p.isFlashSale)
  const bestSellerProducts = products.filter(p => p.isBestSeller)

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

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-market to-market-deep rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Package className="h-6 w-6" />
            </div>
            <Badge variant="default" className="bg-white/20 text-white">{products.length} items</Badge>
          </div>
          <p className="text-3xl font-bold font-serif mb-1">{products.length}</p>
          <p className="text-white/70 text-sm">Productos en catálogo</p>
        </div>

        <div className="bg-gradient-to-br from-market to-market-bright rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <FolderOpen className="h-6 w-6" />
            </div>
            <Badge variant="default" className="bg-market-deep text-white">{categories.length} activas</Badge>
          </div>
          <p className="text-3xl font-bold font-serif mb-1">{categories.length}</p>
          <p className="text-white/70 text-sm">Categorías activas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-line shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            {flashSaleProducts.length > 0 && (
              <Badge variant="warning">{flashSaleProducts.length} activos</Badge>
            )}
          </div>
          <p className="text-3xl font-bold font-serif text-yellow-600 mb-1">{flashSaleProducts.length}</p>
          <p className="text-muted-foreground text-sm">Ventas Flash</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-line shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-market/5 rounded-xl">
              <Star className="h-6 w-6 text-market fill-market" />
            </div>
            {bestSellerProducts.length > 0 && (
              <Badge variant="default" className="bg-market/10 text-market-deep">{bestSellerProducts.length} destacados</Badge>
            )}
          </div>
          <p className="text-3xl font-bold font-serif text-market-deep mb-1">{bestSellerProducts.length}</p>
          <p className="text-muted-foreground text-sm">Más Vendidos</p>
        </div>
      </div>

      {/* Flash Sale & Best Sellers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flash Sale Section */}
        <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h3 className="font-bold text-yellow-800 font-serif">Venta Flash</h3>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="p-6">
            {flashSaleProducts.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-yellow-200 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No hay ventas flash activas</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="mt-3 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  + Activar venta flash
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {flashSaleProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50/50 hover:bg-yellow-100/50 transition-colors border border-yellow-100"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {getImageUrl(product.image) ? (
                        <img src={getImageUrl(product.image) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-yellow-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brown text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                        {product.flashSalePrice && (
                          <span className="text-sm font-bold text-yellow-600">{formatPrice(product.flashSalePrice)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {product.flashSaleEnd && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Clock size={12} />
                          <span>{formatDate(product.flashSaleEnd)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-market/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-market fill-market" />
              <h3 className="font-bold text-ink font-serif">Más Vendidos</h3>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-sm text-market-deep hover:text-market-deep font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="p-6">
            {bestSellerProducts.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-market-bright mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No hay productos destacados</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="mt-3 text-market-deep hover:text-market-deep font-medium text-sm"
                >
                  + Destacar producto
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bestSellerProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-market/5 hover:bg-market/10 transition-colors border border-line"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {getImageUrl(product.image) ? (
                        <img src={getImageUrl(product.image) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-market/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-market-bright" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brown text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-market-deep text-sm">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {product.stock <= 5 && (
                        <Badge variant={product.stock === 0 ? 'danger' : 'warning'} className="text-[10px]">
                          {product.stock === 0 ? 'Agotado' : `Últimas ${product.stock}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-market/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-market-deep" />
              <h3 className="font-bold text-ink font-serif">Productos Destacados</h3>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-sm text-market-deep hover:text-market-deep font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-border mx-auto mb-4" />
                <p className="text-muted-foreground">No hay productos aún</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="mt-4 text-market hover:text-market-deep font-medium text-sm"
                >
                  + Agregar primer producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-market/5 rounded-xl p-4 hover:bg-market/10 transition-colors duration-200 border border-line"
                  >
                    <div className="aspect-square bg-market/10 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                      {getImageUrl(product.image) ? (
                        <img
                          src={getImageUrl(product.image) ?? undefined}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="h-10 w-10 text-market-bright" />
                      )}
                    </div>
                    <h4 className="font-medium text-ink text-sm truncate">{product.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-market-deep text-sm">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    </div>
                    {product.stock <= 5 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant={product.stock === 0 ? 'danger' : 'warning'} className="text-[10px]">
                          {product.stock === 0 ? 'Agotado' : `Últimas ${product.stock}`}
                        </Badge>
                      </div>
                    )}
                    {product.isFlashSale && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="warning" className="text-[10px] bg-yellow-500 text-white">
                          <Zap size={10} className="mr-1" /> Flash
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-line bg-market/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-market-deep" />
                <h3 className="font-bold text-ink font-serif">Categorías</h3>
              </div>
              <button
                onClick={() => onNavigate('categories')}
                className="text-sm text-market-deep hover:text-market-deep font-medium flex items-center gap-1 transition-colors"
              >
                Ver todas <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="p-4">
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-border mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Sin categorías</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const productCount = products.filter(p => p.categoryId === cat.id).length
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-market/10 transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-market/40 to-market-bright/40 flex items-center justify-center group-hover:from-market/60 group-hover:to-market-bright/60 transition-colors">
                          <span className="text-market-deep font-bold text-sm">
                            {cat.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink text-sm truncate">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{productCount} productos</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Category Images Modal */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-line bg-gradient-to-r from-market/5 to-market/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-market to-market-deep flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">{selectedCategory.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ink font-serif">{selectedCategory.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {categoryImages.length} imágenes disponibles
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-market/10 transition-colors"
              >
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {categoryImages.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-16 w-16 text-border mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No hay imágenes para esta categoría</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Las imágenes se agregan desde la tienda principal
                  </p>
                </div>
              ) : (
                <>
                  {/* Main Image */}
                  <div className="relative bg-market/5 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={getImageUrl(categoryImages[currentImageIndex]) ?? categoryImages[currentImageIndex]}
                      alt={`${selectedCategory.name} - ${currentImageIndex + 1}`}
                      className="w-full h-96 object-contain"
                    />

                    {categoryImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6 text-market-deep" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight className="h-6 w-6 text-market-deep" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-market-deep text-white">
                        {currentImageIndex + 1} / {categoryImages.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {categoryImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {categoryImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-market shadow-lg scale-105'
                              : 'border-transparent hover:border-line opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={getImageUrl(img) ?? img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-line bg-market/5">
              <div className="flex items-center justify-between">
                <a
                  href={`http://localhost:5175/category/${selectedCategory.slug}`}
                  className="flex items-center gap-2 text-market-deep hover:text-market-deep font-medium transition-colors"
                >
                  <ExternalLink size={18} />
                  Ver en la tienda
                </a>
                <Button variant="secondary" onClick={closeModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
