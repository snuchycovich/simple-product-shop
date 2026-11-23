export const BUSINESS_RULES = {
  BULK_DISCOUNT: {
    MIN_QUANTITY: 5,
    RATE: 0.1,
  },
  ORDER_DISCOUNT: {
    MIN_SUBTOTAL: 100,
    RATE: 0.15,
  },
  QUANTITY: {
    MIN: 1,
    MAX: 99,
  },
  LOGIN: {
    MAX_FAILED_ATTEMPTS: 3,
  },
  PASSWORD: {
    MIN_LENGTH: 12,
    STRONG_LENGTH: 16,
  },
} as const
