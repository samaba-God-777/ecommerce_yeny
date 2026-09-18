import type { Product, Review } from '../types'
import { categoryImages } from './productImages'

const colors = ['#2E1C15', '#C8A75A', '#FFFFFF', '#1A1A1A', '#8B5E3C']
const sizes = ['XS', 'S', 'M', 'L', 'XL']

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface RealProductSeed {
  name: string
  brand: string
  category: string
  image: string
  sizes: string[]
}

const realProductSeeds: RealProductSeed[] = [
  { name: 'Conjunto Deportivo Crop Top y Falda Azul Marino', brand: 'Yenyleths', category: 'women', image: categoryImages.women[0], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { name: 'Conjunto Deportivo Crop Top y Falda Verde Jade', brand: 'Yenyleths', category: 'women', image: categoryImages.women[1], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { name: 'Conjunto Blazer y Pantalón Plisado', brand: 'Maison Lux', category: 'women', image: categoryImages.women[2], sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Top de Tul Floral y Falda Satinada', brand: 'Maison Lux', category: 'women', image: categoryImages.women[3], sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Crop Top Selección Argentina', brand: 'Velora', category: 'women', image: categoryImages.women[4], sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Crop Top Selección Portugal', brand: 'Velora', category: 'women', image: categoryImages.women[5], sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Crop Top Selección Brasil', brand: 'Velora', category: 'women', image: categoryImages.women[6], sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Crop Top Selección Portugal Edición Negra', brand: 'Velora', category: 'women', image: categoryImages.women[7], sizes: ['S', 'M', 'L', 'XL'] },

  { name: 'Jersey Retro Alemania Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[0], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Selección Brasil Nike', brand: 'Nórdiq', category: 'men', image: categoryImages.men[0], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Selección Colombia Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[1], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey España Retro Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[2], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Alemania Clásico Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[3], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Selección USA Nike', brand: 'Nórdiq', category: 'men', image: categoryImages.men[4], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Selección Jamaica Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[5], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Selección España Adidas', brand: 'Nórdiq', category: 'men', image: categoryImages.men[7], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Noruega Nike', brand: 'Nórdiq', category: 'men', image: categoryImages.men[8], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Inglaterra Nike', brand: 'Nórdiq', category: 'men', image: categoryImages.men[9], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Jersey Brasil Jordan Edición Especial', brand: 'Nórdiq', category: 'men', image: categoryImages.men[10], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Pantalón Chino Slim Fit', brand: 'Zaire', category: 'men', image: categoryImages.men[12], sizes: ['32', '34', '36', '38', '40', '42', '44'] },

  { name: 'Crocs Edición Winnie Pooh', brand: 'Crocs', category: 'kids', image: categoryImages.kids[0], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Minecraft', brand: 'Crocs', category: 'kids', image: categoryImages.kids[1], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Moana', brand: 'Crocs', category: 'kids', image: categoryImages.kids[2], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Stitch', brand: 'Crocs', category: 'kids', image: categoryImages.kids[3], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Akatsuki', brand: 'Crocs', category: 'kids', image: categoryImages.kids[4], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Pokémon', brand: 'Crocs', category: 'kids', image: categoryImages.kids[5], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Edición Batman', brand: 'Crocs', category: 'kids', image: categoryImages.kids[6], sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'] },

  { name: 'Set Botines y Botas de Cuero', brand: 'Zaire', category: 'shoes', image: categoryImages.shoes[0], sizes: ['32', '34', '36', '38', '40', '42', '44'] },
  { name: 'Crocs Clásicas Negras Unisex', brand: 'Crocs', category: 'sneakers', image: categoryImages.sneakers[0], sizes: ['32', '34', '36', '38', '40', '42', '44'] },
]

const placeholderSeeds = [
  { name: 'Abrigo de Lana Premium', category: 'leather-jackets', brand: 'Maison Lux' },
  { name: 'Bolso Tote Artesanal', category: 'bags', brand: 'Maison Lux' },
  { name: 'Reloj Cronógrafo Acero', category: 'watches', brand: 'Velora' },
  { name: 'Perfume Oud Royal', category: 'perfumes', brand: 'Velora' },
  { name: 'Lentes de Sol Aviador', category: 'sunglasses', brand: 'Zaire' },
  { name: 'Collar Cadena Oro 18k', category: 'jewelry', brand: 'Maison Lux' },
  { name: 'Cinturón Cuero Reversible', category: 'bags', brand: 'Zaire' },
  { name: 'Sérum Facial Iluminador', category: 'beauty', brand: 'Velora' },
  { name: 'Reloj Minimalista Oro Rosa', category: 'watches', brand: 'Maison Lux' },
  { name: 'Lentes de Sol Cat Eye', category: 'sunglasses', brand: 'Velora' },
  { name: 'Mochila Cuero Vintage', category: 'bags', brand: 'Zaire' },
  { name: 'Chaqueta de Cuero Italiana', category: 'leather-jackets', brand: 'Maison Lux' },
]

function seedPrice(i: number) {
  return Math.round((45 + (i * 37) % 360) * 1.0)
}

const realProducts: Product[] = realProductSeeds.map((seed, i) => {
  const price = seedPrice(i)
  const hasDiscount = i % 3 === 0
  return {
    id: String(i + 1),
    slug: `${slugify(seed.name)}-${i + 1}`,
    name: seed.name,
    brand: seed.brand,
    category: seed.category,
    price: hasDiscount ? Math.round(price * 0.75) : price,
    oldPrice: hasDiscount ? price : undefined,
    rating: 3.6 + ((i * 7) % 14) / 10,
    reviewsCount: 8 + (i * 13) % 240,
    images: [seed.image, seed.image, seed.image],
    colors: colors.slice(0, 2 + (i % 3)),
    sizes: seed.sizes,
    stock: 2 + (i * 5) % 30,
    isNew: i % 4 === 0,
    isBestSeller: i % 5 === 0,
    isTrending: i % 6 === 0,
    freeShipping: i % 2 === 0,
    description:
      'Pieza elaborada con materiales premium y atención artesanal al detalle. Diseñada para una silueta elegante y un confort excepcional durante todo el día, inspirada en las grandes casas de moda de lujo.',
  }
})

const placeholderProducts: Product[] = placeholderSeeds.map((seed, i) => {
  const idx = realProducts.length + i
  const price = seedPrice(idx)
  const hasDiscount = idx % 3 === 0
  return {
    id: String(idx + 1),
    slug: `${slugify(seed.name)}-${idx + 1}`,
    name: seed.name,
    brand: seed.brand,
    category: seed.category,
    price: hasDiscount ? Math.round(price * 0.75) : price,
    oldPrice: hasDiscount ? price : undefined,
    rating: 3.5 + ((idx * 7) % 15) / 10,
    reviewsCount: 8 + (idx * 13) % 240,
    images: [
      `https://picsum.photos/seed/prod-${idx}-a/900/1200`,
      `https://picsum.photos/seed/prod-${idx}-b/900/1200`,
      `https://picsum.photos/seed/prod-${idx}-c/900/1200`,
    ],
    colors: colors.slice(0, 2 + (idx % 3)),
    sizes: sizes.slice(0, 3 + (idx % 3)),
    stock: (idx * 5) % 30,
    isNew: idx % 4 === 0,
    isBestSeller: idx % 5 === 0,
    isTrending: idx % 6 === 0,
    freeShipping: idx % 2 === 0,
    description:
      'Pieza elaborada con materiales premium y atención artesanal al detalle. Diseñada para una silueta elegante y un confort excepcional durante todo el día, inspirada en las grandes casas de moda de lujo.',
  }
})

export const products: Product[] = [...realProducts, ...placeholderProducts]

export const reviews: Review[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  author: ['Sofía R.', 'Carlos M.', 'Valentina G.', 'Andrés P.', 'Camila T.', 'Diego L.'][i],
  rating: 4 + (i % 2),
  comment: 'Calidad excepcional, llegó perfecto y el empaque se sintió de verdad premium. Totalmente recomendado.',
  avatar: `https://i.pravatar.cc/150?img=${i + 12}`,
}))

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)
export const getRelatedProducts = (product: Product) =>
  products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
