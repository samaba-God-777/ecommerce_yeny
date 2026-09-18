import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { ProductCard } from '../product/ProductCard'

export function ProductCarousel({
  id,
  title,
  subtitle,
  products,
  onQuickView,
}: {
  id: string
  title: string
  subtitle?: string
  products: Product[]
  onQuickView: (p: Product) => void
}) {
  return (
    <section id={id} className="mx-auto py-14 lg:py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-2 w-10 bg-ink" aria-hidden="true" />
        <div className="flex-1 border-b-2 border-ink pb-1">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block font-display text-3xl font-extrabold uppercase tracking-[-0.01em] lg:text-4xl"
          >
            {title}
          </motion.h2>
          {subtitle && <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  )
}