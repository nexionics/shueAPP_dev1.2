import type { Meta, StoryObj } from '@storybook/nextjs'
import ImagesUploadCard from './ImagesUploadCard'

const meta: Meta<typeof ImagesUploadCard> = {
  title: 'AddListing/ImagesUploadCard',
  component: ImagesUploadCard,
}

export default meta

type Story = StoryObj<typeof ImagesUploadCard>

const demoFile = new File(['a'], 'demo.png', { type: 'image/png' })

export const Default: Story = {
  args: {
    images: [demoFile],
    onUpload: (files: File[]) => console.log('upload', files),
    onRemove: (i: number) => console.log('remove', i)
  }
}

export const Empty: Story = {
  args: {
    images: [],
    onUpload: (files: File[]) => console.log('upload', files),
    onRemove: (i: number) => console.log('remove', i)
  }
}

export const ManyImages: Story = {
  args: {
    images: Array.from({ length: 6 }).map((_, i) => new File(['a'], `img${i + 1}.png`, { type: 'image/png' })),
    onUpload: (files: File[]) => console.log('upload', files),
    onRemove: (i: number) => console.log('remove', i)
  }
}
