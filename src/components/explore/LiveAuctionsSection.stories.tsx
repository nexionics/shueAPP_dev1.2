import React from 'react'
import LiveAuctionsSection from './LiveAuctionsSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/LiveAuctions' }

export const Default = () => <LiveAuctionsSection activeAuctions={sections.activeAuctions} />
