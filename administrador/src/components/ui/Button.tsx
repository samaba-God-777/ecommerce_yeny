import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const variants = {
      primary: 'bg-ink text-primary-foreground hover:bg-market shadow-sm hover:shadow-md focus-visible:ring-market',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-market-deep shadow-sm hover:shadow-md focus-visible:ring-market',
      outline: 'border-2 border-line-strong text-ink-soft hover:border-market hover:text-market focus-visible:ring-market',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-market-deep shadow-sm hover:shadow-md focus-visible:ring-destructive',
      ghost: 'text-foreground hover:bg-muted focus-visible:ring-ring'
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5'
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button