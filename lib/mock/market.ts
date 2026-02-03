// Centralized mock data for Market Intelligence screens
// Shapes mirror planned Supabase RPC returns so we can swap later.

export type MarketStatsOverview = {
  marketHotness: number; // 0-100
  activeJobs: number;
  activeJobsChangePct: number; // monthly change in %
  avgTimeToHireDays: number;
  timeToHireTrend: 'up' | 'down' | 'stable';
  updatedAgo: string; // e.g., "2h"
};

export type SkillDemand = {
  skill: string;
  percentage: number; // 0-100
};

export type SalaryRange = {
  min: number;
  median: number;
  max: number;
  currency: string; // e.g., GBP
};

export type SalaryInsight = {
  country: string;
  avg_salary_min: number;
  avg_salary_max: number;
  salary_currency: string;
  job_count: number;
};

export const mockMarketStats: MarketStatsOverview = {
  marketHotness: 85,
  activeJobs: 1240,
  activeJobsChangePct: 5,
  avgTimeToHireDays: 18,
  timeToHireTrend: 'stable',
  updatedAgo: '2h',
};

export const mockTopSkills: SkillDemand[] = [
  { skill: 'React', percentage: 92 },
  { skill: 'TypeScript', percentage: 84 },
  { skill: 'Next.js', percentage: 76 },
  { skill: 'Tailwind CSS', percentage: 68 },
  { skill: 'Node.js', percentage: 65 },
];

export const mockSalary: SalaryRange = {
  min: 45000,
  median: 65000,
  max: 95000,
  currency: 'GBP',
};

export const mockSalaryInsightsByCountry: SalaryInsight[] = [
  { country: 'United Kingdom', avg_salary_min: 45000, avg_salary_max: 95000, salary_currency: 'GBP', job_count: 820 },
  { country: 'Ireland', avg_salary_min: 50000, avg_salary_max: 90000, salary_currency: 'EUR', job_count: 140 },
  { country: 'Germany', avg_salary_min: 55000, avg_salary_max: 100000, salary_currency: 'EUR', job_count: 210 },
];

// Helpers to simulate filters; params currently ignored but kept for parity.
export function getMockTopSkills(params?: { role?: string; country?: string; type?: string }) {
  return mockTopSkills;
}

export function getMockMarketStats(params?: { role?: string; country?: string; type?: string }): MarketStatsOverview {
  return mockMarketStats;
}

export function getMockSalaryInsights(params?: { role?: string; country?: string }) {
  return { range: mockSalary, byCountry: mockSalaryInsightsByCountry };
}

// Meta for filters
export const mockRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
]

export const mockCountries = [
  'United Kingdom',
  'Germany',
  'Ireland',
]

export const mockJobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'part-time', label: 'Part-time' },
]

export function getMockMeta() {
  return { roles: mockRoles, countries: mockCountries, jobTypes: mockJobTypes }
}
