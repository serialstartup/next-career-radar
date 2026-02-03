import { NextResponse } from 'next/server'
import { getTopSkills } from '@/lib/data/market'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') || undefined
  const country = searchParams.get('country') || undefined
  const type = searchParams.get('type') || undefined

  const data = await getTopSkills({ role, country, type })
  return NextResponse.json({ data })
}
