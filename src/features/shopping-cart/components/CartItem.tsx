import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { UI_TEXT } from '@/shared/constants/ui'
import type { CartItem as CartItemType } from '@/shared/types'
import { calculateSubtotal, formatPrice } from '@/shared/utils'

const { MIN: MIN_QUANTITY } = BUSINESS_RULES.QUANTITY

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item

  return (
    <div className="@container">
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm @xl:flex-nowrap dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          width={64}
          height={64}
          loading="lazy"
          className="order-1 h-16 w-16 shrink-0 rounded object-cover"
        />

        <div className="order-2 min-w-0 flex-1 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPrice(product.price)}
          </p>
        </div>

        <button
          type="button"
          aria-label={UI_TEXT.removeFromCart(product.name)}
          onClick={onRemove}
          className="order-3 shrink-0 rounded p-1.5 text-red-600 hover:bg-red-50 @xl:order-5 dark:text-red-400 dark:hover:bg-red-950"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="order-4 flex w-full items-center justify-between gap-3 @xl:w-auto @xl:gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={quantity <= MIN_QUANTITY}
              className="h-8 w-8 rounded bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              −
            </button>
            <output
              aria-label={`Quantity of ${product.name}: ${quantity}`}
              className="w-8 text-center text-gray-900 dark:text-gray-100"
            >
              {quantity}
            </output>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="h-8 w-8 rounded bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              +
            </button>
          </div>

          <p className="min-w-20 text-right font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100">
            {formatPrice(calculateSubtotal([item]))}
          </p>
        </div>
      </div>
    </div>
  )
}
