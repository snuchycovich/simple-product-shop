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
}

const renderSummary = (overrides: Partial<typeof defaultProps> = {}) =>
  render(<CartSummary {...defaultProps} {...overrides} />)

describe('CartSummary', () => {
  it('shows the formatted subtotal', () => {
    renderSummary()

    expect(screen.getByText('$60.00')).toBeInTheDocument()
  })

  it('shows the discount with a negative sign when it is greater than 0', () => {
    renderSummary()

    expect(screen.getByText('-$6.00')).toBeInTheDocument()
  })

  it('does not show the discount line when the discount is 0', () => {
    renderSummary({ discount: 0, total: 60 })

    expect(screen.queryByText(/discount/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^-\$/)).not.toBeInTheDocument()
  })

  it('shows the formatted total', () => {
    renderSummary()

    expect(screen.getByText('$54.00')).toBeInTheDocument()
  })

  it('shows the promo message when the subtotal is below the order discount minimum', () => {
    renderSummary({ subtotal: 60, discount: 0, total: 60 })

    expect(screen.getByText('Add $40.00 more for 15% off!')).toBeInTheDocument()
  })

  it('does not show the promo message when the subtotal equals the minimum', () => {
    renderSummary({ subtotal: MIN_SUBTOTAL, discount: 15, total: 85 })

    expect(screen.queryByText(/more for/i)).not.toBeInTheDocument()
  })

  it('does not show the promo message when the subtotal is above the minimum', () => {
    renderSummary({ subtotal: 150, discount: 22.5, total: 127.5 })

    expect(screen.queryByText(/more for/i)).not.toBeInTheDocument()
  })

  it('has a checkout button', () => {
    renderSummary()

    expect(
      screen.getByRole('button', { name: /checkout/i }),
    ).toBeInTheDocument()
  })
})
