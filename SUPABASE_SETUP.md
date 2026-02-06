# Career Radar - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `career-radar` (or your preferred name)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
4. Click "Create new project"

## 2. Get Environment Variables

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Go to **Project Settings** > **API** > **service_role** key
   - Copy the **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **NEVER** expose this to the client!

## 3. Configure Authentication

### Email Templates
1. Go to **Authentication** > **Email Templates**
2. Customize:
   - **Confirm email** template
   - **Reset password** template
   - **Invite user** template

### URL Configuration
1. Go to **Authentication** > **URL Configuration**
2. Add your site URL:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: 
     - `http://localhost:3000`
     - `https://your-production-domain.com`

### OAuth Providers (Optional)
To enable Google/GitHub login:

1. **Google**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Copy Client ID/Secret to Supabase

2. **GitHub**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create OAuth App
   - Add callback URL: `https://[YOUR-PROJECT].supabase.co/auth/v1/callback`
   - Copy Client ID/Secret to Supabase

## 4. Run Database Migrations

### Option A: Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
cd cv-market-app
supabase link --project-id [YOUR-PROJECT-ID]

# Push migrations
supabase db push
```

### Option B: Supabase Dashboard SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run migrations in order:
   - `supabase/migrations/001_create_profiles.sql`
   - `supabase/migrations/002_create_cv_tables.sql`
   - `supabase/migrations/003_create_job_tables.sql`
   - `supabase/migrations/004_create_market_tables.sql`
   - `supabase/migrations/005_create_matching_tables.sql`
   - `supabase/migrations/006_create_rls_policies.sql`

## 5. Environment Variables

Create `.env.local` in `cv-market-app/` directory:

```env
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional - OAuth Providers
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 6. Test the Setup

1. Start the development server:
   ```bash
   cd cv-market-app
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test:
   - Registration flow
   - Login flow
   - Password reset flow

## 7. Troubleshooting

### Common Issues

**"JWT token is invalid"**
- Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**"Row level security policy" errors**
- Ensure RLS policies are applied
- Check that tables are created

**"Email not confirmed"**
- Check Supabase auth settings
- Verify email templates are configured

### Enable Console Logging

Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## 8. Production Deployment

For production:

1. Update `NEXT_PUBLIC_BASE_URL` to your production URL
2. Add production URL to Supabase redirect URLs
3. Enable email confirmations in Supabase auth settings
4. Set up custom SMTP (optional):
   - Go to **Authentication** > **Providers** > **Email**
   - Configure custom SMTP settings

## 9. Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key never exposed to client
- [ ] Environment variables set correctly
- [ ] Redirect URLs configured for production
- [ ] OAuth secrets stored securely
- [ ] Email templates customized
