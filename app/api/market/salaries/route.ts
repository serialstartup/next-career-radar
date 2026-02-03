import { NextResponse } from 'next/server'
import { getSalaryInsights } from '@/lib/data/market'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') || undefined
  const country = searchParams.get('country') || undefined

  const { range, byCountry } = await getSalaryInsights({ role, country })
  return NextResponse.json({ range, byCountry })
}
