import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/Button"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  title: string
  subtitle?: string
  description?: string
  images?: string[]
  price: number
  currency?: string
  currentBid?: number
  auctionStart?: string
  auctionEnd?: string
  raffle?: {
    ticketPrice?: number
    currency?: string
    endsAt?: string
  }
}

export default function ProductPDP({ product }: { product: Product }) {
  const [bidAmount, setBidAmount] = useState<number>(
    product.currentBid ? product.currentBid + 10 : product.price
  )
  const [qtyTickets, setQtyTickets] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [now, setNow] = useState<Date>(new Date())
  const [countdown, setCountdown] = useState<string | null>(null)

  const auctionStart = useMemo(() => {
    return product.auctionStart ? new Date(product.auctionStart) : undefined
  }, [product.auctionStart])

  const auctionEnd = useMemo(() => {
    return product.auctionEnd ? new Date(product.auctionEnd) : undefined
  }, [product.auctionEnd])

  const isAuctionListing = Boolean(auctionStart && auctionEnd)
  const isRaffleListing = Boolean(product.raffle && (product.raffle.ticketPrice || product.raffle.endsAt))

  const auctionActive = isAuctionListing ? now >= auctionStart! && now < auctionEnd! : false

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!isAuctionListing) {
      setCountdown(null)
      return
    }

    if (auctionStart && now < auctionStart) {
      // Not started
      const diff = auctionStart.getTime() - now.getTime()
      setCountdown(formatDiff(diff, 'starts in'))
      return
    }

    if (auctionEnd && now >= auctionEnd) {
      setCountdown('Auction ended')
      return
    }

    if (auctionEnd) {
      const diff = auctionEnd.getTime() - now.getTime()
      setCountdown(formatDiff(diff, 'ends in'))
      return
    }
  }, [now, auctionStart, auctionEnd, isAuctionListing])

  function formatDiff(ms: number, label: string) {
    if (ms <= 0) return `${label} 0s`
    const s = Math.floor(ms / 1000)
    const days = Math.floor(s / 86400)
    const hours = Math.floor((s % 86400) / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = s % 60
    const parts = []
    if (days) parts.push(`${days}d`)
    if (hours) parts.push(`${hours}h`)
    if (mins) parts.push(`${mins}m`)
    parts.push(`${secs}s`)
    return `${label} ${parts.join(' ')}`
  }

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    if (err && typeof err === 'object') {
      const maybeMessage = (err as { message?: unknown }).message
      if (typeof maybeMessage === 'string' && maybeMessage.length) return maybeMessage
    }
    return 'Something went wrong'
  }

  async function placeBid() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, amount: bidAmount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Bid failed")
      setMessage(`🔥 Bid placed! You're now the highest bidder at ${product.currency || '$'}${bidAmount}`)
    } catch (err: unknown) {
      setMessage(`❗ ${getErrorMessage(err) || 'Unable to place bid'}`)
    } finally {
      setLoading(false)
    }
  }

  async function buyNow() {
    if (auctionActive) {
      setMessage('⚠️ Buy Now is disabled while the auction is active')
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Purchase failed")
      setMessage(`🎉 Purchase complete — checkout initiated!`) 
    } catch (err: unknown) {
      setMessage(`❗ ${getErrorMessage(err) || 'Unable to purchase'}`)
    } finally {
      setLoading(false)
    }
  }

  async function buyRaffle() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/raffle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, tickets: qtyTickets }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Raffle purchase failed")
      setMessage(`🎟️ ${qtyTickets} raffle ticket(s) purchased — good luck!`)
    } catch (err: unknown) {
      setMessage(`❗ ${getErrorMessage(err) || 'Unable to buy raffle tickets'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden border bg-card">
          {product.images && product.images.length > 0 ? (
            <div className="relative w-full h-[420px] bg-muted">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="w-full h-[420px] flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-extrabold">About this drop</h2>
          <p className="leading-relaxed">{product.description || 'A legendary drop full of personality and soul — crafted for people who love story and style.'}</p>
          {isAuctionListing || isRaffleListing ? (
            <p className="italic">
              This listing is LIVE —
              {isAuctionListing ? ' place a bid during the auction' : ''}
              {isAuctionListing && isRaffleListing ? ', or' : ''}
              {isRaffleListing ? ' join the raffle' : ''}
              {(!isAuctionListing && !isRaffleListing) ? '' : '.'}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-6 sticky top-6">
        <div className="rounded-md border p-6 bg-background">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {product.subtitle && <p className="text-sm text-muted-foreground">{product.subtitle}</p>}
          {isAuctionListing && countdown && (
            <div className="mt-2 px-2 py-1 rounded-md bg-accent/5 text-sm font-medium">
              ⏱️ {countdown}
            </div>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl font-extrabold">{product.currency || '$'}{product.price}</div>
            <div className="text-sm text-muted-foreground">Buy it now</div>
          </div>

          {isAuctionListing ? (
            <>
              <div className="mt-6">
                <div className="text-sm text-muted-foreground">Current highest bid</div>
                <div className="text-lg font-semibold">{product.currency || '$'}{product.currentBid ?? '—'}</div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium">Place a bid</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className={cn("input w-full")}
                    min={product.currentBid ? product.currentBid + 1 : 1}
                  />
                  <Button onClick={placeBid} disabled={loading || (auctionStart ? now < auctionStart : false)} variant="secondary">Bid</Button>
                </div>
              </div>
            </>
          ) : null}

          <div className="mt-6 flex gap-3">
            <Button onClick={buyNow} disabled={loading || auctionActive} className="flex-1" title={auctionActive ? 'Buy Now disabled during active auction' : undefined}>Buy Now</Button>
            <Button onClick={() => setMessage('💬 Contact seller — feature coming soon')} variant="ghost">Message</Button>
          </div>
          {isAuctionListing && auctionActive && (
            <div className="mt-2 text-sm italic text-muted-foreground">Buy Now is disabled while the auction is active.</div>
          )}
        </div>

        {isRaffleListing ? (
          <div className="rounded-md border p-6 bg-background">
            <h3 className="text-lg font-semibold">Raffle</h3>
            <p className="text-sm text-muted-foreground mt-1">Buy raffle tickets for a chance to win this item — low entry, big thrill.</p>
            {product.raffle?.ticketPrice ? (
              <div className="mt-2 text-sm text-muted-foreground">
                Ticket: <span className="text-foreground font-medium">{product.raffle.currency || product.currency || '$'}{product.raffle.ticketPrice}</span>
              </div>
            ) : null}
            <div className="mt-3 flex items-center gap-2">
              <input type="number" min={1} value={qtyTickets} onChange={(e) => setQtyTickets(Number(e.target.value))} className="input w-24" />
              <Button onClick={buyRaffle} disabled={loading}>Buy Tickets</Button>
            </div>
          </div>
        ) : null}

        {message && (
          <div className="rounded-md border p-4 bg-muted/40">{message}</div>
        )}
      </aside>
    </section>
  )
}
