import { ProductCatalog } from '@/features/product-catalog/ProductCatalog'
import { CartItem, CartSummary } from '@/features/shopping-cart/components'
import type { CartItem as CartItemType } from '@/shared/types'

// TEMPORARY: visual preview of cart components, remove in the next step
const previewItem: CartItemType = {
  product: {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://picsum.photos/seed/headphones/200',
    description: 'Over-ear Bluetooth headphones with noise cancellation.',
  },
  quantity: 2,
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Simple Product Shop
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <ProductCatalog
          onAddToCart={(product) => console.log('Add to cart:', product)}
        />

        <section className="mt-12 max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cart preview
          </h2>
          <CartItem
            item={previewItem}
            onUpdateQuantity={(quantity) =>
              console.log('Update quantity:', quantity)
            }
            onRemove={() => console.log('Remove item')}
          />
          <CartSummary
            subtotal={179.98}
            discount={26.99}
            total={152.99}
            itemCount={2}
          />
        </section>
      </main>
    </div>
  )
}

export default App
