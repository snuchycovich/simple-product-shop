import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductCatalog } from './ProductCatalog'

const { mockProducts } = vi.hoisted(() => ({
  mockProducts: [
    {
      id: 1,
      name: 'Test Headphones',
      price: 50,
      image: '/images/headphones.jpg',
      description: 'Headphones for testing.',
    },
    {
      id: 2,
      name: 'Test Keyboard',
      price: 80.5,
      image: '/images/keyboard.jpg',
      description: 'Keyboard for testing.',
    },
  ],
}))

vi.mock('@/shared/data/products', () => ({
  products: mockProducts,
}))

describe('ProductCatalog', () => {
  it('shows the "Products" heading', () => {
    render(<ProductCatalog onAddToCart={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: 'Products' }),
    ).toBeInTheDocument()
  })

  it('renders every product from the data file', () => {
    render(<ProductCatalog onAddToCart={vi.fn()} />)

    expect(screen.getByText('Test Headphones')).toBeInTheDocument()
    expect(screen.getByText('Test Keyboard')).toBeInTheDocument()
  })

  it('renders one ProductCard per product', () => {
    render(<ProductCatalog onAddToCart={vi.fn()} />)

    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(mockProducts.length)
  })

  it('passes onAddToCart to each ProductCard', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductCatalog onAddToCart={onAddToCart} />)

    const buttons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(buttons[0])
    await user.click(buttons[1])

    expect(onAddToCart).toHaveBeenCalledTimes(2)
    expect(onAddToCart).toHaveBeenNthCalledWith(1, mockProducts[0])
    expect(onAddToCart).toHaveBeenNthCalledWith(2, mockProducts[1])
  })
})
