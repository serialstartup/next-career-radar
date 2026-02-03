-- ============================================================================
-- Migration: 005_create_matching_tables.sql
-- Description: Create matching-related tables (matches, saved_jobs, job_applications)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Application status enum
CREATE TYPE application_status AS ENUM (
    'draft',
    'applied',
    'screening',
    'interviewing',
    'offer',
    'rejected',
    'withdrawn',
    'accepted'
);

-- ============================================================================
-- MATCHES TABLE
-- ============================================================================
-- CV-Job match results with scores and analysis

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cv_profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs_raw(id) ON DELETE CASCADE,
    
    -- Match score (0-100)
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    
    -- Skill analysis
    matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of matching skill names
    missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Array of missing skill names
    
    -- AI-generated suggestions
    improvement_suggestions JSONB DEFAULT '[]'::jsonb,   -- Array of suggestion objects
    
    -- User interaction
    is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one match per user-cv-job combination
    UNIQUE(user_id, cv_profile_id, job_id)
);

-- Indexes for matches
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_cv_profile_id ON matches(cv_profile_id);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_score ON matches(match_score DESC);
CREATE INDEX idx_matches_is_viewed ON matches(user_id, is_viewed) WHERE is_viewed = FALSE;
CREATE INDEX idx_matches_calculated_at ON matches(calculated_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_matches_user_score ON matches(user_id, match_score DESC);
CREATE INDEX idx_matches_user_cv ON matches(user_id, cv_profile_id);

-- ============================================================================
-- SAVED JOBS TABLE
-- ============================================================================
-- User bookmarked jobs

CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs_raw(id) ON DELETE CASCADE,
    
    -- User notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one save per user-job combination
    UNIQUE(user_id, job_id)
);

-- Indexes for saved_jobs
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_saved_jobs_created_at ON saved_jobs(user_id, created_at DESC);

-- ============================================================================
-- JOB APPLICATIONS TABLE
-- ============================================================================
-- Application tracking

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs_raw(id) ON DELETE CASCADE,
    cv_profile_id UUID REFERENCES cv_profiles(id) ON DELETE SET NULL,
    
    -- Application status
    status application_status NOT NULL DEFAULT 'draft',
    
    -- Application content
    cover_letter TEXT,
    notes TEXT,
    
    -- Timestamps
    applied_at TIMESTAMPTZ,  -- When actually submitted
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one application per user-job combination
    UNIQUE(user_id, job_id)
);

