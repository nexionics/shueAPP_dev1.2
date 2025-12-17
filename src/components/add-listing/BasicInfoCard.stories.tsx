import type { Meta, StoryObj } from '@storybook/nextjs'
import BasicInfoCard from './BasicInfoCard'
import { CONDITIONS } from './types'

const meta: Meta<typeof BasicInfoCard> = {
  title: 'AddListing/BasicInfoCard',
  component: BasicInfoCard,
}

export default meta

type Story = StoryObj<typeof BasicInfoCard>

export const Default: Story = {
  args: {
    title: 'Air Jordan 1 Chicago 2015',
    brand: 'Nike',
    model: 'Air Jordan 1 High',
    colorway: 'Chicago',
    description: 'Excellent condition, worn twice',
    condition: 'used-excellent',
    onChange: (field: any, value: any) => console.log('change', field, value),
    conditions: CONDITIONS
  }
}

export const Empty: Story = {
  args: {
    title: '',
    brand: '',
    model: '',
    colorway: '',
    description: '',
    condition: '',
    onChange: (field: any, value: any) => console.log('change', field, value),
    conditions: CONDITIONS
  }
}

export const WithErrors: Story = {
  args: {
    title: '',
    brand: '',
    model: '',
    colorway: '',
    description: '',
    condition: '',
    onChange: (field: any, value: any) => console.log('change', field, value),
    conditions: CONDITIONS
  },
  render: (args) => (
    <div>
      <BasicInfoCard {...args} />
      <p style={{ color: 'red' }}>Simulated validation errors shown in parent</p>
    </div>
  )
}
