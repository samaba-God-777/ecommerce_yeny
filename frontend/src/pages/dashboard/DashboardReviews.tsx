import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Camera,
  Send,
  Edit3,
  Trash2,
  MessageSquare,
  Package,
  ChevronDown,
  X,
  Check,
  Image as ImageIcon,
} from 'lucide-react'

type TabId = 'write' | 'reviews'

interface PurchasedProduct {
  id: string
  name: string
  image: string
  brand: string
  price: number
  reviewDate?: string
}

interface ExistingReview {
  id: string
  product: PurchasedProduct
  rating: number
  text: string
  date: string
  images: string[]
}

const purchasedProducts: PurchasedProduct[] = [
  {
    id: 'p1',
    name: 'Conjunto Deportivo Crop Top y Falda Azul Marino',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    brand: 'Yenyleths',
    price: 89.99,
  },
  {
    id: 'p2',
    name: 'Crop Top Selección Argentina',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop',
    brand: 'Velora',
    price: 65.0,
  },
  {
    id: 'p3',
    name: 'Jersey Retro Alemania Adidas',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    brand: 'Nórdiq',
    price: 75.0,
  },
  {
    id: 'p4',
    name: 'Conjunto Blazer y Pantalón Plisado',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    brand: 'Maison Lux',
    price: 120.0,
  },
]

