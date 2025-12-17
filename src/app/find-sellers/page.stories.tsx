import type { Meta, StoryObj } from '@storybook/nextjs'
import FindSellersPage from './page'

const meta: Meta<typeof FindSellersPage> = {
  title: 'Pages/FindSellers',
  component: FindSellersPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof FindSellersPage>

export const Default: Story = {
  render: () => <FindSellersPage />
}
