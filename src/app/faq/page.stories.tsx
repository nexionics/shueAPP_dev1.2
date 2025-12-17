import type { Meta, StoryObj } from '@storybook/nextjs'
import FAQPage from './page'

const meta: Meta<typeof FAQPage> = {
  title: 'Pages/FAQ',
  component: FAQPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof FAQPage>

export const Default: Story = {
  render: () => <FAQPage />
}
