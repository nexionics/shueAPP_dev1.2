import type { Meta, StoryObj } from '@storybook/nextjs'
import ProfilePage from './page'

const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/Profile',
  component: ProfilePage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof ProfilePage>

export const Default: Story = {
  render: () => <ProfilePage />
}
