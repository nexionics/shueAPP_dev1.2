import type { Meta, StoryObj } from '@storybook/nextjs'
import HomePage from './page'

const meta: Meta<typeof HomePage> = {
  title: 'Pages/Home',
  component: HomePage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof HomePage>

export const Default: Story = {
  render: () => <HomePage />
}
