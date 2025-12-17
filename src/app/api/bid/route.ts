import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, amount } = body
    if (!productId || !amount) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 })
    }
    // TODO: integrate with real bidding backend
    return NextResponse.json({ success: true, productId, amount })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
