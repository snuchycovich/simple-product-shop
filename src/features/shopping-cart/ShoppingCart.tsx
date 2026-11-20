import { useCart } from '@/context/useCart'
import { CartItem, CartSummary } from './components'

export function ShoppingCart() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    discountBreakdown,
    updateQuantity,
    removeItem,
  } = useCart()

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Shopping Cart
        </h2>
        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-sm font-semibold text-white">
          {itemCount}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-8 text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12"
          >
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
          </svg>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.product.id}>
                <CartItem
                  item={item}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.product.id, quantity)
                  }
                  onRemove={() => removeItem(item.product.id)}
                />
              </li>
            ))}
          </ul>
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            total={total}
            itemCount={itemCount}
            discountBreakdown={discountBreakdown}
          />
        </>
      )}
    </section>
  )
}