-- Indexes for job_applications
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_cv_profile_id ON job_applications(cv_profile_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at DESC);
CREATE INDEX idx_job_applications_created_at ON job_applications(user_id, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_job_applications_user_status ON job_applications(user_id, status);

-- Trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Calculate match score
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_match_score(
    cv_uuid UUID,
    job_uuid UUID
)
RETURNS TABLE (
    score INTEGER,
    matching_skills JSONB,
    missing_skills JSONB
) AS $$
DECLARE
    cv_skills_arr TEXT[];
    job_skills_arr TEXT[];
    matching_arr TEXT[];
    missing_arr TEXT[];
    total_job_skills INTEGER;
    matched_count INTEGER;
    calculated_score INTEGER;
BEGIN
    -- Get CV skills (lowercase for comparison)
    SELECT ARRAY_AGG(LOWER(skill_name))
    INTO cv_skills_arr
    FROM cv_skills
    WHERE cv_profile_id = cv_uuid;
    
    -- Get job skills (lowercase for comparison)
    SELECT ARRAY_AGG(LOWER(skill_name))
    INTO job_skills_arr
    FROM job_skills
    WHERE job_id = job_uuid;
    
    -- Handle empty arrays
    IF cv_skills_arr IS NULL THEN
        cv_skills_arr := ARRAY[]::TEXT[];
    END IF;
    
    IF job_skills_arr IS NULL THEN
        job_skills_arr := ARRAY[]::TEXT[];
    END IF;
    
    -- Calculate matching skills
    SELECT ARRAY_AGG(skill)
    INTO matching_arr
    FROM unnest(cv_skills_arr) AS skill
    WHERE skill = ANY(job_skills_arr);
    
    IF matching_arr IS NULL THEN
        matching_arr := ARRAY[]::TEXT[];
    END IF;
    
    -- Calculate missing skills
    SELECT ARRAY_AGG(skill)
    INTO missing_arr
    FROM unnest(job_skills_arr) AS skill
    WHERE NOT (skill = ANY(cv_skills_arr));
    
    IF missing_arr IS NULL THEN
        missing_arr := ARRAY[]::TEXT[];
    END IF;
    
    -- Calculate score
    total_job_skills := array_length(job_skills_arr, 1);
    matched_count := array_length(matching_arr, 1);
    
    IF total_job_skills IS NULL OR total_job_skills = 0 THEN
        calculated_score := 50; -- Default score when no skills to compare
    ELSE
        calculated_score := ROUND((matched_count::DECIMAL / total_job_skills) * 100);
    END IF;
    
    RETURN QUERY SELECT 
        calculated_score,
        to_jsonb(matching_arr),
        to_jsonb(missing_arr);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Create or update match
-- ============================================================================

CREATE OR REPLACE FUNCTION upsert_match(
    p_user_id UUID,
    p_cv_profile_id UUID,
    p_job_id UUID,
    p_improvement_suggestions JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID AS $$
DECLARE
    match_result RECORD;
    match_id UUID;
BEGIN
    -- Calculate match score
    SELECT * INTO match_result
    FROM calculate_match_score(p_cv_profile_id, p_job_id);
    
    -- Upsert match record
    INSERT INTO matches (
        user_id, cv_profile_id, job_id, 
        match_score, matching_skills, missing_skills,
        improvement_suggestions, calculated_at
    )
    VALUES (
        p_user_id, p_cv_profile_id, p_job_id,
        match_result.score, match_result.matching_skills, match_result.missing_skills,
        p_improvement_suggestions, NOW()
    )
    ON CONFLICT (user_id, cv_profile_id, job_id)
    DO UPDATE SET
        match_score = match_result.score,
        matching_skills = match_result.matching_skills,
        missing_skills = match_result.missing_skills,
        improvement_suggestions = COALESCE(p_improvement_suggestions, matches.improvement_suggestions),
        calculated_at = NOW()
    RETURNING id INTO match_id;
    
    RETURN match_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get user matches with job details
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_matches(
    p_user_id UUID,
    p_cv_profile_id UUID DEFAULT NULL,
    p_min_score INTEGER DEFAULT 0,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    match_id UUID,
    match_score INTEGER,
    matching_skills JSONB,
    missing_skills JSONB,
    improvement_suggestions JSONB,
    is_viewed BOOLEAN,
    calculated_at TIMESTAMPTZ,
    job_id UUID,
    job_title TEXT,
    job_company TEXT,
    job_country TEXT,
    job_city TEXT,
    job_is_remote BOOLEAN,
    job_salary_min INTEGER,
    job_salary_max INTEGER,
    job_salary_currency TEXT,
    job_posted_at TIMESTAMPTZ,
    is_saved BOOLEAN,
    application_status application_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id AS match_id,
        m.match_score,
        m.matching_skills,
        m.missing_skills,
        m.improvement_suggestions,
        m.is_viewed,
        m.calculated_at,
        j.id AS job_id,
        j.title AS job_title,
        j.company AS job_company,
        j.country AS job_country,
        j.city AS job_city,
        j.is_remote AS job_is_remote,
        j.salary_min AS job_salary_min,
        j.salary_max AS job_salary_max,
        j.salary_currency AS job_salary_currency,
        j.posted_at AS job_posted_at,
        EXISTS(SELECT 1 FROM saved_jobs sj WHERE sj.user_id = p_user_id AND sj.job_id = j.id) AS is_saved,
        (SELECT ja.status FROM job_applications ja WHERE ja.user_id = p_user_id AND ja.job_id = j.id) AS application_status
    FROM matches m
    JOIN jobs_raw j ON j.id = m.job_id
    WHERE m.user_id = p_user_id
      AND (p_cv_profile_id IS NULL OR m.cv_profile_id = p_cv_profile_id)
      AND m.match_score >= p_min_score
      AND j.is_active = TRUE
    ORDER BY m.match_score DESC, j.posted_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get application statistics
-- ============================================================================

CREATE OR REPLACE FUNCTION get_application_stats(p_user_id UUID)
RETURNS TABLE (
    total_applications INTEGER,
    draft_count INTEGER,
    applied_count INTEGER,
    screening_count INTEGER,
    interviewing_count INTEGER,
    offer_count INTEGER,
    rejected_count INTEGER,
    withdrawn_count INTEGER,
    accepted_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER AS total_applications,
        COUNT(*) FILTER (WHERE status = 'draft')::INTEGER AS draft_count,
        COUNT(*) FILTER (WHERE status = 'applied')::INTEGER AS applied_count,
        COUNT(*) FILTER (WHERE status = 'screening')::INTEGER AS screening_count,
        COUNT(*) FILTER (WHERE status = 'interviewing')::INTEGER AS interviewing_count,
        COUNT(*) FILTER (WHERE status = 'offer')::INTEGER AS offer_count,
        COUNT(*) FILTER (WHERE status = 'rejected')::INTEGER AS rejected_count,
        COUNT(*) FILTER (WHERE status = 'withdrawn')::INTEGER AS withdrawn_count,
        COUNT(*) FILTER (WHERE status = 'accepted')::INTEGER AS accepted_count
    FROM job_applications
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE matches IS 'CV-Job match results with scores and analysis';
COMMENT ON COLUMN matches.match_score IS 'Match percentage (0-100)';
COMMENT ON COLUMN matches.matching_skills IS 'JSON array of skills that match between CV and job';
COMMENT ON COLUMN matches.missing_skills IS 'JSON array of skills required by job but missing from CV';
COMMENT ON COLUMN matches.improvement_suggestions IS 'AI-generated suggestions for improving match';

COMMENT ON TABLE saved_jobs IS 'User bookmarked jobs';
COMMENT ON COLUMN saved_jobs.notes IS 'User notes about the saved job';

COMMENT ON TABLE job_applications IS 'Job application tracking';
COMMENT ON COLUMN job_applications.status IS 'Current application status';
COMMENT ON COLUMN job_applications.applied_at IS 'Timestamp when application was actually submitted';

COMMENT ON FUNCTION calculate_match_score IS 'Calculate match score between a CV and job';
COMMENT ON FUNCTION upsert_match IS 'Create or update a match record with calculated score';
COMMENT ON FUNCTION get_user_matches IS 'Get user matches with job details and status';
COMMENT ON FUNCTION get_application_stats IS 'Get application statistics for a user';
