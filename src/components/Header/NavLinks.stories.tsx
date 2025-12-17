import type { Meta, StoryObj } from '@storybook/nextjs'
import { NavLinks } from './NavLinks'

const meta: Meta<typeof NavLinks> = {
  title: 'Header/NavLinks',
  component: NavLinks,
  parameters: { layout: 'centered' }
}

export default meta

type Story = StoryObj<typeof NavLinks>

export const Default: Story = {}
