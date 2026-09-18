import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const FALLBACK = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fce4ec"/><stop offset="100%" stop-color="#f8bbd0"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#g)"/></svg>')

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-white text-slate-900">
      <img
        src="https://picsum.photos/seed/hero-yenyleths/1600/1000"
        alt="Colección Yenyleths Boutique"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        loading="lazy"
        onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-pink-50/50" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-pink-600"
        >
          Nueva Colección 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-xl text-balance font-serif text-5xl font-bold leading-tight lg:text-7xl text-slate-900"
        >
          Lujo que se siente, estilo que perdura
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-md text-slate-600"
        >
          Descubre piezas exclusivas de moda, belleza y lifestyle diseñadas para quienes
          buscan elegancia sin esfuerzo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <Link
            to="/category/women"
            className="rounded-full bg-pink-600 hover:bg-pink-700 px-8 py-3.5 font-semibold text-white transition hover:shadow-lg"
          >
            Comprar Ahora
          </Link>
          <Link
            to="/category/new-collection"
            className="rounded-full border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3.5 font-semibold transition hover:border-pink-700"
          >
            Ver Colección
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
