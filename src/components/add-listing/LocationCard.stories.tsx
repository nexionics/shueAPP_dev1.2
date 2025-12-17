import type { Meta, StoryObj } from '@storybook/nextjs'
import LocationCard from './LocationCard'

const meta: Meta<typeof LocationCard> = {
  title: 'AddListing/LocationCard',
  component: LocationCard,
}

export default meta

type Story = StoryObj<typeof LocationCard>

export const Default: Story = {
  args: {
    location: 'Starbucks on Main St',
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}

export const Empty: Story = {
  args: {
    location: '',
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}

export const Invalid: Story = {
  args: {
    location: 'X',
    onChange: (f: string, v: any) => console.log('change', f, v)
  },
  render: (args) => (
    <div>
      <LocationCard {...args} />
      <p style={{ color: 'red' }}>Invalid location (too short)</p>
    </div>
  )
}
