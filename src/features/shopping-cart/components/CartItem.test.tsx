import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CartItem as CartItemType } from '@/shared/types'
import { CartItem } from './CartItem'

const item: CartItemType = {
  product: {
    id: 1,
    name: 'Wireless Headphones',
    price: 25,
    image: '/images/headphones.jpg',
    description: 'Over-ear Bluetooth headphones.',
  },
  quantity: 3,
}

const renderCartItem = (
  overrides: Partial<Parameters<typeof CartItem>[0]> = {},
) => {
  const onUpdateQuantity = vi.fn()
  const onRemove = vi.fn()
  render(
    <CartItem
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      {...overrides}
    />,
  )
  return { onUpdateQuantity, onRemove }
}

describe('CartItem', () => {
  it('shows the product name and unit price', () => {
    renderCartItem()

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('shows the current quantity', () => {
    renderCartItem()

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows the subtotal (price × quantity)', () => {
    renderCartItem()

    expect(screen.getByText('$75.00')).toBeInTheDocument()
  })

  it('calls onUpdateQuantity with the incremented quantity when + is clicked', async () => {
    const user = userEvent.setup()
    const { onUpdateQuantity } = renderCartItem()

    await user.click(
      screen.getByRole('button', { name: /increase quantity/i }),
    )

    expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
    expect(onUpdateQuantity).toHaveBeenCalledWith(4)
  })

  it('calls onUpdateQuantity with the decremented quantity when - is clicked', async () => {
    const user = userEvent.setup()
    const { onUpdateQuantity } = renderCartItem()

    await user.click(
      screen.getByRole('button', { name: /decrease quantity/i }),
    )

    expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
    expect(onUpdateQuantity).toHaveBeenCalledWith(2)
  })

  it('disables the - button when the quantity is 1', () => {
    renderCartItem({ item: { ...item, quantity: 1 } })

    expect(
      screen.getByRole('button', { name: /decrease quantity/i }),
    ).toBeDisabled()
  })

  it('enables the - button when the quantity is greater than 1', () => {
    renderCartItem()

    expect(
      screen.getByRole('button', { name: /decrease quantity/i }),
    ).toBeEnabled()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup()
    const { onRemove } = renderCartItem()

    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
