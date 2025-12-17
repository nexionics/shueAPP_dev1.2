import type { Meta, StoryObj } from '@storybook/nextjs'
import AddListingPage from './page'

const meta: Meta<typeof AddListingPage> = {
  title: 'Pages/AddListing',
  component: AddListingPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof AddListingPage>

export const Default: Story = {
  render: () => <AddListingPage />
}
