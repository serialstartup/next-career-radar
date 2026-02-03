import Link from "next/link";
import { Radar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Conditionally import Supabase
async function getUserProfile() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { user: null, profile: null };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();
      profile = data;
    }

    return { user, profile };
  } catch {
    return { user: null, profile: null };
  }
}

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserProfile();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Radar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Career Radar
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!user && (
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Already a member?{" "}
                <span className="text-primary font-medium">Log in</span>
              </Link>
            )}
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
