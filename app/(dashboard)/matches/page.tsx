import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Clock, Bookmark, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Job Matches",
  description: "View your matched job opportunities",
};

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

const jobMatches = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "London, UK",
    type: "Full-time",
    salary: "£65,000 - £85,000",
    matchScore: 92,
    skills: ["React", "TypeScript", "Next.js"],
    postedAt: "2 days ago",
    remote: true,
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Manchester, UK",
    type: "Full-time",
    salary: "£55,000 - £70,000",
    matchScore: 87,
    skills: ["React", "Node.js", "PostgreSQL"],
    postedAt: "3 days ago",
    remote: true,
  },
  {
    id: 3,
    title: "React Developer",
    company: "Digital Agency",
    location: "Remote",
    type: "Contract",
    salary: "£450 - £550/day",
    matchScore: 85,
    skills: ["React", "TypeScript", "Tailwind"],
    postedAt: "1 week ago",
    remote: true,
  },
];

export default function JobMatchesPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Job Matches" showSearch user={mockUser} />
      
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Matches</h2>
            <p className="text-muted-foreground">
              Jobs that match your profile and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer">All</Badge>
            <Badge variant="outline" className="cursor-pointer">Remote</Badge>
            <Badge variant="outline" className="cursor-pointer">On-site</Badge>
          </div>
        </div>

        <div className="space-y-4">
          {jobMatches.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Building2 className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{job.matchScore}%</p>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedAt}
                      </span>
                      <Badge variant="secondary">{job.type}</Badge>
                      {job.remote && <Badge variant="outline">Remote</Badge>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm font-medium">{job.salary}</p>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button className="flex-1 lg:flex-none">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
