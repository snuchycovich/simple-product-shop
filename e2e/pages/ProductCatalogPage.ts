import type { Locator, Page } from '@playwright/test'

export class ProductCatalogPage {
  readonly page: Page
  readonly heading: Locator
  readonly productCards: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Products', exact: true })
    this.productCards = page.getByTestId('product-card')
  }

  async goto() {
    await this.page.goto('/')
  }

  getProduct(name: string): Locator {
    return this.productCards.filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    })
  }

  async addToCart(name: string) {
    await this.getProduct(name)
      .getByRole('button', { name: /add to cart|added!/i })
      .click()
  }
}
