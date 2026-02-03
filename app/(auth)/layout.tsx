import Link from "next/link";
import { Radar } from "lucide-react";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Your career is your business. It's time for you to manage it as a CEO.",
    author: "Dorit Sher",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the first quote (could be rotated server-side in production)
  const quote = quotes[0];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Radar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Career Radar
            </span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Career Radar. All rights reserved.
        </footer>
      </div>

      {/* Right Side - Gradient Background with Quote (Desktop Only) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Quote Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            {/* Quote Icon */}
            <svg
              className="w-12 h-12 mx-auto mb-6 opacity-50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            {/* Quote Text */}
            <blockquote className="text-2xl font-medium leading-relaxed mb-6">
              &ldquo;{quote.text}&rdquo;
            </blockquote>

            {/* Author */}
            <p className="text-lg opacity-80">— {quote.author}</p>
          </div>

          {/* Bottom Stats */}
          <div className="absolute bottom-12 left-12 right-12">
            <div className="flex justify-center gap-12 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-70">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-70">Jobs Matched</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm opacity-70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
