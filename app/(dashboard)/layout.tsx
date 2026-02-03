import { Sidebar } from "@/components/layout/sidebar";

// Mock user data - in production this would come from auth context
const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
  avatar: undefined,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={mockUser} />
      <main className="flex-1 lg:pl-0">
        {children}
      </main>
    </div>
  );
}
