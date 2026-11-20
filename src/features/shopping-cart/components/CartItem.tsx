import type { CartItem as CartItemType } from '@/shared/types'
import { calculateSubtotal, formatPrice } from '@/shared/utils'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <img
        src={product.image}
        alt={product.name}
        width={64}
        height={64}
        loading="lazy"
        className="h-16 w-16 rounded object-cover"
      />

      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease quantity of ${product.name}`}
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          −
        </button>
        <span className="w-8 text-center text-gray-900 dark:text-gray-100">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Increase quantity of ${product.name}`}
          onClick={() => onUpdateQuantity(quantity + 1)}
          className="h-8 w-8 rounded bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-semibold text-gray-900 dark:text-gray-100">
        {formatPrice(calculateSubtotal([item]))}
      </p>

      <button
        type="button"
        aria-label={`Remove ${product.name} from cart`}
        onClick={onRemove}
        className="rounded px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
      >
        Remove
      </button>
    </div>
  )
}
