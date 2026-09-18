import { createContext, useContext, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'

interface WishlistContextValue {
  ids: Set<string>
  toggle: (productId: string, productName?: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set())

  const toggle = (productId: string, productName?: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
        toast('Eliminado de favoritos')
      } else {
        next.add(productId)
        toast.success(`${productName ?? 'Producto'} añadido a favoritos`)
      }
      return next
    })
  }

  const isWishlisted = (productId: string) => ids.has(productId)

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
