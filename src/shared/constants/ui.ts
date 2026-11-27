export const UI_TEXT = {
  addToCart: 'Add to cart',
  adding: 'Adding...',
  added: 'Added!',
  failedRetry: 'Failed - Retry',
  removeFromCart: (productName: string) => `Remove ${productName} from cart`,
  checkout: 'Checkout',
  emptyCart: 'Your cart is empty',
  bulkDiscount: 'Bulk Discount',
  orderDiscount: 'Order Discount',
  itemCount: (count: number) => (count === 1 ? '1 item' : `${count} items`),
  cartUpdated: (itemCount: string, total: string) =>
    `Cart updated: ${itemCount}, total ${total}`,
  cartIsEmpty: 'Cart is empty',
} as const
