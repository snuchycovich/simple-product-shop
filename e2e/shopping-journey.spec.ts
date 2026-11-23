import { expect, test } from '@playwright/test'
import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

const PRODUCT = 'Laptop Stand' // $39.50, below every discount threshold on its own

test.describe('Shopping journey', () => {
  let catalog: ProductCatalogPage
  let cart: ShoppingCartPage

  test.beforeEach(async ({ page }) => {
    catalog = new ProductCatalogPage(page)
    cart = new ShoppingCartPage(page)

    await catalog.goto()
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('the cart is empty initially', async () => {
    await expect(catalog.heading).toBeVisible()
    await expect(catalog.productCards).toHaveCount(6)
    await expect(cart.heading).toBeVisible()
    await expect(cart.emptyMessage).toBeVisible()
    await expect(cart.checkoutButton).toBeHidden()
  })

  test('adding a product shows it in the cart', async () => {
    await catalog.addToCart(PRODUCT)

    await expect(cart.getItem(PRODUCT)).toBeVisible()
    await expect(cart.emptyMessage).toBeHidden()
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(1)
    await expect(cart.subtotal).toHaveText('$39.50')
    await expect(cart.total).toHaveText('$39.50')
    await expect(cart.checkoutButton).toBeVisible()
  })

  test('adding the same product again increments its quantity', async () => {
    await catalog.addToCart(PRODUCT)
    await catalog.addToCart(PRODUCT)

    await expect(cart.getItem(PRODUCT)).toHaveCount(1)
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(2)
    await expect(cart.subtotal).toHaveText('$79.00')
  })

  test('the + and - buttons change the quantity', async () => {
    await catalog.addToCart(PRODUCT)
    const decreaseButton = cart
      .getItem(PRODUCT)
      .getByRole('button', { name: `Decrease quantity of ${PRODUCT}` })

    await expect(decreaseButton).toBeDisabled()

    await cart.increaseQuantity(PRODUCT)
    await cart.increaseQuantity(PRODUCT)
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(3)
    await expect(cart.subtotal).toHaveText('$118.50')

    await cart.decreaseQuantity(PRODUCT)
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(2)
    await expect(cart.subtotal).toHaveText('$79.00')
    await expect(decreaseButton).toBeEnabled()
  })

  test('the remove button deletes the item from the cart', async () => {
    await catalog.addToCart(PRODUCT)
    await expect(cart.getItem(PRODUCT)).toBeVisible()

    await cart.removeItem(PRODUCT)

    await expect(cart.getItem(PRODUCT)).toHaveCount(0)
    await expect(cart.emptyMessage).toBeVisible()
  })

  test('the bulk discount appears with 5 or more units', async () => {
    await catalog.addToCart(PRODUCT)
    for (let i = 0; i < 3; i++) {
      await cart.increaseQuantity(PRODUCT)
    }

    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(4)
    await expect(cart.getDiscount('Bulk Discount')).toBeHidden()

    await cart.increaseQuantity(PRODUCT)

    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(5)
    // subtotal: 39.50 × 5 = $197.50 → bulk 10% = $19.75 → order 15% of $177.75 = $26.66
    await expect(cart.subtotal).toHaveText('$197.50')
    await expect(cart.getDiscount('Bulk Discount')).toHaveText('-$19.75')
    await expect(cart.getDiscount('Order Discount')).toHaveText('-$26.66')
    await expect(cart.total).toHaveText('$151.09')
  })

  test('the cart persists after a page refresh', async ({ page }) => {
    await catalog.addToCart(PRODUCT)
    await cart.increaseQuantity(PRODUCT)
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(2)

    await page.reload()

    await expect(cart.emptyMessage).toBeHidden()
    await expect(cart.getItem(PRODUCT)).toBeVisible()
    await expect.poll(() => cart.getQuantity(PRODUCT)).toBe(2)
    await expect(cart.subtotal).toHaveText('$79.00')
  })
})
