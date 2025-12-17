import type { Meta, StoryObj } from '@storybook/nextjs'
import {  waitFor, within } from 'storybook/test';
import AddListingForm from './AddListingForm'

const meta: Meta<typeof AddListingForm> = {
  title: 'AddListing/Form',
  component: AddListingForm,
}

export default meta

type Story = StoryObj<typeof AddListingForm>

export const Default: Story = {
  args: {
    router: { push: (p: string) => console.log('push', p), back: () => console.log('back') },
    isAuthenticated: true,
    isInitializing: false
  }
}

export const Loading: Story = {
  args: {
    router: { push: (p: string) => console.log('push', p), back: () => console.log('back') },
    isAuthenticated: false,
    isInitializing: true
  }
}

export const NotAuthenticated: Story = {
  args: {
    router: { push: (p: string) => console.log('push', p), back: () => console.log('back') },
    isAuthenticated: false,
    isInitializing: false
  }
}

export const FilledForm: Story = {
  args: {
    router: { push: (p: string) => console.log('push', p), back: () => console.log('back') },
    isAuthenticated: true,
    isInitializing: false
  },
  render: (args) => (
    <AddListingForm {...args} />
  )
}

export const FillAllFieldsPlay: Story = {
  args: {
    router: { push: (p: string) => console.log('push', p), back: () => console.log('back') },
    isAuthenticated: true,
    isInitializing: false
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const user = userEvent

    const fileFromPublic = async (publicPath: string, filename?: string) => {
      const res = await fetch(publicPath)
      if (!res.ok) throw new Error(`Failed to fetch ${publicPath} (${res.status})`)
      const blob = await res.blob()
      return new File([blob], filename || publicPath.split('/').pop() || 'image', {
        type: blob.type || 'image/webp'
      })
    }

 

      await user.type(canvas.getByLabelText(/title/i), 'Air Jordan 1 Chicago 2015')
      await user.type(canvas.getByLabelText(/brand/i), 'Nike')
      await user.type(canvas.getByLabelText(/model/i), 'Air Jordan 1 High')
      await user.type(canvas.getByLabelText(/colorway/i), 'Chicago')
      await user.type(canvas.getByLabelText(/description/i), 'New in box. Never worn.')
      await user.selectOptions(canvas.getByLabelText(/condition/i), 'new')

      await user.selectOptions(canvas.getByLabelText(/^size$/i), '9')
      await user.type(canvas.getByLabelText(/price \(\$\)/i), '200')
      await user.clear(canvas.getByLabelText(/quantity/i))
      await user.type(canvas.getByLabelText(/quantity/i), '1')

      // Upload real images from frontend/public/bubbles so previews are visible
      const img1 = await fileFromPublic('/bubbles/1.webp', '1.webp')
      const img2 = await fileFromPublic('/bubbles/2.webp', '2.webp')
      await user.upload(canvas.getByLabelText(/images/i), [img1, img2])

      // Ensure previews render immediately
      await waitFor(() => {
        canvas.getByAltText('Upload 1')
        canvas.getByAltText('Upload 2')
      })

      // Listing type (fills the component and all its fields)
      await user.click(canvas.getByTestId('listing-type-auction'))
      await user.type(canvas.getByLabelText(/minimum bid/i), '50')
      await user.selectOptions(canvas.getByLabelText(/auction duration/i), '7')
      await user.type(canvas.getByLabelText(/auction start/i), '2025-12-12T10:00')
      await user.type(canvas.getByLabelText(/auction end/i), '2025-12-19T10:00')
      await user.type(canvas.getByLabelText(/buy now price/i), '250')

      await user.type(canvas.getByLabelText(/nearest safe location/i), 'Starbucks on Main St')

      await user.click(canvas.getByRole('button', { name: /create listing/i }))

      await waitFor(() => {
        const submitError = canvas.queryByText(/failed to create listing/i)
        if (submitError) {
          throw new Error('Submit failed (check backend running + auth token in localStorage)')
        }

      })
  },
}
