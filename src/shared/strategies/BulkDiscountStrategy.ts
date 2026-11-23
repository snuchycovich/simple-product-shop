import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { UI_TEXT } from '@/shared/constants/ui'
import type { CartItem } from '@/shared/types'
import { calculateBulkDiscount, formatPercent } from '@/shared/utils'
import type { DiscountStrategy } from './DiscountStrategy'

const { MIN_QUANTITY, RATE } = BUSINESS_RULES.BULK_DISCOUNT

export class BulkDiscountStrategy implements DiscountStrategy {
  name = UI_TEXT.bulkDiscount
  description = `${formatPercent(RATE)} off products with ${MIN_QUANTITY}+ units`

  isApplicable(items: CartItem[]): boolean {
    return items.some(({ quantity }) => quantity >= MIN_QUANTITY)
  }

  calculate(items: CartItem[]): number {
    return calculateBulkDiscount(items)
  }
}
