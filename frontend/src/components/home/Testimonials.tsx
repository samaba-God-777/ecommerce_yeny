import { motion } from 'framer-motion'
import { reviews } from '../../data/products'
import { Rating } from '../ui/Rating'

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="h-2 w-10 bg-ink" aria-hidden="true" />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-b-2 border-ink pb-1 text-center font-display text-3xl font-extrabold uppercase tracking-[-0.01em]"
        >
          Lo que dicen nuestras clientas
        </motion.h2>
        <div className="h-2 w-10 bg-ink" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="border-2 border-line bg-paper-elevated p-6"
          >
            <Rating value={review.rating} />
            <p className="mt-4 font-display text-xl font-semibold uppercase leading-tight text-ink tracking-wide">“{review.comment}”</p>
            <div className="mt-5 flex items-center gap-3 border-t-2 border-ink pt-4">
              <img src={review.avatar} alt={review.author} className="h-9 w-9 border-2 border-ink object-cover" />
              <span className="font-mono text-sm font-semibold text-ink">{review.author}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}