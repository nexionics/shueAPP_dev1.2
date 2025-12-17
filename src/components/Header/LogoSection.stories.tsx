import type { Meta, StoryObj } from '@storybook/nextjs'
import { LogoSection } from './LogoSection'

const meta: Meta<typeof LogoSection> = {
  title: 'Header/LogoSection',
  component: LogoSection,
  parameters: { layout: 'centered' }
}

export default meta

type Story = StoryObj<typeof LogoSection>

export const Default: Story = {
  args: {
    isAuthenticated: false
  }
}

export const Authenticated: Story = {
  args: {
    isAuthenticated: true
  }
}
