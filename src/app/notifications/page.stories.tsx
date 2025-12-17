import type { Meta, StoryObj } from '@storybook/nextjs'
import NotificationsPage from './page'

const meta: Meta<typeof NotificationsPage> = {
  title: 'Pages/Notifications',
  component: NotificationsPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof NotificationsPage>

export const Default: Story = {
  render: () => <NotificationsPage />
}
