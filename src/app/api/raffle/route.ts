import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, tickets } = body
    if (!productId || !tickets) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 })
    }
    // TODO: integrate with raffle backend and ticket allocation
    return NextResponse.json({ success: true, productId, tickets })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
