import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice } from '../../lib/format'
import { Rating } from '../ui/Rating'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const { isWishlisted, toggle } = useWishlist()
  const { addItem } = useCart()
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <div className="relative overflow-hidden border-2 border-line bg-paper transition-colors group-hover:border-ink">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <img
            src={product.images[1] ?? product.images[0]}
            alt=""
            loading="lazy"
            className="absolute inset-0 aspect-[3/4] w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        {/* hazard strikes through whatever is off the rack */}
        {discount && (
          <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-2 opacity-80" aria-hidden="true" />
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="swing">Nuevo</span>
          )}
          {discount && (
            <span className="swing swing-tag">-{discount}%</span>
          )}
          {product.stock < 5 && (
            <span className="swing">Últimas</span>
          )}
        </div>

        <div className="absolute right-2.5 top-2.5 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => toggle(product.id, product.name)}
            aria-label="Favorito"
            className="border-2 border-ink bg-paper-elevated p-2 text-ink transition-colors hover:bg-ink hover:text-paper-elevated"
          >
            <Heart size={16} className={isWishlisted(product.id) ? 'fill-market text-market' : ''} />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              aria-label="Vista rápida"
              className="border-2 border-ink bg-paper-elevated p-2 text-ink transition-colors hover:bg-ink hover:text-paper-elevated"
            >
              <Eye size={16} />
            </button>
          )}
          <button
            onClick={() => addItem(product, product.sizes[0], product.colors[0])}
            aria-label="Añadir al carrito"
            className="border-2 border-ink bg-paper-elevated p-2 text-ink transition-colors hover:bg-market hover:border-market hover:text-paper-elevated"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="q font-display text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">{product.brand}</p>
          {product.freeShipping && <span className="swing swing-tag" style={{ padding: '0.12rem 0.4rem' }}>Envío gratis</span>}
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 truncate font-display text-lg font-bold uppercase leading-tight text-ink hover:text-market transition-colors">{product.name}</h3>
        </Link>
        <Rating value={product.rating} count={product.reviewsCount} />
        <div className="mt-1.5 flex items-center gap-2 overflow-hidden">
          <span className="money shrink-0 border-2 border-ink px-2 py-0.5 text-sm font-bold text-ink">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="money min-w-0 truncate text-sm text-ink-soft/60 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}