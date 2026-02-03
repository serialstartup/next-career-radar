-- ============================================================================
-- Migration: 006_create_rls_policies.sql
-- Description: Create Row Level Security (RLS) policies for all tables
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Profile is created automatically via trigger, but allow insert for edge cases
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can delete their own profile (cascades to related data)
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ============================================================================
-- USER PREFERENCES POLICIES
-- ============================================================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
ON user_preferences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
ON user_preferences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
ON user_preferences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
ON user_preferences FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- CV PROFILES POLICIES
-- ============================================================================

-- Users can view their own CV profiles
CREATE POLICY "Users can view own cv_profiles"
ON cv_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own CV profiles
CREATE POLICY "Users can insert own cv_profiles"
ON cv_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own CV profiles
CREATE POLICY "Users can update own cv_profiles"
ON cv_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own CV profiles
CREATE POLICY "Users can delete own cv_profiles"
ON cv_profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- CV SKILLS POLICIES
-- ============================================================================

-- Users can view skills from their own CVs
CREATE POLICY "Users can view own cv_skills"
ON cv_skills FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_skills.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can insert skills to their own CVs
CREATE POLICY "Users can insert own cv_skills"
ON cv_skills FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_skills.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can update skills in their own CVs
CREATE POLICY "Users can update own cv_skills"
ON cv_skills FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_skills.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_skills.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can delete skills from their own CVs
CREATE POLICY "Users can delete own cv_skills"
ON cv_skills FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_skills.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- ============================================================================
-- CV EXPERIENCES POLICIES
-- ============================================================================

-- Users can view experiences from their own CVs
CREATE POLICY "Users can view own cv_experiences"
ON cv_experiences FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_experiences.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can insert experiences to their own CVs
CREATE POLICY "Users can insert own cv_experiences"
ON cv_experiences FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_experiences.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can update experiences in their own CVs
CREATE POLICY "Users can update own cv_experiences"
ON cv_experiences FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_experiences.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_experiences.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can delete experiences from their own CVs
CREATE POLICY "Users can delete own cv_experiences"
ON cv_experiences FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_experiences.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- ============================================================================
-- CV EDUCATION POLICIES
-- ============================================================================

-- Users can view education from their own CVs
CREATE POLICY "Users can view own cv_education"
ON cv_education FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_education.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can insert education to their own CVs
CREATE POLICY "Users can insert own cv_education"
ON cv_education FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_education.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can update education in their own CVs
CREATE POLICY "Users can update own cv_education"
ON cv_education FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_education.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_education.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- Users can delete education from their own CVs
CREATE POLICY "Users can delete own cv_education"
ON cv_education FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM cv_profiles
        WHERE cv_profiles.id = cv_education.cv_profile_id
        AND cv_profiles.user_id = auth.uid()
    )
);

-- ============================================================================
-- JOBS RAW POLICIES
-- ============================================================================

-- All authenticated users can view active jobs
CREATE POLICY "Authenticated users can view active jobs"
ON jobs_raw FOR SELECT
TO authenticated
USING (is_active = TRUE);

-- Only service role can insert jobs (via API/cron)
CREATE POLICY "Service role can insert jobs"
ON jobs_raw FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Only service role can update jobs
CREATE POLICY "Service role can update jobs"
ON jobs_raw FOR UPDATE
TO service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Only service role can delete jobs
CREATE POLICY "Service role can delete jobs"
ON jobs_raw FOR DELETE
TO service_role
USING (TRUE);

-- ============================================================================
-- JOB SKILLS POLICIES
-- ============================================================================

-- All authenticated users can view job skills
CREATE POLICY "Authenticated users can view job_skills"
ON job_skills FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM jobs_raw
        WHERE jobs_raw.id = job_skills.job_id
        AND jobs_raw.is_active = TRUE
    )
);

-- Only service role can insert job skills
CREATE POLICY "Service role can insert job_skills"
ON job_skills FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Only service role can update job skills
CREATE POLICY "Service role can update job_skills"
ON job_skills FOR UPDATE
TO service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Only service role can delete job skills
CREATE POLICY "Service role can delete job_skills"
ON job_skills FOR DELETE
TO service_role
USING (TRUE);

-- ============================================================================
-- MARKET STATS POLICIES
-- ============================================================================

-- All authenticated users can view market stats
CREATE POLICY "Authenticated users can view market_stats"
ON market_stats FOR SELECT
TO authenticated
USING (TRUE);

-- Only service role can insert market stats
CREATE POLICY "Service role can insert market_stats"
ON market_stats FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Only service role can update market stats
CREATE POLICY "Service role can update market_stats"
ON market_stats FOR UPDATE
TO service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Only service role can delete market stats
CREATE POLICY "Service role can delete market_stats"
ON market_stats FOR DELETE
TO service_role
USING (TRUE);

-- ============================================================================
-- MATCHES POLICIES
-- ============================================================================

-- Users can view their own matches
CREATE POLICY "Users can view own matches"
ON matches FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role can insert matches (calculated by system)
CREATE POLICY "Service role can insert matches"
ON matches FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Users can also insert their own matches (for on-demand calculation)
CREATE POLICY "Users can insert own matches"
ON matches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own matches (e.g., mark as viewed)
CREATE POLICY "Users can update own matches"
ON matches FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role can update any match
CREATE POLICY "Service role can update matches"
ON matches FOR UPDATE
TO service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Users can delete their own matches
CREATE POLICY "Users can delete own matches"
ON matches FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED JOBS POLICIES
-- ============================================================================

-- Users can view their own saved jobs
CREATE POLICY "Users can view own saved_jobs"
ON saved_jobs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own saved jobs
CREATE POLICY "Users can insert own saved_jobs"
ON saved_jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved jobs
CREATE POLICY "Users can update own saved_jobs"
ON saved_jobs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved jobs
CREATE POLICY "Users can delete own saved_jobs"
ON saved_jobs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- JOB APPLICATIONS POLICIES
-- ============================================================================

-- Users can view their own applications
CREATE POLICY "Users can view own job_applications"
ON job_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert own job_applications"
ON job_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own job_applications"
ON job_applications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own applications
CREATE POLICY "Users can delete own job_applications"
ON job_applications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view own profile" ON profiles IS 'Users can only view their own profile';
COMMENT ON POLICY "Authenticated users can view active jobs" ON jobs_raw IS 'All authenticated users can view active job postings';
COMMENT ON POLICY "Authenticated users can view market_stats" ON market_stats IS 'Market statistics are public to all authenticated users';
COMMENT ON POLICY "Service role can insert jobs" ON jobs_raw IS 'Only backend services can insert job data';
