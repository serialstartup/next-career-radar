-- ============================================================================
-- Migration: 001_create_profiles.sql
-- Description: Create profiles and user_preferences tables with Supabase Auth integration
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Experience level enum (used in multiple tables)
CREATE TYPE experience_level AS ENUM (
    'entry',
    'junior',
    'mid',
    'senior',
    'lead',
    'executive'
);

-- Primary goal from onboarding
CREATE TYPE primary_goal AS ENUM (
    'find_job',
    'explore_market',
    'improve_cv'
);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Links to Supabase auth.users table via id (same UUID)
-- This is the standard Supabase pattern for extending user data

CREATE TABLE profiles (
    -- Primary key matches auth.users.id
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic info
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Onboarding status
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================
-- Stores onboarding data and notification preferences
-- One-to-one relationship with profiles

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Onboarding preferences
    target_roles TEXT[] DEFAULT '{}',
    target_countries TEXT[] DEFAULT '{}',
    experience_level experience_level,
    primary_goal primary_goal,
    
    -- Notification preferences
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    job_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Handle new user signup
-- ============================================================================
-- Automatically creates a profile when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Also create default user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether user has completed the onboarding flow';

COMMENT ON TABLE user_preferences IS 'User preferences and onboarding data';
COMMENT ON COLUMN user_preferences.target_roles IS 'Array of target job roles from onboarding';
COMMENT ON COLUMN user_preferences.target_countries IS 'Array of target countries from onboarding';
COMMENT ON COLUMN user_preferences.experience_level IS 'User experience level from onboarding';
COMMENT ON COLUMN user_preferences.primary_goal IS 'Primary goal selected during onboarding';
