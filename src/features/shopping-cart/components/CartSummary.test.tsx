import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { CartSummary } from './CartSummary'

const { MIN_SUBTOTAL } = BUSINESS_RULES.ORDER_DISCOUNT

const defaultProps = {
  subtotal: 60,
  discount: 6,
  total: 54,
  itemCount: 3,
  discountBreakdown: [{ name: 'Bulk Discount', amount: 6 }],
}

const renderSummary = (overrides: Partial<typeof defaultProps> = {}) =>
  render(<CartSummary {...defaultProps} {...overrides} />)

describe('CartSummary', () => {
  it('shows the formatted subtotal', () => {
    renderSummary()

    expect(screen.getByText('$60.00')).toBeInTheDocument()
  })

  it('shows a line with the name and negative amount of an applied discount', () => {
    renderSummary()

    expect(screen.getByText('Bulk Discount')).toBeInTheDocument()
    expect(screen.getByText('-$6.00')).toBeInTheDocument()
  })

  it('shows each applied discount on its own line', () => {
    renderSummary({
      subtotal: 140,
      discount: 32.9,
      total: 107.1,
      discountBreakdown: [
        { name: 'Bulk Discount', amount: 14 },
        { name: 'Order Discount', amount: 18.9 },
      ],
    })

    expect(screen.getByText('Bulk Discount')).toBeInTheDocument()
    expect(screen.getByText('-$14.00')).toBeInTheDocument()
    expect(screen.getByText('Order Discount')).toBeInTheDocument()
    expect(screen.getByText('-$18.90')).toBeInTheDocument()
  })

  it('does not show any discount line when there are no discounts', () => {
    renderSummary({ discount: 0, total: 60, discountBreakdown: [] })

    expect(screen.queryByText(/discount/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^-\$/)).not.toBeInTheDocument()
  })

  it('shows the formatted total', () => {
    renderSummary()

    expect(screen.getByText('$54.00')).toBeInTheDocument()
  })

  it('shows the promo message with what is missing when the order discount is not applied', () => {
    renderSummary({ discount: 0, total: 60, discountBreakdown: [] })

    expect(screen.getByText('Add $40.00 more for 15% off!')).toBeInTheDocument()
  })

  it('calculates the missing amount over the total after other discounts', () => {
    renderSummary({
      subtotal: 105,
      discount: 10.5,
      total: 94.5,
      discountBreakdown: [{ name: 'Bulk Discount', amount: 10.5 }],
    })

    expect(screen.getByText('Add $5.50 more for 15% off!')).toBeInTheDocument()
  })

  it('does not show the promo message when the order discount is applied', () => {
    renderSummary({
      subtotal: MIN_SUBTOTAL,
      discount: 15,
      total: 85,
      discountBreakdown: [{ name: 'Order Discount', amount: 15 }],
    })

    expect(screen.queryByText(/more for/i)).not.toBeInTheDocument()
  })

  it('does not show the promo message when the order discount is applied, even if the total ends up below the minimum', () => {
    renderSummary({
      subtotal: 115,
      discount: 17.25,
      total: 97.75,
      discountBreakdown: [{ name: 'Order Discount', amount: 17.25 }],
    })

    expect(screen.queryByText(/more for/i)).not.toBeInTheDocument()
  })

  it('has a checkout button', () => {
    renderSummary()

    expect(
      screen.getByRole('button', { name: /checkout/i }),
    ).toBeInTheDocument()
  })
})
