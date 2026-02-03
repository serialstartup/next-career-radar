import { NextResponse } from 'next/server'
import { getMarketMeta } from '@/lib/data/market'

export async function GET() {
  const meta = await getMarketMeta()
  return NextResponse.json(meta)
}
