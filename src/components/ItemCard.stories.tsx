import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ItemCard } from './ItemCard'
import type { Product } from '@/lib/data'

const meta: Meta<typeof ItemCard> = {
  title: 'Components/ItemCard',
  component: ItemCard,
}

export default meta

export const Default: StoryObj<typeof ItemCard> = {
  args: {
    product: {
      id: 'demo-1',
      name: 'Air Demo Jordan 1',
      brand: 'Jordan',
      colorway: 'Black/Red',
      releaseDate: '2025-01-01',
      retailPrice: 170,
      images: ['/bubbles/1.webp', '/bubbles/2.webp', '/bubbles/3.webp', '/bubbles/4.webp'],
      sizes: [
        { size: '8', price: 150 },
        { size: '9', price: 160 },
        { size: '10', price: 170 }
      ],
      category: 'sneaker',
      condition: 'new',
      sellerId: 'seller-demo',
    } as Product
  }
}
