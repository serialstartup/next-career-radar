import { NextResponse } from 'next/server'
import { getMarketStats } from '@/lib/data/market'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') || undefined
  const country = searchParams.get('country') || undefined
  const type = searchParams.get('type') || undefined

  const stats = await getMarketStats({ role, country, type })
  return NextResponse.json(stats)
}
