import type { Meta, StoryObj } from '@storybook/nextjs'
import ExplorePage from './page'

const meta: Meta<typeof ExplorePage> = {
  title: 'Pages/Explore',
  component: ExplorePage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof ExplorePage>

export const Default: Story = {
  render: () => <ExplorePage />
}
