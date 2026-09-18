import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Tag,
  Gift,
  StickyNote,
  ArrowRight,
  Bookmark,
  Sparkles,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice } from '../../lib/format'
import type { Product, CartItem } from '../../types'

const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'c1',
      slug: 'vestido-rosa-elegante',
      name: 'Vestido Rosa Elegante',
      brand: 'Yenyleths Collection',
      category: 'vestidos',
      price: 189.99,
      oldPrice: 249.99,
      rating: 4.8,
      reviewsCount: 124,
      images: ['https://picsum.photos/seed/cart1/400/500'],
      colors: ['Rosa', 'Negro'],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 12,
      freeShipping: true,
      description: 'Vestido elegante rosa.',
    },
    quantity: 1,
    size: 'M',
    color: 'Rosa',
  },
  {
    product: {
      id: 'c2',
      slug: 'bolso-cuero-dorado',
      name: 'Bolso de Cuero Dorado',
      brand: 'Luxe Accessories',
      category: 'accesorios',
      price: 129.50,
      rating: 4.6,
      reviewsCount: 89,
      images: ['https://picsum.photos/seed/cart2/400/500'],
      colors: ['Dorado', 'Plateado'],
      sizes: ['Único'],
      stock: 8,
      freeShipping: true,
      description: 'Bolso de cuero genuino.',
    },
    quantity: 2,
    size: 'Único',
    color: 'Dorado',
  },
  {
    product: {
      id: 'c3',
      slug: 'tacones-cristal',
      name: 'Tacones de Cristal',
      brand: 'Stiletto Luxe',
      category: 'zapatos',
      price: 215.00,
      rating: 4.7,
      reviewsCount: 203,
      images: ['https://picsum.photos/seed/cart3/400/500'],
      colors: ['Transparente', 'Rosa'],
      sizes: ['36', '37', '38', '39', '40'],
      stock: 5,
      freeShipping: true,
      description: 'Tacones transparentes.',
    },
    quantity: 1,
    size: '38',
    color: 'Transparente',
  },
  {
    product: {
      id: 'c4',
      slug: 'collar-perlas-barroco',
      name: 'Collar de Perlas Barroco',
      brand: 'Pearl Maison',
      category: 'accesorios',
      price: 159.00,
      oldPrice: 199.00,
      rating: 4.9,
      reviewsCount: 156,
      images: ['https://picsum.photos/seed/cart4/400/500'],
      colors: ['Blanco', 'Rosa'],
      sizes: ['Único'],
      stock: 10,
      freeShipping: true,
      description: 'Collar de perlas cultivadas.',
    },
    quantity: 1,
    size: 'Único',
    color: 'Blanco',
  },
]

const recommendedProducts: Product[] = [
  {
    id: 'r1',
    slug: 'anillo-diamante',
    name: 'Anillo de Diamante',
    brand: 'Jewel Luxe',
    category: 'accesorios',
    price: 450.00,
    rating: 5.0,
    reviewsCount: 89,
    images: ['https://picsum.photos/seed/rec1/400/500'],
    colors: ['Oro', 'Plata'],
    sizes: ['Único'],
    stock: 2,
    description: 'Anillo de diamante.',
  },
  {
    id: 'r2',
    slug: 'reloj-rosa-dorado',
    name: 'Reloj Rosa Dorado',
    brand: 'Timepiece Luxe',
    category: 'accesorios',
    price: 299.00,
    rating: 4.8,
    reviewsCount: 312,
    images: ['https://picsum.photos/seed/rec2/400/500'],
    colors: ['Rosa Dorado', 'Plata'],
    sizes: ['Único'],
    stock: 3,
    description: 'Reloj de pulsera.',
  },
  {
    id: 'r3',
    slug: 'gafas-sol-doradas',
    name: 'Gafas de Sol Doradas',
    brand: 'Optic Luxe',
    category: 'accesorios',
    price: 175.00,
    rating: 4.6,
    reviewsCount: 134,
    images: ['https://picsum.photos/seed/rec3/400/500'],
    colors: ['Dorado', 'Plateado'],
    sizes: ['Único'],
    stock: 11,
    description: 'Gafas de sol con montura de oro.',
  },
  {
    id: 'r4',
    slug: 'cartera-python',
    name: 'Cartera Python',
    brand: 'Exotic Bags',
    category: 'accesorios',
    price: 320.00,
    rating: 4.7,
    reviewsCount: 67,
    images: ['https://picsum.photos/seed/rec4/400/500'],
    colors: ['Natural', 'Negro'],
    sizes: ['Único'],
    stock: 4,
    description: 'Cartera de piel de pitón.',
  },
]

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.3 } },
}

