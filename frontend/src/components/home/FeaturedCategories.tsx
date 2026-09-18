import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'

export function FeaturedCategories() {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-2 w-10 bg-ink" aria-hidden="true" />
        <div className="flex-1 border-b-2 border-ink pb-1">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block font-display text-3xl font-extrabold uppercase tracking-[-0.01em] lg:text-4xl"
          >
            Categorías
          </motion.h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">Elija su sección</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <Link to={`/category/${cat.slug}`} className="group block">
              <div className="relative overflow-hidden border-2 border-line bg-paper transition-colors group-hover:border-ink">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-paper">
                  <p className="q truncate px-2 py-1.5 text-center font-display text-sm font-bold uppercase tracking-[0.05em] text-ink">
                    {cat.name}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}