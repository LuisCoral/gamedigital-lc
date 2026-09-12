import type { Product } from '../lib/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  emptyMessage?: string
}

export default function ProductGrid({ products, onAddToCart, emptyMessage }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-text-secondary text-sm py-10 text-center">
        {emptyMessage ?? 'No se encontraron juegos.'}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
