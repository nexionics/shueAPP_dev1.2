import type { Meta, StoryObj } from '@storybook/nextjs'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Primary site header containing navigation, theme toggle, and auth actions.'
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: (args) => (
    <AuthProvider>
      <Header {...args} />
    </AuthProvider>
  ),
  parameters: {
    docs: { source: { type: 'code' } }
  }
}
