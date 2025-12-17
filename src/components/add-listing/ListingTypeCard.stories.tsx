import type { Meta, StoryObj } from '@storybook/nextjs'
import ListingTypeCard from './ListingTypeCard'

const meta: Meta<typeof ListingTypeCard> = {
  title: 'AddListing/ListingTypeCard',
  component: ListingTypeCard,
}

export default meta

type Story = StoryObj<typeof ListingTypeCard>

export const Sale: Story = {
  args: {
    listingType: 'sale',
    minBid: undefined,
    buyNowPrice: undefined,
    auctionDuration: undefined,
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}

export const Auction: Story = {
  args: {
    listingType: 'auction',
    minBid: 50,
    buyNowPrice: 200,
    auctionDuration: 3,
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}

export const Trade: Story = {
  args: {
    listingType: 'trade',
    minBid: undefined,
    buyNowPrice: undefined,
    auctionDuration: undefined,
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}

export const AuctionEmpty: Story = {
  args: {
    listingType: 'auction',
    minBid: undefined,
    buyNowPrice: undefined,
    auctionDuration: undefined,
    onChange: (f: string, v: any) => console.log('change', f, v)
  }
}
