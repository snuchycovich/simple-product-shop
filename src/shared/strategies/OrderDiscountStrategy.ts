import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { UI_TEXT } from '@/shared/constants/ui'
import type { CartItem } from '@/shared/types'
import { formatPercent } from '@/shared/utils'
import type { DiscountStrategy } from './DiscountStrategy'

const { MIN_SUBTOTAL, RATE } = BUSINESS_RULES.ORDER_DISCOUNT

export class OrderDiscountStrategy implements DiscountStrategy {
  name = UI_TEXT.orderDiscount
  description = `${formatPercent(RATE)} off orders of $${MIN_SUBTOTAL}+`

  isApplicable(_items: CartItem[], subtotal: number): boolean {
    return subtotal >= MIN_SUBTOTAL
  }

  calculate(_items: CartItem[], subtotal: number): number {
    return subtotal * RATE
  }
}
