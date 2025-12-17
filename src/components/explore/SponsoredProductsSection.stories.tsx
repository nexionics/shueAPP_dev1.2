import React from 'react'
import SponsoredProductsSection from './SponsoredProductsSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()
const mockProducts = sections.featuredProducts.slice(0, 4)

export default {
  title: 'Explore/SponsoredProducts',
  component: SponsoredProductsSection,
  parameters: {
    layout: 'padded',
  },
}

export const Default = () => (
  <SponsoredProductsSection products={mockProducts} />
)

export const Loading = () => (
  <SponsoredProductsSection products={[]} loading={true} />
)

export const Empty = () => (
  <SponsoredProductsSection products={[]} />
)

export const Error = () => (
  <SponsoredProductsSection products={[]} error="Failed to load sponsored products" />
)

export const WithOneProduct = () => (
  <SponsoredProductsSection products={[mockProducts[0]]} />
)

export const WithTwoProducts = () => (
  <SponsoredProductsSection products={mockProducts.slice(0, 2)} />
)

export const WithThreeProducts = () => (
  <SponsoredProductsSection products={mockProducts.slice(0, 3)} />
)
