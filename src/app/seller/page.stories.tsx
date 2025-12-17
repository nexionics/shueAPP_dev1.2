import type { Meta, StoryObj } from '@storybook/nextjs'
import SellerPage from './page'

const meta: Meta<typeof SellerPage> = {
  title: 'Pages/Seller',
  component: SellerPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof SellerPage>

export const Default: Story = {
  render: () => <SellerPage />
}
