import { CartProvider } from '@/context/CartContext'
import { useCart } from '@/context/useCart'
import { LoginDemo } from '@/features/auth/LoginDemo'
import { ProductCatalog } from '@/features/product-catalog/ProductCatalog'
import { ShoppingCart } from '@/features/shopping-cart/ShoppingCart'

function Header() {
  const { itemCount } = useCart()

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Simple Product Shop
        </h1>
        <div className="flex items-center gap-6">
          <details className="group relative">
            <summary className="cursor-pointer list-none rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              Login demo
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-[22rem] max-w-[90vw]">
              <LoginDemo />
            </div>
          </details>
          <div
            role="img"
            aria-label={`Cart with ${itemCount} items`}
            className="relative text-gray-900 dark:text-gray-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

function Shop() {
  const { addItem } = useCart()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProductCatalog onAddToCart={addItem} />
        </div>
        <aside className="lg:sticky lg:top-6 lg:col-span-2 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <ShoppingCart />
        </aside>
      </main>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  )
}

export default App
