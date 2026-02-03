import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export const metadata = {
  title: "CV Builder",
  description: "Create and manage your CVs",
};

const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

export default function CVBuilderPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="CV Builder" user={mockUser} />
      
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your CVs</h2>
            <p className="text-muted-foreground">
              Create and manage your professional CVs
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New CV
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Existing CV Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Last edited 2h ago</span>
              </div>
              <CardTitle className="mt-4">Software Engineer CV</CardTitle>
              <CardDescription>Tailored for tech companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
            </CardContent>
          </Card>

          {/* Create New CV Card */}
          <Card className="border-dashed hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="p-3 rounded-full bg-muted">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">Create New CV</p>
              <p className="text-sm text-muted-foreground">
                Start from scratch or use a template
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
