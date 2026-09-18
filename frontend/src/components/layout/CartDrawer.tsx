import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/format'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper-elevated shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="h-1.5 w-full hazard" aria-hidden="true" />
            <div className="flex items-center justify-between border-b-2 border-ink px-6 py-5">
              <h2 className="q font-display text-2xl font-extrabold uppercase tracking-[0.02em]">Su pedido ({items.length})</h2>
              <button onClick={closeCart} aria-label="Cerrar carrito">
                <X size={22} className="text-ink" />
              </button>
            </div>

            {items.length === 0 ? (
              <motion.div
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="border-2 border-dashed border-line-strong p-6">
                  <ShoppingBag size={44} className="text-line-strong" />
                </div>
                <p className="q font-display text-xl font-bold uppercase text-ink-soft">Rack vacío</p>
                <Link
                  to="/category/women"
                  onClick={closeCart}
                  className="plate mt-1 bg-ink text-paper-elevated hover:bg-ink-soft"
                  style={{ borderColor: 'transparent' }}
                >
                  Explorar productos
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-5">
                    {items.map((item) => (
                      <motion.li
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-24 w-20 border-2 border-line object-cover"
                        />
                        <div className="flex-1">
                          <p className="q font-display text-lg font-bold uppercase leading-tight text-ink">{item.product.name}</p>
                          <p className="font-mono text-[11px] text-ink-soft">
                            Talla {item.size} · {item.color}
                          </p>
                          <p className="money mt-1 inline-block border-2 border-market px-1.5 text-sm font-bold text-market-deep">
                            {formatPrice(item.product.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center border-2 border-ink">
                              <button
                                className="p-1.5 text-ink hover:bg-ink hover:text-paper-elevated"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                                }
                                aria-label="Reducir cantidad"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                              <button
                                className="p-1.5 text-ink hover:bg-ink hover:text-paper-elevated"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                                }
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.size, item.color)}
                              aria-label="Eliminar"
                              className="text-ink-soft transition-colors hover:text-market-deep"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="border-t-2 border-ink px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Subtotal</span>
                    <span className="money text-lg font-bold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="block w-full bg-market py-3 text-center font-display text-base font-bold uppercase tracking-[0.06em] text-paper-elevated transition hover:bg-market-deep"
                  >
                    Pagar boleto
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}