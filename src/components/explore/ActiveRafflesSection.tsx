import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Ticket } from 'lucide-react'
import { formatPrice, getTimeRemaining } from '@/lib/data'

interface Raffle {
  id: string
  productName: string
  brand: string
  images: string[]
  retailPrice: number
  entryPrice: number
  totalEntries: number
  maxEntries: number
  startDate: string
  endDate: string
  drawDate: string
  status: string
  sizes: string[]
  description: string
  rules: string[]
  winner?: string
}

interface Props { activeRaffles: Raffle[] }

export default function ActiveRafflesSection({ activeRaffles }: Props) {
  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Ticket className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Active Raffles</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeRaffles.map((raffle) => (
          <Card key={raffle.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">{raffle.productName}</CardTitle>
              <div className="text-sm text-muted-foreground">{raffle.brand}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Entry Price:</span>
                <span className="font-bold">{formatPrice(raffle.entryPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Entries:</span>
                <span className="text-sm">{raffle.totalEntries}/{raffle.maxEntries}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${(raffle.totalEntries / raffle.maxEntries) * 100}%` }} />
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span>Ends {getTimeRemaining(raffle.endDate)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
