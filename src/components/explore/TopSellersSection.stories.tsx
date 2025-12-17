import React from 'react'
import TopSellersSection from './TopSellersSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/TopSellers' }

export const Default = () => <TopSellersSection topSellers={sections.topSellers} />
