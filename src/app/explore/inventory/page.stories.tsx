import type { Meta, StoryObj } from '@storybook/nextjs'
import InventoryPage from './page'

const meta: Meta<typeof InventoryPage> = {
  title: 'Pages/Explore/Inventory',
  component: InventoryPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof InventoryPage>

export const Default: Story = {
  render: () => <InventoryPage />
}
