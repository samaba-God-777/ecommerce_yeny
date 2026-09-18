import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  reload: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue>({
  products: [],
  loading: true,
  reload: async () => {},
})

export function useAllProducts() {
  return useContext(ProductsContext)
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { products, loading, reload } = useProducts()

  return (
    <ProductsContext.Provider value={{ products, loading, reload }}>
      {children}
    </ProductsContext.Provider>
  )
}
