import type { Meta, StoryObj } from '@storybook/nextjs'
import SizesPricingCard from './SizesPricingCard'
import { SHOE_SIZES } from './types'

const meta: Meta<typeof SizesPricingCard> = {
  title: 'AddListing/SizesPricingCard',
  component: SizesPricingCard,
}

export default meta

type Story = StoryObj<typeof SizesPricingCard>

export const Default: Story = {
  args: {
    sizes: [{ size: '9', price: 200, quantity: 1 }],
    onChangeSize: (i: number, f: string, v: any) => console.log('sizeChange', i, f, v),
    addSize: () => console.log('addSize'),
    removeSize: (i: number) => console.log('remove', i),
    sizesOptions: SHOE_SIZES
  }
}

export const Empty: Story = {
  args: {
    sizes: [{ size: '', price: 0, quantity: 1 }],
    onChangeSize: (i: number, f: string, v: any) => console.log('sizeChange', i, f, v),
    addSize: () => console.log('addSize'),
    removeSize: (i: number) => console.log('remove', i),
    sizesOptions: SHOE_SIZES
  }
}

export const MultipleSizes: Story = {
  args: {
    sizes: [
      { size: '8', price: 150, quantity: 1 },
      { size: '9', price: 200, quantity: 2 },
      { size: '10', price: 220, quantity: 1 }
    ],
    onChangeSize: (i: number, f: string, v: any) => console.log('sizeChange', i, f, v),
    addSize: () => console.log('addSize'),
    removeSize: (i: number) => console.log('remove', i),
    sizesOptions: SHOE_SIZES
  }
}