export default function DashboardCart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const { toggle } = useWishlist()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  const [notes, setNotes] = useState('')
  // Solo se escribe: la seccion de "guardados" aun no se muestra en pantalla.
  const [, setSavedItems] = useState<string[]>([])

  const cartItems = items.length > 0 ? items : mockCartItems
  const displaySubtotal = items.length > 0 ? subtotal : mockCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const shippingCost = displaySubtotal > 200 ? 0 : 15.00
  const giftWrapCost = giftWrap ? 12.00 : 0
  const discount = promoApplied ? displaySubtotal * 0.1 : 0
  const taxes = (displaySubtotal - discount) * 0.07
  const total = displaySubtotal - discount + shippingCost + giftWrapCost + taxes

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'yenyleths10') {
      setPromoApplied(true)
    }
  }

  const handleSaveForLater = (item: CartItem) => {
    setSavedItems((prev) => [...prev, item.product.id])
    removeItem(item.product.id, item.size, item.color)
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-[10px] ${i < Math.round(rating) ? 'text-gold' : 'text-brown/20'}`}
        >
          ★
        </span>
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
        <div className="flex items-center gap-3">
          <ShoppingCart size={28} className="text-brown" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-brown">Mi Carrito</h1>
            <p className="mt-0.5 text-sm text-brown/60">
              {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-24 text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
            <ShoppingBag size={40} className="text-gold" />
          </div>
          <h2 className="font-serif text-2xl text-brown">Tu carrito está vacío</h2>
          <p className="mt-2 text-sm text-brown/50">
            Añade productos para comenzar tu compra.
          </p>
          <Link to="/category/women">
            <Button className="mt-6 gap-2 bg-brown text-cream hover:bg-brown/90">
              <Sparkles size={16} />
              Explorar productos
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div>
            <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="group rounded-2xl border border-brown/8 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-beige sm:h-36 sm:w-28">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wider text-brown/40">
                                {item.product.brand}
                              </p>
                              <Link to={`/product/${item.product.slug}`}>
                                <h3 className="mt-0.5 font-serif text-sm font-semibold text-brown hover:text-gold-dark transition-colors sm:text-base">
                                  {item.product.name}
                                </h3>
                              </Link>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.product.id, item.size, item.color)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-brown/30 transition-colors hover:bg-red-50 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>

                          <div className="mt-1 flex items-center gap-3">
                            {renderStars(item.product.rating)}
                            <span className="text-[10px] text-brown/40">({item.product.reviewsCount})</span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-brown/60">
                            <span className="rounded-full bg-beige px-2.5 py-0.5">Talla: {item.size}</span>
                            <span className="rounded-full bg-beige px-2.5 py-0.5">Color: {item.color}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center rounded-full border border-brown/15">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-brown/60 transition-colors hover:bg-beige disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-8 text-center text-sm font-semibold text-brown">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-brown/60 transition-colors hover:bg-beige"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-brown sm:text-lg">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            {item.product.oldPrice && (
                              <span className="text-xs text-brown/40 line-through">
                                {formatPrice(item.product.oldPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Save for Later */}
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="mt-2 flex items-center gap-1 text-[11px] text-brown/40 transition-colors hover:text-gold-dark"
                        >
                          <Bookmark size={12} />
                          Guardar para después
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Clear Cart */}
            <div className="mt-6 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="gap-2 text-brown/50 hover:text-red-400"
              >
                <Trash2 size={14} />
                Vaciar carrito
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-8 lg:self-start"
          >
            <div className="rounded-2xl border border-brown/8 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-brown">Resumen del Pedido</h2>

              {/* Subtotal */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-brown/70">
                  <span>Subtotal</span>
                  <span className="font-medium text-brown">{formatPrice(displaySubtotal)}</span>
                </div>
                <div className="flex justify-between text-brown/70">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} />
                    Envío estimado
                  </span>
                  <span className="font-medium text-brown">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between text-brown/70">
                    <span className="flex items-center gap-1.5">
                      <Gift size={14} />
                      Envoltorio de regalo
                    </span>
                    <span className="font-medium text-brown">{formatPrice(giftWrapCost)}</span>
                  </div>
                )}
                {promoApplied && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Descuento (10%)</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between text-brown/70">
                  <span>Impuestos (7%)</span>
                  <span className="font-medium text-brown">{formatPrice(taxes)}</span>
                </div>
                <div className="border-t border-brown/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-brown">Total</span>
                    <span className="text-xl font-bold text-brown">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-5">
                <label className="mb-2 block text-xs font-medium text-brown/60">Código de descuento</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
                    <input
                      type="text"
                      placeholder="Ej: YENYLETHS10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-3 text-xs text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                    className="rounded-xl bg-brown px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-brown/90 disabled:opacity-50"
                  >
                    {promoApplied ? '✓' : 'Aplicar'}
                  </motion.button>
                </div>
                {promoApplied && (
                  <p className="mt-1.5 text-[11px] text-green-600">¡Código aplicado! 10% de descuento</p>
                )}
              </div>

              {/* Gift Wrapping */}
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-brown/10 p-3 transition-colors hover:bg-beige">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-brown/20 transition-colors peer-checked:border-gold peer-checked:bg-gold">
                    {giftWrap && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-gold" />
                  <div>
                    <p className="text-xs font-medium text-brown">Envoltorio de regalo</p>
                    <p className="text-[10px] text-brown/40">+{formatPrice(12)} por artículo</p>
                  </div>
                </div>
              </label>

              {/* Notes */}
              <div className="mt-4">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-brown/60">
                  <StickyNote size={12} />
                  Notas para el pedido
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones especiales, dirección de envío, etc."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-brown/15 bg-beige px-4 py-2.5 text-xs text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="mt-5 block">
                <Button className="w-full gap-2 bg-brown text-cream hover:bg-brown/90" size="lg">
                  Proceder al pago
                  <ArrowRight size={16} />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-brown/10 pt-5">
                <div className="text-center">
                  <Truck size={18} className="mx-auto text-gold" />
                  <p className="mt-1 text-[9px] font-medium text-brown/50">Envío gratis +$200</p>
                </div>
                <div className="text-center">
                  <Shield size={18} className="mx-auto text-gold" />
                  <p className="mt-1 text-[9px] font-medium text-brown/50">Pago 100% seguro</p>
                </div>
                <div className="text-center">
                  <RotateCcw size={18} className="mx-auto text-gold" />
                  <p className="mt-1 text-[9px] font-medium text-brown/50">Devolución 30 días</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Recommended Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-gold" />
          <h2 className="font-serif text-2xl font-bold text-brown">También te puede gustar</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {recommendedProducts.map((product) => (
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
                <button
                  onClick={() => toggle(product.id, product.name)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gold shadow-sm backdrop-blur-sm transition-colors hover:text-gold-dark"
                >
                  <Heart size={14} />
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
    </div>
  )
}
