"use client"
import React from 'react'
import { getRequests } from '@/lib/data'

export default function NotificationsPage() {
  const requests = getRequests().slice(0, 6)

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="p-4 bg-white rounded shadow-sm">
              <div className="font-semibold">Request: {r.productName}</div>
              <div className="text-sm text-muted-foreground">From: {r.requesterName} • {r.location}</div>
            </div>
          ))}
          {requests.length === 0 && <div className="text-muted-foreground">No notifications</div>}
        </div>
      </div>
    </main>
  )
}
