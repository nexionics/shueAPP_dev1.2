import React from 'react'
import ActiveRafflesSection from './ActiveRafflesSection'
import { getHomeSectionsWithRealData } from '@/lib/data'

const sections = getHomeSectionsWithRealData()

export default { title: 'Explore/ActiveRaffles' }

export const Default = () => <ActiveRafflesSection activeRaffles={sections.activeRaffles} />
