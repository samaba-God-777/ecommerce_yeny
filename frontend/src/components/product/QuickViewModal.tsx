import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '../../types'
import { formatPrice } from '../../lib/format'
import { Rating } from '../ui/Rating'
import { useCart } from '../../context/CartContext'

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart()
  const [size, setSize] = useState(product?.sizes[0])
  const [color, setColor] = useState(product?.colors[0])

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onClose}
          >
            <div
              className="grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto border-2 border-ink bg-paper-elevated shadow-2xl sm:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={product.images[0]} alt={product.name} className="h-64 w-full border-b-2 border-ink object-cover sm:border-b-0 sm:border-r-2 sm:h-full" />
              <div className="relative p-6">
                <button onClick={onClose} className="absolute right-4 top-4 border-2 border-ink p-1 hover:bg-ink hover:text-paper-elevated" aria-label="Cerrar">
                  <X size={18} />
                </button>
                <p className="q font-display text-sm font-bold uppercase tracking-[0.08em] text-ink-soft">{product.brand}</p>
                <h2 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight">{product.name}</h2>
                <Rating value={product.rating} count={product.reviewsCount} />
                <p className="money mt-2 inline-block border-2 border-market px-2 py-0.5 text-lg font-bold text-market-deep">{formatPrice(product.price)}</p>
                <p className="mt-3 font-mono text-sm leading-relaxed text-ink-soft">{product.description}</p>

                <div className="mt-5">
                  <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.06em]">Talla</p>
                  <div className="flex gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`h-9 min-w-9 border-2 px-1 font-mono text-xs ${
                          size === s ? 'border-market bg-market text-paper-elevated' : 'border-ink hover:bg-ink hover:text-paper-elevated'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.06em]">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`h-7 w-7 border-2 ${
                          color === c ? 'border-market ring-2 ring-market ring-offset-2' : 'border-ink'
                        }`}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem(product, size ?? product.sizes[0], color ?? product.colors[0])
                    onClose()
                  }}
                  className="mt-6 w-full bg-market py-3 font-display text-base font-bold uppercase tracking-[0.06em] text-paper-elevated hover:bg-market-deep"
                >
                  Añadir al carrito
                </button>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="mt-2 block text-center font-mono text-xs uppercase tracking-[0.1em] text-ink-soft underline decoration-market underline-offset-4 hover:text-market"
                >
                  Ver detalles completos
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
