import type { CartItem } from '@/shared/types'
import { calculateSubtotal } from '@/shared/utils'
import { BulkDiscountStrategy } from './BulkDiscountStrategy'
import type { DiscountStrategy } from './DiscountStrategy'
import { OrderDiscountStrategy } from './OrderDiscountStrategy'

export interface DiscountBreakdown {
  name: string
  amount: number
}

export class DiscountCalculator {
  private strategies: DiscountStrategy[]

  constructor(
    strategies: DiscountStrategy[] = [
      new BulkDiscountStrategy(),
      new OrderDiscountStrategy(),
    ],
  ) {
    this.strategies = strategies
  }

  calculate(items: CartItem[]): number {
    return this.getBreakdown(items).reduce(
      (total, { amount }) => total + amount,
      0,
    )
  }

  getBreakdown(items: CartItem[]): DiscountBreakdown[] {
    let remaining = calculateSubtotal(items)
    const breakdown: DiscountBreakdown[] = []

    for (const strategy of this.strategies) {
      if (!strategy.isApplicable(items, remaining)) continue

      const amount = strategy.calculate(items, remaining)
      breakdown.push({ name: strategy.name, amount })
      remaining -= amount
    }

    return breakdown
  }
}
