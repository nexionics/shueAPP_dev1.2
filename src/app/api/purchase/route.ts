import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, quantity } = body
    if (!productId || !quantity) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 })
    }
    // TODO: integrate with payments and order processing
    return NextResponse.json({ success: true, productId, quantity })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
