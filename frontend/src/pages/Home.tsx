import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeroSlideshow } from '../components/home/HeroSlideshow'
import { FeaturedCategories } from '../components/home/FeaturedCategories'
import { ProductCarousel } from '../components/home/ProductCarousel'
import { FlashSale } from '../components/home/FlashSale'
import { Testimonials } from '../components/home/Testimonials'
import { InstagramGallery } from '../components/home/InstagramGallery'
import { QuickViewModal } from '../components/product/QuickViewModal'
import { useAllProducts } from '../context/ProductsContext'
import type { Product } from '../types'

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { products } = useAllProducts()

  const newArrivals = products.filter((p) => p.isNew).slice(0, 8)
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8)
  const trending = products.filter((p) => p.isTrending).slice(0, 8)
  const flashSale = products.filter((p) => p.oldPrice).slice(0, 4)

  return (
    <div id="catalogo">
      <Helmet>
        <title>Yenyleths Boutique - Moda Premium</title>
        <meta name="description" content="Descubre la colección exclusiva de Yenyleths Boutique. Moda premium, accesorios y más. Envíos a todo Panamá." />
        <meta property="og:title" content="Yenyleths Boutique - Moda Premium" />
        <meta property="og:description" content="Descubre la colección exclusiva de Yenyleths Boutique." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <HeroSlideshow />
      </div>

      <FeaturedCategories />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ProductCarousel
          id="nuevos"
          title="Nuevos ingresos"
          subtitle="Lo más reciente de la temporada"
          products={newArrivals}
          onQuickView={setQuickViewProduct}
        />
        <FlashSale products={flashSale} onQuickView={setQuickViewProduct} />
        <ProductCarousel
          id="vendidos"
          title="Más vendidos"
          subtitle="Los favoritos de nuestras clientas"
          products={bestSellers}
          onQuickView={setQuickViewProduct}
        />
        <ProductCarousel
          id="tendencias"
          title="Tendencias"
          subtitle="Lo que todos están usando"
          products={trending}
          onQuickView={setQuickViewProduct}
        />
      </div>

      <Testimonials />
      <InstagramGallery />

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
            No encuentra lo que busca? Le acompañamos
          </p>
          <a
            href="https://wa.me/50763776327"
            target="_blank"
            rel="noreferrer"
            className="plate bg-market text-paper-elevated hover:bg-market-deep"
            style={{ borderColor: 'transparent' }}
          >
            Escríbanos por WhatsApp
          </a>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}