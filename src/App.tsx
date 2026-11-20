import { ProductCatalog } from '@/features/product-catalog/ProductCatalog'

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
      </main>
    </div>
  )
}

export default App