const existingReviews: ExistingReview[] = [
  {
    id: 'r1',
    product: purchasedProducts[0],
    rating: 5,
    text: '¡Excelente calidad! El conjunto quedó perfecto, la tela es muy cómoda y el color es tal cual la foto. Muy recomendado.',
    date: '28 May 2026',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop'],
  },
  {
    id: 'r2',
    product: purchasedProducts[2],
    rating: 4,
    text: 'Muy buen jersey, la talla es correcta. El único detalle es que el estampado podría ser un poco más resistente.',
    date: '15 May 2026',
    images: [],
  },
  {
    id: 'r3',
    product: purchasedProducts[3],
    rating: 5,
    text: 'Una prenda preciosa, perfecta para ocasiones especiales. El corte es impecable y los materiales se sienten de lujo.',
    date: '2 May 2026',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop'],
  },
]

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            size={20}
            className={
              s <= (interactive ? hover || rating : rating)
                ? 'fill-gold text-gold'
                : 'fill-transparent text-brown/20'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default function DashboardReviews() {
  const [activeTab, setActiveTab] = useState<TabId>('write')
  const [selectedProduct, setSelectedProduct] = useState<PurchasedProduct | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showProductList, setShowProductList] = useState(true)
  const [reviews, setReviews] = useState(existingReviews)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const productsWithoutReview = purchasedProducts.filter(
    (p) => !reviews.some((r) => r.product.id === p.id)
  )

  const handleSelectProduct = (product: PurchasedProduct) => {
    setSelectedProduct(product)
    setShowProductList(false)
    setRating(0)
    setReviewText('')
    setUploadedImages([])
    setSubmitted(false)
  }

  const handleSubmit = () => {
    if (!selectedProduct || rating === 0) return
    const newReview: ExistingReview = {
      id: `r${Date.now()}`,
      product: selectedProduct,
      rating,
      text: reviewText,
      date: 'Ahora',
      images: uploadedImages,
    }
    setReviews((prev) => [newReview, ...prev])
    setSubmitted(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setShowProductList(true)
      setSubmitted(false)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const handleEdit = (review: ExistingReview) => {
    setEditingId(review.id)
  }

  const handleSaveEdit = (id: string) => {
    setEditingId(null)
  }

  const tabs: { id: TabId; label: string; icon: typeof Star }[] = [
    { id: 'write', label: 'Escribir Reseña', icon: MessageSquare },
    { id: 'reviews', label: 'Mis Reseñas', icon: Star },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-serif text-3xl text-brown">Mis Reseñas</h1>
        <p className="mb-8 text-sm text-brown/50">Comparte tu experiencia con otros clientes.</p>
      </motion.div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              if (tab.id === 'write') {
                setShowProductList(true)
                setSelectedProduct(null)
              }
            }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-white shadow-md shadow-gold/25'
                : 'bg-beige text-brown/60 hover:bg-gold/10 hover:text-gold-dark'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'write' && (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {showProductList && !submitted && (
              <div>
                <h2 className="mb-4 font-serif text-lg text-brown">Selecciona un producto para reseñar</h2>
                {productsWithoutReview.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={48} className="mx-auto mb-4 text-brown/20" />
                    <p className="text-brown/50">Ya has reseñado todos tus productos.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productsWithoutReview.map((product, i) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => handleSelectProduct(product)}
                        className="flex w-full items-center gap-4 rounded-xl border border-brown/10 bg-white p-4 text-left transition-all hover:border-gold hover:shadow-md hover:shadow-gold/10"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-brown/50">{product.brand}</p>
                          <p className="truncate text-sm font-medium text-brown">{product.name}</p>
                          <p className="mt-1 text-sm font-semibold text-gold-dark">${product.price.toFixed(2)}</p>
                        </div>
                        <MessageSquare size={18} className="shrink-0 text-gold" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="mb-2 font-serif text-xl text-brown">¡Reseña enviada!</h2>
                <p className="text-sm text-brown/50">Gracias por compartir tu experiencia.</p>
              </motion.div>
            )}

            {selectedProduct && !showProductList && !submitted && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-brown/10 bg-white p-6"
              >
                <div className="mb-6 flex items-center gap-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs text-brown/50">{selectedProduct.brand}</p>
                    <p className="font-medium text-brown">{selectedProduct.name}</p>
                    <p className="mt-1 text-sm font-semibold text-gold-dark">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-brown">Calificación</label>
                  <StarRating rating={rating} onRate={setRating} interactive />
                  {rating > 0 && (
                    <p className="mt-2 text-xs text-brown/50">
                      {rating === 1 && 'Muy malo'}
                      {rating === 2 && 'Malo'}
                      {rating === 3 && 'Regular'}
                      {rating === 4 && 'Bueno'}
                      {rating === 5 && 'Excelente'}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-brown">Tu reseña</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Cuéntanos tu experiencia con este producto..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-brown/15 px-4 py-3 text-sm text-brown placeholder-brown/30 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-brown">Fotos (opcional)</label>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="" className="h-20 w-20 rounded-lg object-cover" />
                        <button
                          onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setUploadedImages((prev) => [
                          ...prev,
                          `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop&t=${Date.now()}`,
                        ])
                      }
                      className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-brown/20 text-brown/30 transition-colors hover:border-gold hover:text-gold"
                    >
                      <Camera size={20} />
                      <span className="mt-1 text-[10px]">Agregar</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gold-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={14} />
                    Enviar reseña
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setShowProductList(true)
                    }}
                    className="rounded-full border border-brown/15 px-6 py-2.5 text-sm font-medium text-brown/60 transition-colors hover:bg-beige"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {reviews.length === 0 ? (
              <div className="py-16 text-center">
                <Star size={48} className="mx-auto mb-4 text-brown/20" />
                <p className="text-brown/50">Aún no has escrito ninguna reseña.</p>
              </div>
            ) : (
              reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-brown/10 bg-white p-5"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.product.image}
                      alt={review.product.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-brown/50">{review.product.brand}</p>
                          <p className="text-sm font-medium text-brown">{review.product.name}</p>
                        </div>
                        <span className="shrink-0 text-xs text-brown/40">{review.date}</span>
                      </div>

                      <div className="mt-2">
                        <StarRating rating={review.rating} />
                      </div>

                      {editingId === review.id ? (
                        <div className="mt-3">
                          <textarea
                            defaultValue={review.text}
                            rows={3}
                            className="w-full resize-none rounded-xl border border-brown/15 px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(review.id)}
                              className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-dark"
                            >
                              <Check size={12} /> Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-full border border-brown/15 px-3 py-1.5 text-xs font-medium text-brown/60 hover:bg-beige"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-brown/70">{review.text}</p>
                      )}

                      {review.images.length > 0 && !editingId && (
                        <div className="mt-3 flex gap-2">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}

                      {!editingId && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="flex items-center gap-1 rounded-full border border-brown/10 px-3 py-1.5 text-xs font-medium text-brown/50 transition-colors hover:border-gold hover:text-gold-dark"
                          >
                            <Edit3 size={12} /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="flex items-center gap-1 rounded-full border border-brown/10 px-3 py-1.5 text-xs font-medium text-brown/50 transition-colors hover:border-red-300 hover:text-red-500"
                          >
                            <Trash2 size={12} /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
