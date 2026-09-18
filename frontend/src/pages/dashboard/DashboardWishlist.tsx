import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  ShoppingCart,
  Eye,
  Trash2,
  Share2,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Search,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice } from '../../lib/format'
import type { Product } from '../../types'

const mockWishlistProducts: (Product & { addedDate: string })[] = [
  {
    id: 'w1',
    slug: 'vestido-rosa-elegante',
    name: 'Vestido Rosa Elegante',
    brand: 'Yenyleths Collection',
    category: 'vestidos',
    price: 189.99,
    oldPrice: 249.99,
    rating: 4.8,
    reviewsCount: 124,
    images: ['https://picsum.photos/seed/wishlist1/400/500'],
    colors: ['Rosa', 'Negro', 'Blanco'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 12,
    isNew: true,
    freeShipping: true,
    description: 'Vestido elegante rosa con detalles de encaje.',
    addedDate: '2026-06-28',
  },
  {
    id: 'w2',
    slug: 'bolso-cuero-dorado',
    name: 'Bolso de Cuero Dorado',
    brand: 'Luxe Accessories',
    category: 'accesorios',
    price: 129.50,
    rating: 4.6,
    reviewsCount: 89,
    images: ['https://picsum.photos/seed/wishlist2/400/500'],
    colors: ['Dorado', 'Plateado'],
    sizes: ['Único'],
    stock: 8,
    isBestSeller: true,
    freeShipping: true,
    description: 'Bolso de cuero genuino con acabados dorados.',
    addedDate: '2026-06-27',
  },
  {
    id: 'w3',
    slug: 'blusa-seda-perla',
    name: 'Blusa de Seda Perla',
    brand: 'Yenyleths Collection',
    category: 'blusas',
    price: 89.00,
    oldPrice: 119.00,
    rating: 4.9,
    reviewsCount: 67,
    images: ['https://picsum.photos/seed/wishlist3/400/500'],
    colors: ['Perla', 'Rosa', 'Negro'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    freeShipping: false,
    description: 'Blusa de seda natural con corte favorecedor.',
    addedDate: '2026-06-25',
  },
  {
    id: 'w4',
    slug: 'tacones-cristal',
    name: 'Tacones de Cristal',
    brand: 'Stiletto Luxe',
    category: 'zapatos',
    price: 215.00,
    rating: 4.7,
    reviewsCount: 203,
    images: ['https://picsum.photos/seed/wishlist4/400/500'],
    colors: ['Transparente', 'Rosa'],
    sizes: ['36', '37', '38', '39', '40'],
    stock: 5,
    isNew: true,
    freeShipping: true,
    description: 'Tacones transparentes con detalles de cristal.',
    addedDate: '2026-06-24',
  },
  {
    id: 'w5',
    slug: 'falda-plisada-dorado',
    name: 'Falda Plisada Dorada',
    brand: 'Yenyleths Collection',
    category: 'faldas',
    price: 79.99,
    rating: 4.5,
    reviewsCount: 45,
    images: ['https://picsum.photos/seed/wishlist5/400/500'],
    colors: ['Dorado', 'Negro'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 20,
    freeShipping: false,
    description: 'Falda plisada con acabado metálico dorado.',
    addedDate: '2026-06-22',
  },
  {
    id: 'w6',
    slug: 'collar-perlas-barroco',
    name: 'Collar de Perlas Barroco',
    brand: 'Pearl Maison',
    category: 'accesorios',
    price: 159.00,
    oldPrice: 199.00,
    rating: 4.9,
    reviewsCount: 156,
    images: ['https://picsum.photos/seed/wishlist6/400/500'],
    colors: ['Blanco', 'Rosa'],
    sizes: ['Único'],
    stock: 10,
    isBestSeller: true,
    freeShipping: true,
    description: 'Collar de perlas cultivadas con cierre de oro.',
    addedDate: '2026-06-20',
  },
  {
    id: 'w7',
    slug: 'chaqueta-terciopelo',
    name: 'Chaqueta de Terciopelo',
    brand: 'Velvet Collection',
    category: 'chaquetas',
    price: 165.00,
    rating: 4.4,
    reviewsCount: 78,
    images: ['https://picsum.photos/seed/wishlist7/400/500'],
    colors: ['Burdeos', 'Verde', 'Negro'],
    sizes: ['S', 'M', 'L'],
    stock: 7,
    freeShipping: true,
    description: 'Chaqueta de terciopelo con forro de seda.',
    addedDate: '2026-06-18',
  },
  {
    id: 'w8',
    slug: 'reloj-rosa-dorado',
    name: 'Reloj Rosa Dorado',
    brand: 'Timepiece Luxe',
    category: 'accesorios',
    price: 299.00,
    oldPrice: 349.00,
    rating: 4.8,
    reviewsCount: 312,
    images: ['https://picsum.photos/seed/wishlist8/400/500'],
    colors: ['Rosa Dorado', 'Plata'],
    sizes: ['Único'],
    stock: 3,
    isNew: true,
    freeShipping: true,
    description: 'Reloj de pulsera con esfera de nácar y correa de acero.',
    addedDate: '2026-06-15',
  },
  {
    id: 'w9',
    slug: 'pantalón-wide-leg',
    name: 'Pantalón Wide Leg',
    brand: 'Yenyleths Collection',
    category: 'pantalones',
    price: 95.00,
    rating: 4.3,
    reviewsCount: 54,
    images: ['https://picsum.photos/seed/wishlist9/400/500'],
    colors: ['Crema', 'Negro', 'Beige'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 25,
    freeShipping: false,
    description: 'Pantalón wide leg de tela fluida y elegante.',
    addedDate: '2026-06-12',
  },
]

const mockRecentlyViewed: Product[] = [
  {
    id: 'rv1',
    slug: 'anillo-diamante',
    name: 'Anillo de Diamante',
    brand: 'Jewel Luxe',
    category: 'accesorios',
    price: 450.00,
    rating: 5.0,
    reviewsCount: 89,
    images: ['https://picsum.photos/seed/recent1/400/500'],
    colors: ['Oro', 'Plata'],
    sizes: ['Único'],
    stock: 2,
    description: 'Anillo de diamante solitario.',
  },
  {
    id: 'rv2',
    slug: 'cartera-python',
    name: 'Cartera Python',
    brand: 'Exotic Bags',
    category: 'accesorios',
    price: 320.00,
    rating: 4.7,
    reviewsCount: 67,
    images: ['https://picsum.photos/seed/recent2/400/500'],
    colors: ['Natural', 'Negro'],
    sizes: ['Único'],
    stock: 4,
    description: 'Cartera de piel de pitón.',
  },
  {
    id: 'rv3',
    slug: 'gafas-sol-doradas',
    name: 'Gafas de Sol Doradas',
    brand: 'Optic Luxe',
    category: 'accesorios',
    price: 175.00,
    oldPrice: 210.00,
    rating: 4.6,
    reviewsCount: 134,
    images: ['https://picsum.photos/seed/recent3/400/500'],
    colors: ['Dorado', 'Plateado'],
    sizes: ['Único'],
    stock: 11,
    description: 'Gafas de sol con montura de oro.',
  },
  {
    id: 'rv4',
    slug: 'bufanda-seda',
    name: 'Bufanda de Seda',
    brand: 'Silk House',
    category: 'accesorios',
    price: 65.00,
    rating: 4.8,
    reviewsCount: 98,
    images: ['https://picsum.photos/seed/recent4/400/500'],
    colors: ['Rosa', 'Azul', 'Verde'],
    sizes: ['Único'],
    stock: 30,
    description: 'Bufanda de seda estampada.',
  },
]

const sortOptions = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'name', label: 'Nombre A-Z' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function DashboardWishlist() {
  const { ids, toggle } = useWishlist()
  const { addItem } = useCart()
  const [sortBy, setSortBy] = useState('recent')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const wishlistProducts = useMemo(() => {
    let items = mockWishlistProducts.filter((p) => ids.has(p.id))
    if (items.length === 0) items = mockWishlistProducts

    if (searchQuery) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory)
    }

    switch (sortBy) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...items].sort((a, b) => b.rating - a.rating)
      case 'name':
        return [...items].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...items].sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    }
  }, [ids, sortBy, searchQuery, selectedCategory])

  const categories = useMemo(() => {
    const cats = new Set(mockWishlistProducts.map((p) => p.category))
    return Array.from(cats)
  }, [])

  const handleShare = () => {
    const text = `Mira mi lista de deseos en Yenyleths Boutique: ${wishlistProducts.map((p) => p.name).join(', ')}`
    if (navigator.share) {
      navigator.share({ title: 'Mi Lista de Deseos - Yenyleths', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(rating) ? 'fill-gold text-gold' : 'fill-transparent text-brown/20'}
        />
      ))}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brown">Mi Lista de Deseos</h1>
            <p className="mt-1 text-sm text-brown/60">
              {wishlistProducts.length} productos que amas
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="w-fit gap-2 border-gold/30 text-brown hover:bg-gold/10"
          >
            <Share2 size={16} />
            Compartir lista
          </Button>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40" />
          <input
            type="text"
            placeholder="Buscar en favoritos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-white py-2.5 pl-10 pr-4 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-brown text-cream'
                  : 'border border-brown/15 text-brown/70 hover:bg-beige'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brown text-cream'
                    : 'border border-brown/15 text-brown/70 hover:bg-beige'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 rounded-xl border border-brown/15 px-4 py-2.5 text-xs font-medium text-brown/70 hover:bg-beige"
            >
              <SlidersHorizontal size={14} />
              Ordenar
              <ArrowUpDown size={12} />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-brown/10 bg-white py-2 shadow-lg"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-xs transition-colors ${
                        sortBy === option.value
                          ? 'bg-gold/10 font-semibold text-gold-dark'
                          : 'text-brown/70 hover:bg-beige'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {wishlistProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-24 text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
            <Heart size={40} className="text-gold" />
          </div>
          <h2 className="font-serif text-2xl text-brown">Tu lista está vacía</h2>
          <p className="mt-2 text-sm text-brown/50">
            Explora nuestra colección y guarda los productos que más te gusten.
          </p>
          <Link to="/category/women">
            <Button className="mt-6 gap-2 bg-brown text-cream hover:bg-brown/90">
              <Sparkles size={16} />
              Explorar productos
            </Button>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Product Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-2xl border border-brown/8 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="rounded-full bg-brown px-2.5 py-0.5 text-[10px] font-bold uppercase text-cream">
                          Nuevo
                        </span>
                      )}
                      {product.oldPrice && (
                        <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-white">
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brown/0 opacity-0 transition-all duration-300 group-hover:bg-brown/20 group-hover:opacity-100">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brown shadow-md transition-colors hover:bg-gold hover:text-white"
                        title="Vista rápida"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem(product, product.sizes[0], product.colors[0])}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brown shadow-md transition-colors hover:bg-gold hover:text-white"
                        title="Añadir al carrito"
                      >
                        <ShoppingCart size={16} />
                      </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggle(product.id, product.name)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-400 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-brown/40">
                      {product.brand}
                    </p>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="mt-1 font-serif text-sm font-semibold text-brown line-clamp-1 hover:text-gold-dark transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-1.5">{renderStars(product.rating)}</div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-brown">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-brown/40 line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                    {product.freeShipping && (
                      <p className="mt-1.5 text-[10px] font-medium text-green-600">Envío gratis</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Recently Viewed Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-gold" />
              <h2 className="font-serif text-2xl font-bold text-brown">Vistos Recientemente</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {mockRecentlyViewed.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-brown/8 bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-brown/40">{product.brand}</p>
                    <h4 className="mt-0.5 font-serif text-xs font-semibold text-brown line-clamp-1">{product.name}</h4>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-brown">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-[10px] text-brown/40 line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Recommended Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 mb-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-gold" />
              <h2 className="font-serif text-2xl font-bold text-brown">Recomendados Para Ti</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {mockRecentlyViewed.map((product) => (
                <motion.div
                  key={`rec-${product.id}`}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-brown/8 bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggle(product.id, product.name)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gold shadow-sm backdrop-blur-sm transition-colors hover:text-gold-dark"
                    >
                      <Heart size={14} className="fill-gold" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-brown/40">{product.brand}</p>
                    <h4 className="mt-0.5 font-serif text-xs font-semibold text-brown line-clamp-1">{product.name}</h4>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-brown">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-[10px] text-brown/40 line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </>
      )}
    </div>
  )
}
