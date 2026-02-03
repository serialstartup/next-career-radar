-- ============================================================================
-- Migration: 003_create_job_tables.sql
-- Description: Create job-related tables (jobs_raw, job_skills)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Job type enum
CREATE TYPE job_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'freelance',
    'internship'
);

-- ============================================================================
-- JOBS RAW TABLE
-- ============================================================================
-- Raw job postings from various sources (Apify, etc.)

CREATE TABLE jobs_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source tracking
    source TEXT NOT NULL,  -- e.g., 'linkedin', 'indeed', 'glassdoor'
    external_id TEXT NOT NULL,  -- ID from the source
    url TEXT,
    
    -- Job details
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo_url TEXT,
    
    -- Location
    country TEXT,
    city TEXT,
    
    -- Description and requirements
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,  -- Array of requirement strings
    
    -- Compensation
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'USD',
    
    -- Job metadata
    job_type job_type,
    experience_level experience_level,  -- Reusing enum from 001
    is_remote BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    posted_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- System timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one job per source+external_id combination
    UNIQUE(source, external_id)
);

-- Indexes for jobs_raw
CREATE INDEX idx_jobs_raw_source ON jobs_raw(source);
CREATE INDEX idx_jobs_raw_external_id ON jobs_raw(external_id);
CREATE INDEX idx_jobs_raw_title ON jobs_raw(title);
CREATE INDEX idx_jobs_raw_company ON jobs_raw(company);
CREATE INDEX idx_jobs_raw_country ON jobs_raw(country);
CREATE INDEX idx_jobs_raw_city ON jobs_raw(city);
CREATE INDEX idx_jobs_raw_job_type ON jobs_raw(job_type);
CREATE INDEX idx_jobs_raw_experience_level ON jobs_raw(experience_level);
CREATE INDEX idx_jobs_raw_is_remote ON jobs_raw(is_remote);
CREATE INDEX idx_jobs_raw_posted_at ON jobs_raw(posted_at DESC);
CREATE INDEX idx_jobs_raw_is_active ON jobs_raw(is_active);
CREATE INDEX idx_jobs_raw_salary ON jobs_raw(salary_min, salary_max) WHERE salary_min IS NOT NULL;

-- Full-text search indexes
CREATE INDEX idx_jobs_raw_title_search ON jobs_raw USING gin(to_tsvector('english', title));
CREATE INDEX idx_jobs_raw_description_search ON jobs_raw USING gin(to_tsvector('english', COALESCE(description, '')));

-- Composite indexes for common queries
CREATE INDEX idx_jobs_raw_active_country ON jobs_raw(country, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_raw_active_posted ON jobs_raw(posted_at DESC, is_active) WHERE is_active = TRUE;

-- Trigger for updated_at
CREATE TRIGGER update_jobs_raw_updated_at
    BEFORE UPDATE ON jobs_raw
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- JOB SKILLS TABLE
-- ============================================================================
-- Skills extracted from job descriptions

CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to jobs_raw
    job_id UUID NOT NULL REFERENCES jobs_raw(id) ON DELETE CASCADE,
    
    -- Skill data
    skill_name TEXT NOT NULL,
    weight DECIMAL(3, 2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one skill per job
    UNIQUE(job_id, skill_name)
);

-- Indexes for job_skills
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_name ON job_skills(skill_name);
CREATE INDEX idx_job_skills_skill_name_lower ON job_skills(LOWER(skill_name));
CREATE INDEX idx_job_skills_is_required ON job_skills(job_id, is_required) WHERE is_required = TRUE;
CREATE INDEX idx_job_skills_weight ON job_skills(weight DESC);

-- ============================================================================
-- FUNCTION: Deactivate expired jobs
-- ============================================================================

CREATE OR REPLACE FUNCTION deactivate_expired_jobs()
RETURNS INTEGER AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE jobs_raw
    SET is_active = FALSE,
        updated_at = NOW()
    WHERE is_active = TRUE
      AND expires_at IS NOT NULL
      AND expires_at < NOW();
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Search jobs with full-text search
-- ============================================================================

CREATE OR REPLACE FUNCTION search_jobs(
    search_query TEXT,
    country_filter TEXT DEFAULT NULL,
    job_type_filter job_type DEFAULT NULL,
    is_remote_filter BOOLEAN DEFAULT NULL,
    experience_filter experience_level DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company TEXT,
    country TEXT,
    city TEXT,
    job_type job_type,
    is_remote BOOLEAN,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT,
    posted_at TIMESTAMPTZ,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.company,
        j.country,
        j.city,
        j.job_type,
        j.is_remote,
        j.salary_min,
        j.salary_max,
        j.salary_currency,
        j.posted_at,
        ts_rank(
            to_tsvector('english', j.title || ' ' || COALESCE(j.description, '')),
            plainto_tsquery('english', search_query)
        ) AS rank
    FROM jobs_raw j
    WHERE j.is_active = TRUE
      AND (search_query IS NULL OR search_query = '' OR 
           to_tsvector('english', j.title || ' ' || COALESCE(j.description, '')) @@ 
           plainto_tsquery('english', search_query))
      AND (country_filter IS NULL OR j.country = country_filter)
      AND (job_type_filter IS NULL OR j.job_type = job_type_filter)
      AND (is_remote_filter IS NULL OR j.is_remote = is_remote_filter)
      AND (experience_filter IS NULL OR j.experience_level = experience_filter)
    ORDER BY rank DESC, j.posted_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get job with skills
-- ============================================================================

CREATE OR REPLACE FUNCTION get_job_with_skills(job_uuid UUID)
RETURNS TABLE (
    job_data JSONB,
    skills JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_jsonb(j.*) AS job_data,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'skill_name', js.skill_name,
                    'weight', js.weight,
                    'is_required', js.is_required
                )
            ) FILTER (WHERE js.id IS NOT NULL),
            '[]'::jsonb
        ) AS skills
    FROM jobs_raw j
    LEFT JOIN job_skills js ON js.job_id = j.id
    WHERE j.id = job_uuid
    GROUP BY j.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE jobs_raw IS 'Raw job postings from various sources';
COMMENT ON COLUMN jobs_raw.source IS 'Source platform (linkedin, indeed, glassdoor, etc.)';
COMMENT ON COLUMN jobs_raw.external_id IS 'Unique ID from the source platform';
COMMENT ON COLUMN jobs_raw.requirements IS 'JSON array of requirement strings';
COMMENT ON COLUMN jobs_raw.is_active IS 'Whether the job is still active (not expired/removed)';

COMMENT ON TABLE job_skills IS 'Skills extracted from job descriptions';
COMMENT ON COLUMN job_skills.weight IS 'Importance weight (0.0 to 1.0)';
COMMENT ON COLUMN job_skills.is_required IS 'Whether this is a required skill vs nice-to-have';

COMMENT ON FUNCTION search_jobs IS 'Full-text search for jobs with filters';
COMMENT ON FUNCTION get_job_with_skills IS 'Get job details with associated skills';
COMMENT ON FUNCTION deactivate_expired_jobs IS 'Deactivate jobs past their expiration date';
