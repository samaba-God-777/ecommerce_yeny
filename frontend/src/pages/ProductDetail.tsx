import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Heart, Truck, ShieldCheck, RotateCcw, Star, Send, User } from 'lucide-react'
import { useAllProducts } from '../context/ProductsContext'
import { formatPrice } from '../lib/format'
import { Rating } from '../components/ui/Rating'
import { ProductCard } from '../components/product/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

const defaultReviews: Review[] = [
  {
    id: '1',
    author: 'Sofía R.',
    rating: 5,
    comment: 'Calidad excepcional, llegó perfecto y el empaque se sintió de verdad premium. Totalmente recomendado.',
    date: '2026-06-15'
  },
  {
    id: '2',
    author: 'Carlos M.',
    rating: 4,
    comment: 'Muy bonito producto, tal como se ve en la foto. El envío fue rápido.',
    date: '2026-06-10'
  },
  {
    id: '3',
    author: 'Valentina G.',
    rating: 5,
    comment: 'Amé este producto! La talla quedó perfecta y el material es de muy buena calidad.',
    date: '2026-06-05'
  }
]

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useAllProducts()
  const product = useMemo(() => slug ? products.find((p) => p.slug === slug) : undefined, [slug, products])
  const related = useMemo(() => product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [], [product, products])
  const { addItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<string | undefined>(product?.sizes[0])
  const [color, setColor] = useState<string | undefined>(product?.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'shipping' | 'reviews'>('description')

  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (product) {
      const savedReviews = localStorage.getItem(`reviews_${product.id}`)
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      } else {
        setReviews(defaultReviews)
        localStorage.setItem(`reviews_${product.id}`, JSON.stringify(defaultReviews))
      }
    }
  }, [product?.id])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.author.trim() || !newReview.comment.trim()) return

    const review: Review = {
      id: Date.now().toString(),
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedReviews = [review, ...reviews]
    setReviews(updatedReviews)
    if (product) {
      localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updatedReviews))
    }
    setNewReview({ author: '', rating: 5, comment: '' })
    setShowForm(false)
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  if (!product) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Helmet>
        <title>{product.name} - Yenyleths Boutique</title>
        <meta name="description" content={`${product.name} - ${product.description?.slice(0, 160)}`} />
        <meta property="og:title" content={`${product.name} - Yenyleths Boutique`} />
        <meta property="og:description" content={product.description?.slice(0, 200)} />
        <meta property="og:image" content={product.images?.[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      <nav className="mb-6 font-mono text-xs text-ink-soft">
        <Link to="/" className="transition-colors hover:text-market">Inicio</Link> <span className="mx-1 text-line-strong">/</span> <Link to={`/category/${product.category}`} className="transition-colors hover:text-market">{product.category}</Link> <span className="mx-1 text-line-strong">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-xl border border-line bg-beige"
          >
            <img src={product.images[activeImage]} alt={product.name} className="aspect-[3/4] w-full object-cover" loading="eager" decoding="async" />
          </motion.div>
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`overflow-hidden rounded-md border-2 ${activeImage === i ? 'border-market' : 'border-line'}`}
              >
                <img src={img} alt="" className="h-20 w-16 object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{product.name}</h1>
          <div className="mt-2"><Rating value={product.rating} count={product.reviewsCount} size={16} /></div>
          <div className="mt-4 flex items-center gap-3">
            <span className="money text-3xl font-bold text-market-deep">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="money text-lg text-ink-soft/60 line-through">{formatPrice(product.oldPrice)}</span>}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Color</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-market' : 'border-line-strong'}`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Talla</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-10 w-10 rounded-full border font-mono text-sm transition-colors ${size === s ? 'border-market bg-market text-paper-elevated' : 'border-line hover:border-market'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button className="px-3 py-2 text-ink" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Reducir">−</button>
              <span className="w-8 text-center font-mono">{quantity}</span>
              <button className="px-3 py-2 text-ink" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar">+</button>
            </div>
            <button
              onClick={() => addItem(product, size ?? product.sizes[0], color ?? product.colors[0], quantity)}
              className="flex-1 bg-market py-3 font-bold text-paper-elevated transition hover:bg-market-deep"
            >
              Añadir al carrito
            </button>
            <button
              onClick={() => toggle(product.id, product.name)}
              aria-label="Favorito"
              className="rounded-full border border-line-strong p-3 text-ink transition-colors hover:border-market"
            >
              <Heart size={20} className={isWishlisted(product.id) ? 'fill-market text-market' : ''} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-ink-soft">
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-paper-elevated py-3"><Truck size={20} className="text-market" /> Envío gratis</div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-paper-elevated py-3"><RotateCcw size={20} className="text-market" /> 30 días devolución</div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-paper-elevated py-3"><ShieldCheck size={20} className="text-market" /> Pago seguro</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-line">
          {(['description', 'shipping', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                tab === t ? 'border-b-2 border-market text-ink' : 'text-ink-soft/60 hover:text-ink'
              }`}
            >
              {t === 'description' ? 'Descripción' : t === 'shipping' ? 'Envío' : `Reseñas (${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="py-6 text-sm leading-relaxed text-ink-soft">
          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'shipping' && <p>Envío gratuito en pedidos superiores a $80. Entrega estimada de 3 a 5 días hábiles.</p>}

          {tab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 rounded-xl border border-line bg-paper-elevated p-5">
                <div className="text-center">
                  <p className="money text-4xl font-bold text-ink">{averageRating.toFixed(1)}</p>
                  <div className="mt-1 flex gap-0.5">
                    <Rating value={averageRating} size={16} />
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{reviews.length} reseñas</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter(r => r.rating === stars).length
                    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={stars} className="flex items-center gap-2 font-mono text-xs">
                        <span className="w-8 text-ink">{stars}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-beige">
                          <div className="h-full bg-market" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-8 text-right text-ink-soft">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="rounded-md border border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper-elevated"
              >
                {showForm ? 'Cancelar' : 'Escribir una reseña'}
              </button>

              {showForm && (
                <form onSubmit={handleSubmitReview} className="space-y-4 rounded-xl border border-line bg-paper p-5">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-ink">Tu nombre</label>
                    <input
                      type="text"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      placeholder="Ej: María G."
                      required
                      className="w-full border border-input bg-background px-4 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-market"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-ink">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: s })}
                          aria-label={`${s} estrellas`}
                          className="text-ink"
                        >
                          <Star size={24} className={s <= newReview.rating ? 'fill-market text-market' : 'text-line-strong hover:text-market'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-ink">Tu comentario</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Cuéntanos tu experiencia con este producto..."
                      required
                      rows={4}
                      className="w-full resize-none border border-line bg-background px-4 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-market"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-market px-4 py-2 text-sm font-bold text-paper-elevated transition-colors hover:bg-market-deep"
                  >
                    <Send size={16} />
                    Publicar reseña
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-ink-soft">No hay reseñas aún. Sé el primero en comentar!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-line bg-paper-elevated p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-beige">
                            <User size={18} className="text-ink-soft" />
                          </div>
                          <div>
                            <p className="font-bold text-ink">{review.author}</p>
                            <div className="flex items-center gap-2">
                              <Rating value={review.rating} size={12} />
                              <span className="font-mono text-[11px] text-ink-soft">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-ink-soft">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 border-b border-line pb-3 text-2xl font-black tracking-tight">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}