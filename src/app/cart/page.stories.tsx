import type { Meta, StoryObj } from '@storybook/nextjs'
import CartPage from './page'

const meta: Meta<typeof CartPage> = {
  title: 'Pages/Cart',
  component: CartPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof CartPage>

export const Default: Story = {
  render: () => <CartPage />
}
