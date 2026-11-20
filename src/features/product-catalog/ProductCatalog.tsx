import { products } from '@/shared/data/products'
import type { Product } from '@/shared/types'
import { ProductCard } from './components/ProductCard'

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}
