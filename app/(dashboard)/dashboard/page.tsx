import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Target, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
  description: "Your Career Radar dashboard",
};

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

const quickActions = [
  {
    title: "CV Builder",
    description: "Create or update your CV",
    icon: FileText,
    href: "/cv",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Market Intelligence",
    description: "Explore job market trends",
    icon: BarChart3,
    href: "/market",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Job Matches",
    description: "View your matched jobs",
    icon: Target,
    href: "/matches",
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Career Insights",
    description: "Get personalized insights",
    icon: TrendingUp,
    href: "/insights",
    color: "bg-orange-500/10 text-orange-500",
  },
];

const stats = [
  { label: "Profile Completion", value: "75%", change: "+5%" },
  { label: "Job Matches", value: "24", change: "+3" },
  { label: "Market Score", value: "85/100", change: "+2" },
  { label: "Skills Matched", value: "12", change: "+1" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Dashboard" user={mockUser} />
      
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {mockUser.name.split(" ")[0]}!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your career journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 font-semibold">{action.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Button variant="ghost" className="mt-4 p-0 h-auto" asChild>
                    <Link href={action.href} className="flex items-center gap-1 text-primary">
                      Get started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">CV Updated</p>
                  <p className="text-xs text-muted-foreground">Added new work experience</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Target className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Job Match</p>
                  <p className="text-xs text-muted-foreground">Senior Developer at TechCorp</p>
                </div>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Market Report Ready</p>
                  <p className="text-xs text-muted-foreground">Weekly insights for Frontend Developer</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
