import React from 'react'
import NewPreordersSection from './NewPreordersSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/NewPreorders' }

export const Default = () => <NewPreordersSection newPreorders={sections.newPreorders} />
