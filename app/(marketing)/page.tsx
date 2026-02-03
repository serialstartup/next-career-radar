import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  BarChart3,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Play,
  Users,
  Globe,
  Star,
  Zap,
  UserPlus,
  FileEdit,
  Search,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Career Radar - Build Your Career with Confidence",
  description:
    "Create a standout CV and discover real job market insights to land your dream job. AI-powered CV builder with real-time market intelligence.",
  keywords: [
    "CV builder",
    "resume builder",
    "job market insights",
    "career development",
    "skill gap analysis",
    "job matching",
  ],
  openGraph: {
    title: "Career Radar - Build Your Career with Confidence",
    description:
      "Create a standout CV and discover real job market insights to land your dream job.",
    type: "website",
  },
};

const features = [
  {
    icon: FileText,
    title: "CV Builder",
    description:
      "Step-by-step CV editor with live preview and smart suggestions to create professional resumes.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description:
      "Real-time job market data showing skill demand and salary trends across industries.",
  },
  {
    icon: Target,
    title: "Job Matching",
    description:
      "AI-powered matching to find jobs that fit your skills and career aspirations.",
  },
  {
    icon: TrendingUp,
    title: "Career Insights",
    description:
      "Trending skills and growing roles to guide your career path and development.",
  },
];

const howItWorks = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us about your experience and career goals",
    color: "bg-primary",
  },
  {
    step: 2,
    icon: FileEdit,
    title: "Build Your CV",
    description: "Use our guided editor to create a professional CV",
    color: "bg-chart-3",
  },
  {
    step: 3,
    icon: Search,
    title: "Discover Opportunities",
    description: "Get matched with jobs and see market insights",
    color: "bg-chart-4",
  },
];

const stats = [
  {
    icon: FileText,
    value: "10,000+",
    label: "CVs Created",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries Covered",
  },
  {
    icon: Star,
    value: "95%",
    label: "User Satisfaction",
  },
  {
    icon: Zap,
    value: "Real-time",
    label: "Market Data",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp",
    content:
      "Career Radar helped me understand exactly what skills I needed to land my dream job. The market insights were invaluable!",
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "StartupXYZ",
    content:
      "The CV builder is incredibly intuitive. I created a professional resume in under 30 minutes and got callbacks within a week.",
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Analyst",
    company: "Analytics Inc",
    content:
      "The skill gap analysis showed me exactly where to focus my learning. I'm now earning 40% more than my previous role.",
    avatar: "ER",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-xl">
              <Badge variant="secondary" className="mb-4">
                🚀 Your Career Journey Starts Here
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Build Your Career with{" "}
                <span className="text-primary">Confidence</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Create a standout CV and discover real job market insights to
                land your dream job. Career Radar bridges the gap between your
                skills and market demands.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">
                    <Play className="mr-2 h-4 w-4" />
                    See How It Works
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-8">
              {/* Hero Illustration Placeholder */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-chart-3/20 to-chart-4/20 shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    {/* Abstract shapes representing career growth */}
                    <div className="relative w-64 h-64 mx-auto">
                      {/* Background circles */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-primary/30 blur-xl" />
                      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-chart-3/30 blur-xl" />
                      <div className="absolute bottom-8 left-0 w-20 h-20 rounded-full bg-chart-4/30 blur-xl" />
                      
                      {/* Central icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                              <div className="h-2 w-20 bg-foreground/20 rounded mb-2" />
                              <div className="h-2 w-16 bg-foreground/10 rounded" />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="h-2 w-full bg-foreground/10 rounded" />
                            <div className="h-2 w-3/4 bg-foreground/10 rounded" />
                            <div className="h-2 w-5/6 bg-foreground/10 rounded" />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              Skills
                            </Badge>
                            <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/20">
                              Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Career Radar?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Empowering job seekers with the data and insights they need to
              succeed in a highly competitive market.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="relative overflow-hidden border-0 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              The Process
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line connector */}
              <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-border hidden md:block" />

              <div className="space-y-8 md:space-y-12">
                {howItWorks.map((item, index) => (
                  <div key={item.step} className="relative flex gap-6">
                    {/* Step indicator */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color} text-white font-semibold z-10`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8 md:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Step {item.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Trusted by Thousands
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Numbers that speak for themselves
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What our users say
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="relative overflow-hidden border-0 shadow-card"
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 text-center sm:px-16 lg:px-24">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Start Your Career Journey?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join thousands of professionals who use Career Radar to make
                informed career decisions and land their dream jobs.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
