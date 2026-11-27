import { expect, test, type Locator } from '@playwright/test'

const getOutline = (locator: Locator) =>
  locator.evaluate((element) => {
    const { outlineStyle, outlineWidth, outlineOffset, outlineColor } =
      getComputedStyle(element)
    return { outlineStyle, outlineWidth, outlineOffset, outlineColor }
  })

const LIGHT_RING = 'rgb(37, 99, 235)' // blue-600
const DARK_RING = 'rgb(96, 165, 250)' // blue-400

test.describe('Focus visible styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows a visible outline with an offset when navigating with the keyboard', async ({
    page,
  }) => {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')

    await expect(focused).toBeVisible()
    expect(await getOutline(focused)).toEqual({
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: LIGHT_RING,
    })
  })

  test('shows the outline on buttons reached with the keyboard', async ({
    page,
  }) => {
    const addToCart = page.getByRole('button', { name: /add to cart/i }).first()

    await page.keyboard.press('Tab') // "Login demo" summary
    await page.keyboard.press('Tab') // first "Add to cart" button

    await expect(addToCart).toBeFocused()
    expect((await getOutline(addToCart)).outlineStyle).toBe('solid')
  })

  test('does not show an outline on a button after a mouse click', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /add to cart/i }).first().click()

    const focused = page.locator('button:focus')
    await expect(focused).toHaveCount(1)
    expect((await getOutline(focused)).outlineStyle).toBe('none')
  })

  test('uses a lighter outline color in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })

    await page.keyboard.press('Tab')

    expect((await getOutline(page.locator(':focus'))).outlineColor).toBe(
      DARK_RING,
    )
  })
})
