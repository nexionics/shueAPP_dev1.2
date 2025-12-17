import React from 'react'
import RecentRequestsSection from './RecentRequestsSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/RecentRequests' }

export const Default = () => <RecentRequestsSection recentRequests={sections.recentRequests} />
