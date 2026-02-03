// Single data provider for Market features.
// Today uses local mocks; later swap to Supabase RPCs here.

import {
  getMockMarketStats,
  getMockMeta,
  getMockSalaryInsights,
  getMockTopSkills,
} from '@/lib/mock/market'

export type MarketStatsOverview = {
  marketHotness: number
  activeJobs: number
  activeJobsChangePct: number
  avgTimeToHireDays: number
  timeToHireTrend: 'up' | 'down' | 'stable'
  updatedAgo: string
}

export type SkillDemand = { skill: string; percentage: number }

export type SalaryRange = { min: number; median: number; max: number; currency: string }

export type SalaryInsight = { country: string; avg_salary_min: number; avg_salary_max: number; salary_currency: string; job_count: number }

export async function getMarketMeta() {
  // placeholder to swap with Supabase tables later (roles/countries/job_types)
  return getMockMeta()
}

export async function getMarketStats(params: { role?: string; country?: string; type?: string }) {
  return getMockMarketStats(params) as MarketStatsOverview
}

export async function getTopSkills(params: { role?: string; country?: string; type?: string }) {
  return getMockTopSkills(params) as SkillDemand[]
}

export async function getSalaryInsights(params: { role?: string; country?: string }) {
  const { range, byCountry } = getMockSalaryInsights(params)
  return { range: range as SalaryRange, byCountry: byCountry as SalaryInsight[] }
}

