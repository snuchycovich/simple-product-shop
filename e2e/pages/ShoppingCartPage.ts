import type { Locator, Page } from '@playwright/test'

export class ShoppingCartPage {
  readonly page: Page
  readonly container: Locator
  readonly headerIcon: Locator
  readonly heading: Locator
  readonly emptyMessage: Locator
  readonly checkoutButton: Locator
  readonly subtotal: Locator
  readonly total: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.getByRole('complementary')
    this.headerIcon = page.getByRole('img', { name: /^Cart with/ })
    this.heading = page.getByRole('heading', {
      name: 'Shopping Cart',
      exact: true,
    })
    this.emptyMessage = page.getByText('Your cart is empty')
    this.checkoutButton = page.getByRole('button', { name: /checkout/i })
    this.subtotal = this.summaryValue('Subtotal')
    this.total = this.summaryValue('Total')
  }

  getItem(productName: string): Locator {
    return this.page.getByRole('listitem').filter({
      has: this.page.getByRole('heading', { name: productName, exact: true }),
    })
  }

  getDiscount(discountName: string): Locator {
    return this.summaryValue(discountName)
  }

  async increaseQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: `Increase quantity of ${productName}` })
      .click()
  }

  async decreaseQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: `Decrease quantity of ${productName}` })
      .click()
  }

  async removeItem(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: `Remove ${productName} from cart` })
      .click()
  }

  async getQuantity(productName: string): Promise<number> {
    const text = await this.getItem(productName)
      .getByText(/^\d+$/)
      .innerText()

    return Number(text)
  }

  private summaryValue(label: string): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=following-sibling::span')
  }
}
