import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import toast from 'react-hot-toast'

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  subtotal: number
  itemCount: number
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (product: Product, size: string, color: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      )
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { product, size, color, quantity }]
    })
    toast.success(`${product.name} añadido al carrito`)
    setIsOpen(true)
  }

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size && item.color === color))
    )
  }

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const clearCart = () => setItems([])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        subtotal,
        itemCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
