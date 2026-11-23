import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { UI_TEXT } from '@/shared/constants/ui'
import type { DiscountBreakdown } from '@/shared/strategies/DiscountCalculator'
import { formatPercent, formatPrice } from '@/shared/utils'

const { MIN_SUBTOTAL, RATE } = BUSINESS_RULES.ORDER_DISCOUNT

interface CartSummaryProps {
  subtotal: number
  discount: number
  total: number
  itemCount: number
  discountBreakdown: DiscountBreakdown[]
}

export function CartSummary({
  subtotal,
  total,
  discountBreakdown,
}: CartSummaryProps) {
  const orderDiscountApplied = discountBreakdown.some(
    ({ name }) => name === UI_TEXT.orderDiscount,
  )
  const showPromo = !orderDiscountApplied && total < MIN_SUBTOTAL

  return (
    <div className="rounded-lg bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountBreakdown.map(({ name, amount }) => (
          <div
            key={name}
            className="flex justify-between text-green-700 dark:text-green-400"
          >
            <span>{name}</span>
            <span>-{formatPrice(amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between border-t border-gray-300 pt-3 text-xl font-bold dark:border-gray-600">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {showPromo && (
        <p className="mt-3 rounded bg-amber-100 p-2 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          {`Add ${formatPrice(MIN_SUBTOTAL - total)} more for ${formatPercent(RATE)} off!`}
        </p>
      )}

      <button
        type="button"
        className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        {UI_TEXT.checkout}
      </button>
    </div>
  )
}
