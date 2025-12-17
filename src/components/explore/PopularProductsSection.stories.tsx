import React from 'react'
import PopularProductsSection from './PopularProductsSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/PopularProducts' }

export const Default = () => <PopularProductsSection products={sections.featuredProducts} />
