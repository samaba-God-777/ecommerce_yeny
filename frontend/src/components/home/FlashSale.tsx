import { useEffect, useState } from 'react'
import type { Product } from '../../types'
import { ProductCard } from '../product/ProductCard'

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
  }
}

export function FlashSale({ products, onQuickView }: { products: Product[]; onQuickView: (p: Product) => void }) {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 8)
  const [time, setTime] = useState(getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <section className="mx-auto py-14">
      <div className="relative mb-8 overflow-hidden border-2 border-ink">
        <div className="hazard absolute inset-0 opacity-90" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 bg-paper px-6 py-4">
          <div className="flex items-center gap-3 bg-ink px-3 py-1.5 text-paper-elevated">
            <span className="h-1.5 w-6 bg-market" aria-hidden="true" />
            <h2 className="q font-display text-2xl font-extrabold uppercase tracking-[0.02em]">Remate del día</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-lg text-ink">
            <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">Quedan</span>
            {[time.h, time.m, time.s].map((unit, i) => (
              <span key={i} className="border-2 border-ink bg-paper-elevated px-2.5 py-1 font-bold text-ink">
                {String(unit).padStart(2, '0')}
                {i < 2 && <span className="mx-1 text-ink/40">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-ink-soft">No hay ofertas vigentes en este momento.</p>
      )}
    </section>
  )
}