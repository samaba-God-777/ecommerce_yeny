export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviewsCount: number
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  isNew?: boolean
  isBestSeller?: boolean
  isTrending?: boolean
  freeShipping?: boolean
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  avatar: string
}
