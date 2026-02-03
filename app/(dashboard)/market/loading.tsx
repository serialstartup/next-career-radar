import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatsSkeleton, SkillsSkeleton, SalarySkeleton } from "@/components/market/skeletons";

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

export default function Loading() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Market Intelligence" showSearch user={mockUser} />
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="h-6 w-80 bg-muted rounded" />
        <StatsSkeleton />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkillsSkeleton />
          <SalarySkeleton />
        </div>
        <div className="h-28 bg-sidebar/80 rounded" />
      </div>
    </div>
  )
}

