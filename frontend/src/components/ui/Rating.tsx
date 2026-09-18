import { Star } from 'lucide-react'

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? 'fill-market text-market' : 'fill-transparent text-line-strong'}
          />
        ))}
      </div>
      {count !== undefined && <span className="font-mono text-xs text-ink-soft">({count})</span>}
    </div>
  )
}
