import { expect, test } from '@playwright/test'
import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

const SCREENSHOT_OPTIONS = { maxDiffPixelRatio: 0.05 }

// 1×1 gray PNG used instead of the remote picsum.photos images, so the
// screenshots do not depend on the network.
const PLACEHOLDER_IMAGE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

test.use({
  viewport: { width: 1280, height: 900 },
  colorScheme: 'light',
})

test.describe('Visual regression', () => {
  let catalog: ProductCatalogPage
  let cart: ShoppingCartPage

  test.beforeEach(async ({ page }) => {
    catalog = new ProductCatalogPage(page)
    cart = new ShoppingCartPage(page)

    await page.route('https://picsum.photos/**', (route) =>
      route.fulfill({ contentType: 'image/png', body: PLACEHOLDER_IMAGE }),
    )

    await catalog.goto()
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('homepage with the product catalog', async ({ page }) => {
    await expect(catalog.productCards).toHaveCount(6)

    await expect(page).toHaveScreenshot('homepage.png', SCREENSHOT_OPTIONS)
  })

  test('shopping cart with items', async ({ page }) => {
    await catalog.addToCart('Laptop Stand')
    await catalog.addToCart('Mechanical Keyboard')
    for (let i = 0; i < 4; i++) {
      await cart.increaseQuantity('Laptop Stand')
    }
    await expect.poll(() => cart.getQuantity('Laptop Stand')).toBe(5)
    await expect(cart.getDiscount('Bulk Discount')).toBeVisible()
    await page.waitForLoadState('networkidle')
    await page.mouse.move(640, 20)

    await expect(cart.container).toHaveScreenshot(
      'cart-with-items.png',
      SCREENSHOT_OPTIONS,
    )
  })
})
