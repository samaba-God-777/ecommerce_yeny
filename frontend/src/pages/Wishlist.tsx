import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAllProducts } from '../context/ProductsContext'
import { useWishlist } from '../context/WishlistContext'
import { ProductCard } from '../components/product/ProductCard'

export default function Wishlist() {
  const { ids } = useWishlist()
  const { products } = useAllProducts()
  const items = products.filter((p) => ids.has(p.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Helmet>
        <title>Mis Favoritos - Yenyleths Boutique</title>
        <meta name="description" content="Tus productos favoritos en Yenyleths Boutique." />
      </Helmet>
      <h1 className="mb-8 border-b border-line pb-4 text-3xl font-black tracking-tight">Mis Favoritos</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center text-ink-soft">
          <p>Aún no tienes productos favoritos.</p>
          <Link to="/category/women" className="mt-4 inline-block bg-market px-6 py-3 text-sm font-bold text-paper-elevated transition hover:bg-market-deep">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}