import type { Meta, StoryObj } from '@storybook/nextjs'
import AdminPanelPage from './page'

const meta: Meta<typeof AdminPanelPage> = {
  title: 'Pages/Admin',
  component: AdminPanelPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof AdminPanelPage>

export const Default: Story = {
  render: () => <AdminPanelPage />
}
