import { motion } from 'framer-motion'
import { FaInstagram } from 'react-icons/fa'

const FALLBACK = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7e6ed"/><stop offset="100%" stop-color="#e8a0bf"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/></svg>')

export function InstagramGallery() {
  const images = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/yenyleths-${i}/500/500`)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-2 w-10 bg-ink" aria-hidden="true" />
        <div className="flex-1 border-b-2 border-ink pb-1">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block font-display text-3xl font-extrabold uppercase tracking-[-0.01em] lg:text-4xl"
          >
            Síguenos
          </motion.h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">@yenyleths.store · en el taller</p>
        </div>
      </div>

      {/* Accordion rail: strips open like pieces pulled off the rack (desktop) */}
      <div className="hidden sm:flex h-[420px] gap-1.5">
        {images.map((src, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group relative flex-1 overflow-hidden border-2 border-line bg-paper transition-all duration-500 ease-in-out hover:grow-[2.2] focus-visible:grow-[2.2] hover:border-ink"
          >
            <img src={src} alt={`Instagram Yenyleths ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/55">
              <FaInstagram className="text-paper-elevated opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={24} />
              <span className="swing mt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">Pieza {i + 1}</span>
            </div>
            <div className="absolute inset-x-0 top-0 h-1.5 hazard opacity-0 transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true" />
          </motion.a>
        ))}
      </div>

      {/* mobile: standard grid */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        {images.map((src, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group relative overflow-hidden border-2 border-line"
          >
            <img src={src} alt={`Instagram Yenyleths ${i + 1}`} loading="lazy" decoding="async" className="aspect-square w-full object-cover" onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK }} />
          </motion.a>
        ))}
      </div>
    </section>
  )
}