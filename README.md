# Career Radar - CV Intelligence Platform

A modern CV intelligence platform built with Next.js 16, featuring AI-powered CV building, real-time market insights, and job matching capabilities.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd cv-market-app
pnpm install
```

### 2. Environment Setup

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```env
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (Required for full functionality)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Get Supabase credentials:**
- Follow the [Supabase Setup Guide](SUPABASE_SETUP.md)
- Or use mock data for development (limited functionality)

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
cv-market-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── cv/
│   │   │   └── editor/     # CV Editor
│   │   ├── market/         # Market Intelligence
│   │   ├── matches/        # Job Matches
│   │   ├── insights/       # Career Insights
│   │   └── settings/
│   ├── (marketing)/         # Marketing pages
│   │   └── page.tsx        # Landing page
│   ├── onboarding/         # User onboarding
│   └── api/               # API routes
├── components/
│   ├── auth/              # Auth components
│   ├── cv/                # CV components
│   │   ├── cv-preview.tsx # CV Preview
│   │   └── ...
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives
├── lib/
│   ├── actions/           # Server actions
│   ├── cv/
│   │   ├── export.ts     # CV Export utilities
│   │   └── ...
│   ├── data/              # Data layer
│   ├── mock/              # Mock data
│   └── supabase/          # Supabase client
├── types/                 # TypeScript types
└── supabase/
    └── migrations/        # Database migrations
```

## 🎯 Key Features

- **CV Builder** - Create and edit professional CVs with AI assistance
- **Market Intelligence** - Real-time job market insights and salary data
- **Job Matching** - AI-powered job matching based on your skills
- **Career Insights** - Personalized recommendations and skill gap analysis

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Migrations

```bash
# Using Supabase CLI
supabase db push

# Or manually run SQL files in supabase/migrations/
```

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **State:** React Server Components + useState/useTransition

## 🔐 Authentication

The app uses Supabase Auth for:
- Email/password authentication
- Social login (Google, GitHub)
- Password reset
- Email confirmation

## 📊 Data Sources

- **Market Data:** Mock data (development) / Supabase (production)
- **Job Listings:** Aggregated from multiple sources
- **Salary Data:** Market intelligence reports

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t career-radar .
docker run -p 3000:3000 career-radar
```

## 📝 License

MIT

## 📞 Support

For issues and feature requests, please open a GitHub issue.
