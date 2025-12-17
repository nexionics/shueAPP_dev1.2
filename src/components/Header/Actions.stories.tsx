import type { Meta, StoryObj } from '@storybook/nextjs'
import { Actions } from './Actions'
import { AuthProvider } from '@/contexts/AuthContext'

const meta: Meta<typeof Actions> = {
  title: 'Header/Actions',
  component: Actions,
  parameters: { layout: 'centered' }
}

export default meta

type Story = StoryObj<typeof Actions>

export const SignedOut: Story = {
  render: (args) => (
    <Actions {...args} />
  ),
  args: {
    isAuthenticated: false
  }
}

export const SignedIn: Story = {
  render: (args) => (
    <AuthProvider>
      <Actions {...args} />
    </AuthProvider>
  ),
  args: {
    isAuthenticated: true
  }
}
