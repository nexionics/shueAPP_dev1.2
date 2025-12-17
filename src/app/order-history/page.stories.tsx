import type { Meta, StoryObj } from '@storybook/nextjs'
import OrderHistoryPage from './page'

const meta: Meta<typeof OrderHistoryPage> = {
  title: 'Pages/OrderHistory',
  component: OrderHistoryPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof OrderHistoryPage>

export const Default: Story = {
  render: () => <OrderHistoryPage />
}
