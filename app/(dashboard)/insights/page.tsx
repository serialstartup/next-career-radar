import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lightbulb, Target, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Career Insights",
  description: "Personalized career insights and recommendations",
};

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

const skillGaps = [
  { skill: "AWS/Cloud", importance: "High", trend: "up" },
  { skill: "GraphQL", importance: "Medium", trend: "up" },
  { skill: "Testing (Jest)", importance: "Medium", trend: "stable" },
];

const recommendations = [
  {
    title: "Learn AWS Fundamentals",
    description: "Cloud skills are in high demand. Start with AWS basics to increase your market value.",
    type: "Learning",
    impact: "+15% employability",
  },
  {
    title: "Add GraphQL to Your Stack",
    description: "Many companies are adopting GraphQL. It pairs well with your React expertise.",
    type: "Skill",
    impact: "+10% salary potential",
  },
  {
    title: "Update Your CV",
    description: "Your CV hasn't been updated in 2 weeks. Keep it fresh with recent projects.",
    type: "Action",
    impact: "Better visibility",
  },
];

export default function CareerInsightsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Career Insights" user={mockUser} />
      
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employability Score</p>
                  <p className="text-2xl font-bold">78/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Alignment</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Skill Gaps</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Skills that could boost your career based on market demand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {gap.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{gap.skill}</span>
                  </div>
                  <Badge
                    variant={gap.importance === "High" ? "default" : "secondary"}
                  >
                    {gap.importance}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View Full Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Actions to improve your career prospects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                      <p className="text-sm text-primary mt-2 font-medium">
                        {rec.impact}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Learning Resources
            </CardTitle>
            <CardDescription>
              Curated resources to help you close skill gaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer">
                <Badge className="mb-2">Course</Badge>
                <h4 className="font-medium">AWS Cloud Practitioner</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Foundational cloud knowledge
                </p>
                <p className="text-xs text-muted-foreground mt-2">~20 hours</p>
              </div>
              <div className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer">
                <Badge className="mb-2">Tutorial</Badge>
                <h4 className="font-medium">GraphQL with React</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Modern API development
                </p>
                <p className="text-xs text-muted-foreground mt-2">~8 hours</p>
              </div>
              <div className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer">
                <Badge className="mb-2">Practice</Badge>
                <h4 className="font-medium">Testing Best Practices</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Jest & React Testing Library
                </p>
                <p className="text-xs text-muted-foreground mt-2">~6 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
