import type { Product } from '@/shared/types'

export const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://picsum.photos/seed/headphones/200',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
  },
  {
    id: 2,
    name: 'Smartwatch',
    price: 149.0,
    image: 'https://picsum.photos/seed/smartwatch/200',
    description:
      'Fitness smartwatch with heart-rate monitor, GPS, sleep tracking and water resistance.',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 39.5,
    image: 'https://picsum.photos/seed/laptop-stand/200',
    description:
      'Adjustable aluminum stand that raises your laptop to eye level and improves airflow.',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 119.99,
    image: 'https://picsum.photos/seed/keyboard/200',
    description:
      'Compact mechanical keyboard with tactile switches, RGB backlight and USB-C cable.',
  },
  {
    id: 5,
    name: 'USB-C Hub',
    price: 49.99,
    image: 'https://picsum.photos/seed/usb-hub/200',
    description:
      '7-in-1 USB-C hub with HDMI 4K output, SD card reader and 100W power delivery.',
  },
  {
    id: 6,
    name: 'HD Webcam',
    price: 69.0,
    image: 'https://picsum.photos/seed/webcam/200',
    description:
      '1080p webcam with autofocus, built-in dual microphones and a privacy shutter.',
  },
]
