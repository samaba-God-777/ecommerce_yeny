import type { Category } from '../types'
import { categoryCoverImage } from './productImages'

export const categories: Category[] = [
  { id: '1', name: 'Mujer', slug: 'women', image: categoryCoverImage.women },
  { id: '2', name: 'Hombre', slug: 'men', image: categoryCoverImage.men },
  { id: '3', name: 'Niños', slug: 'kids', image: categoryCoverImage.kids },
  { id: '4', name: 'Zapatos', slug: 'shoes', image: categoryCoverImage.shoes },
  { id: '5', name: 'Sneakers', slug: 'sneakers', image: categoryCoverImage.sneakers },
  { id: '6', name: 'Chaquetas de Cuero', slug: 'leather-jackets', image: 'https://picsum.photos/seed/jackets-cat/600/800' },
  { id: '7', name: 'Bolsos', slug: 'bags', image: 'https://picsum.photos/seed/bags-cat/600/800' },
  { id: '8', name: 'Perfumes', slug: 'perfumes', image: 'https://picsum.photos/seed/perfumes-cat/600/800' },
  { id: '9', name: 'Joyería', slug: 'jewelry', image: 'https://picsum.photos/seed/jewelry-cat/600/800' },
  { id: '10', name: 'Relojes', slug: 'watches', image: 'https://picsum.photos/seed/watches-cat/600/800' },
  { id: '11', name: 'Lentes de Sol', slug: 'sunglasses', image: 'https://picsum.photos/seed/sunglasses-cat/600/800' },
  { id: '12', name: 'Belleza', slug: 'beauty', image: 'https://picsum.photos/seed/beauty-cat/600/800' },
]

export const allCategoryNames = [
  'Women', 'Men', 'Kids', 'Girls', 'Boys', 'Shoes', 'Sneakers', 'Sportswear',
  'Leather Jackets', 'Jeans', 'T-Shirts', 'Sweaters', 'Hoodies', 'Pants',
  'Shorts', 'Shirts', 'Formal Wear', 'Casual Wear', 'Perfumes', 'Cosmetics',
  'Beauty', 'Accessories', 'Bags', 'Wallets', 'Belts', 'Caps', 'Jewelry',
  'Watches', 'Sunglasses', 'Sports Accessories', 'Underwear', 'Sleepwear',
  'Winter Collection', 'Summer Collection', 'New Collection', 'Sale',
]
