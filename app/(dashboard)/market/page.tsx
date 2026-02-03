import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Flame, Clock, DollarSign } from "lucide-react";
import { MarketFilterBar } from "@/components/market/filter-bar";
import { getMarketStats, getTopSkills, getSalaryInsights } from "@/lib/data/market";
import { DEFAULT_ROLE, DEFAULT_COUNTRY, DEFAULT_TYPE } from "@/lib/constants/market";
import { getCurrencySymbol } from "@/lib/format/currency";

export const metadata = {
  title: "Market Intelligence",
  description: "Explore job market trends and insights",
};

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

type StatsResponse = {
  marketHotness: number
  activeJobs: number
  activeJobsChangePct: number
  avgTimeToHireDays: number
  timeToHireTrend: 'up' | 'down' | 'stable'
  updatedAgo: string
}

type Skill = { skill: string; percentage: number }

async function getData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL
    if (!base) throw new Error('BASE_URL not set, fallback to local data')
    const [statsRes, skillsRes, salariesRes] = await Promise.all([
      fetch(`${base}/api/market/stats`, { cache: 'no-store' }),
      fetch(`${base}/api/market/skills`, { cache: 'no-store' }),
      fetch(`${base}/api/market/salaries`, { cache: 'no-store' }),
    ])

    const stats: StatsResponse = await statsRes.json()
    const skillsJson = await skillsRes.json()
    const salariesJson = await salariesRes.json()

    return { stats, topSkills: (skillsJson.data as Skill[]), salary: salariesJson.range }
  } catch {
    // Fallback to in-process mock data for environments without a running server
    const { getMockMarketStats, getMockTopSkills, getMockSalaryInsights } = await import('@/lib/mock/market')
    const stats = getMockMarketStats({}) as StatsResponse
    const topSkills = getMockTopSkills({}) as Skill[]
    const { range: salary } = getMockSalaryInsights({})
    return { stats, topSkills, salary }
  }
}

export default async function MarketIntelligencePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const role = typeof searchParams?.role === 'string' ? searchParams.role : DEFAULT_ROLE
  const country = typeof searchParams?.country === 'string' ? searchParams.country : DEFAULT_COUNTRY
  const type = typeof searchParams?.type === 'string' ? searchParams.type : DEFAULT_TYPE

  const [stats, topSkills, { range: salary, byCountry: salaryByCountry }] = await Promise.all([
    getMarketStats({ role, country, type }),
    getTopSkills({ role, country, type }),
    getSalaryInsights({ role, country }),
  ])
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Market Intelligence" showSearch user={mockUser} />
      
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Filters */}
        <MarketFilterBar />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Market Hotness</p>
                  <p className="text-3xl font-bold mt-1">{stats.marketHotness}/100</p>
                  <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    High Demand
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated {stats.updatedAgo} ago</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Job Postings</p>
                  <p className="text-3xl font-bold mt-1">{stats.activeJobs.toLocaleString()}</p>
                  <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {stats.activeJobsChangePct > 0 ? `+${stats.activeJobsChangePct}%` : `${stats.activeJobsChangePct}%`} vs last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Time to Hire</p>
                  <p className="text-3xl font-bold mt-1">{stats.avgTimeToHireDays} Days</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {stats.timeToHireTrend === 'up' ? 'Rising' : stats.timeToHireTrend === 'down' ? 'Falling' : 'Stable trend'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills and Salary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Most Demanded Skills</CardTitle>
              <CardDescription>Based on current job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!topSkills || topSkills.length === 0) && (
                <p className="text-sm text-muted-foreground">No skill data for current filters.</p>
              )}
              {topSkills?.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.skill}</span>
                    <span className="text-primary">{skill.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Insights (Yearly)</CardTitle>
              <CardDescription>Based on market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum</p>
                    <p className="text-xl font-semibold">£{salary.min.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-sm text-muted-foreground">Median</p>
                    <p className="text-xl font-semibold text-primary">£{salary.median.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">Maximum</p>
                    <p className="text-xl font-semibold">£{salary.max.toLocaleString()}+</p>
                  </div>
                </div>
                <div className="h-3 bg-gradient-to-r from-muted via-primary to-muted rounded-full" />
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Career Insight:</span>{" "}
                    <span className="text-muted-foreground">
                      Positions with Next.js and React skills command a 12% salary premium in the UK market.
                    </span>
                  </p>
                </div>

                {/* Country breakdown */}
                <div>
                  <p className="text-sm font-medium mb-2">Top Countries</p>
                  <div className="grid gap-2 md:grid-cols-3">
                    {!salaryByCountry?.length && (
                      <p className="text-sm text-muted-foreground">No country breakdown for current filters.</p>
                    )}
                    {salaryByCountry?.slice(0,3).map((c: any) => {
                      const sym = getCurrencySymbol(c.salary_currency)
                      return (
                        <div key={c.country} className="rounded-md border p-3 bg-card">
                          <p className="text-xs text-muted-foreground">{c.country}</p>
                          <p className="text-sm font-medium">{sym}{c.avg_salary_min.toLocaleString()} - {sym}{c.avg_salary_max.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Jobs: {c.job_count}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="bg-sidebar text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Ready to level up?</h3>
                <p className="text-white/80 mt-1">
                  Our Radar suggests that adding <span className="font-medium">Cloud Infrastructure (AWS/Azure)</span> knowledge to your Frontend profile could increase your employability score by <span className="font-medium">22%</span>.
                </p>
              </div>
              <div className="flex gap-4 text-center">
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-white/60">Remote-Friendly</p>
                  <p className="text-xl font-bold">65%</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-white/60">Junior Roles</p>
                  <p className="text-xl font-bold">14%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
