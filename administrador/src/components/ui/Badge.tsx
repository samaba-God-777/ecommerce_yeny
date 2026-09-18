interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-paper text-ink-soft border border-line-strong',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    gold: 'stamp text-market border-market/50 bg-market/5'
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}