import type { Meta, StoryObj } from '@storybook/nextjs'
import ImageUploadPage from './page'

const meta: Meta<typeof ImageUploadPage> = {
  title: 'Pages/ImageUpload',
  component: ImageUploadPage,
  parameters: { layout: 'fullscreen' }
}

export default meta

type Story = StoryObj<typeof ImageUploadPage>

export const Default: Story = {
  render: () => <ImageUploadPage />
}
