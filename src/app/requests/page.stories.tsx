import type { Meta, StoryObj } from '@storybook/nextjs'
import RequestsPage from './page'

const meta: Meta<typeof RequestsPage> = {
  title: 'Pages/Requests',
  component: RequestsPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof RequestsPage>

export const Default: Story = {
  render: () => <RequestsPage />
}
