import { useState, useEffect } from 'react'
import { products as staticProducts } from '../data/products'
import { categories } from '../data/categories'
import { fetchApiProducts } from '../lib/api'
import { resolveProductImage } from '../data/productImages'
import type { Product } from '../types'

// Origen del backend para las imagenes subidas: sale del entorno igual que el
// API (lib/api.ts), quitando el /api final. Localhost queda para desarrollo.
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const colors = ['#2E1C15', '#C8A75A', '#FFFFFF', '#1A1A1A', '#8B5E3C']
const sizes = ['XS', 'S', 'M', 'L', 'XL']

export function useProducts() {
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const rawData = await fetchApiProducts()
      const mapped: Product[] = rawData.map((p) => {
        const cat = categories.find((c) => c.id === p.categoryId)
        const categorySlug = cat?.slug || 'women'

        // Resolver imagen: si es del API (/uploads/...) usar directamente, si no intentar resolver como estática
        let imagePath = p.image
        if (!imagePath.startsWith('/uploads')) {
          imagePath = resolveProductImage(p.image) || p.image
        }
        // Si es del API, agregar la URL base
        if (imagePath.startsWith('/uploads')) {
          imagePath = `${API_ORIGIN}${imagePath}`
        }

        return {
          id: `api-${p.id}`,
          slug: `${slugify(p.name)}-${p.id}`,
          name: p.name,
          brand: p.brand,
          category: categorySlug,
          price: p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price,
          oldPrice: p.isFlashSale && p.flashSalePrice ? p.price : (p.oldPrice || undefined),
          rating: p.rating,
          reviewsCount: 0,
          images: [imagePath],
          colors: colors.slice(0, 2),
          sizes,
          stock: p.stock,
          isNew: true,
          isBestSeller: p.isBestSeller || false,
          isTrending: false,
          freeShipping: p.price > 100,
          description: p.description,
        }
      })
      setApiProducts(mapped)
    } catch (err) {
      console.error('Error fetching API products:', err)
      setApiProducts([])
    } finally {
      setLoading(false)
    }
  }

  const allProducts = [...apiProducts, ...staticProducts]

  return { products: allProducts, loading, reload: loadProducts }
}
