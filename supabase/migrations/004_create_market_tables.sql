-- ============================================================================
-- Migration: 004_create_market_tables.sql
-- Description: Create market statistics table and related functions
-- ============================================================================

-- ============================================================================
-- MARKET STATS TABLE
-- ============================================================================
-- Aggregated market statistics calculated from jobs_raw

CREATE TABLE market_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dimensions (can be NULL for aggregated stats)
    role TEXT,
    country TEXT,
    skill TEXT,
    
    -- Metrics
    job_count INTEGER NOT NULL DEFAULT 0,
    skill_frequency INTEGER NOT NULL DEFAULT 0,
    
    -- Salary statistics
    avg_salary_min INTEGER,
    avg_salary_max INTEGER,
    median_salary INTEGER,
    salary_currency TEXT DEFAULT 'USD',
    
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Timestamps
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint for dimension combination per period
    UNIQUE(role, country, skill, period_start, period_end)
);

-- Indexes for market_stats
CREATE INDEX idx_market_stats_role ON market_stats(role);
CREATE INDEX idx_market_stats_country ON market_stats(country);
CREATE INDEX idx_market_stats_skill ON market_stats(skill);
CREATE INDEX idx_market_stats_period ON market_stats(period_start, period_end);
CREATE INDEX idx_market_stats_calculated_at ON market_stats(calculated_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_market_stats_role_country ON market_stats(role, country);
CREATE INDEX idx_market_stats_role_skill ON market_stats(role, skill);
CREATE INDEX idx_market_stats_country_skill ON market_stats(country, skill);
CREATE INDEX idx_market_stats_role_country_period ON market_stats(role, country, period_start, period_end);

-- ============================================================================
-- FUNCTION: Calculate market stats for a period
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_market_stats(
    start_date DATE,
    end_date DATE
)
RETURNS INTEGER AS $$
DECLARE
    inserted_rows INTEGER := 0;
    temp_count INTEGER;
BEGIN
    -- Delete existing stats for this period
    DELETE FROM market_stats 
    WHERE period_start = start_date AND period_end = end_date;
    
    -- Insert skill frequency by role and country
    INSERT INTO market_stats (role, country, skill, job_count, skill_frequency, 
                              avg_salary_min, avg_salary_max, salary_currency,
                              period_start, period_end)
    SELECT 
        j.title AS role,
        j.country,
        js.skill_name AS skill,
        COUNT(DISTINCT j.id) AS job_count,
        COUNT(js.id) AS skill_frequency,
        AVG(j.salary_min)::INTEGER AS avg_salary_min,
        AVG(j.salary_max)::INTEGER AS avg_salary_max,
        MODE() WITHIN GROUP (ORDER BY j.salary_currency) AS salary_currency,
        start_date,
        end_date
    FROM jobs_raw j
    JOIN job_skills js ON js.job_id = j.id
    WHERE j.posted_at >= start_date 
      AND j.posted_at < end_date
      AND j.is_active = TRUE
    GROUP BY j.title, j.country, js.skill_name;
    
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    inserted_rows := inserted_rows + temp_count;
    
    -- Insert aggregated stats by role only
    INSERT INTO market_stats (role, country, skill, job_count, skill_frequency,
                              avg_salary_min, avg_salary_max, salary_currency,
                              period_start, period_end)
    SELECT 
        j.title AS role,
        NULL AS country,
        NULL AS skill,
        COUNT(DISTINCT j.id) AS job_count,
        0 AS skill_frequency,
        AVG(j.salary_min)::INTEGER AS avg_salary_min,
        AVG(j.salary_max)::INTEGER AS avg_salary_max,
        MODE() WITHIN GROUP (ORDER BY j.salary_currency) AS salary_currency,
        start_date,
        end_date
    FROM jobs_raw j
    WHERE j.posted_at >= start_date 
      AND j.posted_at < end_date
      AND j.is_active = TRUE
    GROUP BY j.title;
    
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    inserted_rows := inserted_rows + temp_count;
    
    -- Insert aggregated stats by country only
    INSERT INTO market_stats (role, country, skill, job_count, skill_frequency,
                              avg_salary_min, avg_salary_max, salary_currency,
                              period_start, period_end)
    SELECT 
        NULL AS role,
        j.country,
        NULL AS skill,
        COUNT(DISTINCT j.id) AS job_count,
        0 AS skill_frequency,
        AVG(j.salary_min)::INTEGER AS avg_salary_min,
        AVG(j.salary_max)::INTEGER AS avg_salary_max,
        MODE() WITHIN GROUP (ORDER BY j.salary_currency) AS salary_currency,
        start_date,
        end_date
    FROM jobs_raw j
    WHERE j.posted_at >= start_date 
      AND j.posted_at < end_date
      AND j.is_active = TRUE
    GROUP BY j.country;
    
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    inserted_rows := inserted_rows + temp_count;
    
    -- Insert aggregated stats by skill only (top skills)
    INSERT INTO market_stats (role, country, skill, job_count, skill_frequency,
                              avg_salary_min, avg_salary_max, salary_currency,
                              period_start, period_end)
    SELECT 
        NULL AS role,
        NULL AS country,
        js.skill_name AS skill,
        COUNT(DISTINCT j.id) AS job_count,
        COUNT(js.id) AS skill_frequency,
        AVG(j.salary_min)::INTEGER AS avg_salary_min,
        AVG(j.salary_max)::INTEGER AS avg_salary_max,
        MODE() WITHIN GROUP (ORDER BY j.salary_currency) AS salary_currency,
        start_date,
        end_date
    FROM jobs_raw j
    JOIN job_skills js ON js.job_id = j.id
    WHERE j.posted_at >= start_date 
      AND j.posted_at < end_date
      AND j.is_active = TRUE
    GROUP BY js.skill_name;
    
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    inserted_rows := inserted_rows + temp_count;
    
    RETURN inserted_rows;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get top skills for a role
-- ============================================================================

CREATE OR REPLACE FUNCTION get_top_skills_for_role(
    role_name TEXT,
    country_name TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    skill TEXT,
    frequency INTEGER,
    percentage DECIMAL(5, 2)
) AS $$
DECLARE
    total_jobs INTEGER;
BEGIN
    -- Get total job count for percentage calculation
    SELECT COALESCE(SUM(ms.job_count), 0) INTO total_jobs
    FROM market_stats ms
    WHERE ms.role = role_name
      AND (country_name IS NULL OR ms.country = country_name)
      AND ms.skill IS NULL
      AND ms.period_end = (SELECT MAX(period_end) FROM market_stats);
    
    IF total_jobs = 0 THEN
        total_jobs := 1; -- Avoid division by zero
    END IF;
    
    RETURN QUERY
    SELECT 
        ms.skill,
        ms.skill_frequency AS frequency,
        ROUND((ms.skill_frequency::DECIMAL / total_jobs) * 100, 2) AS percentage
    FROM market_stats ms
    WHERE ms.role = role_name
      AND (country_name IS NULL OR ms.country = country_name)
      AND ms.skill IS NOT NULL
      AND ms.period_end = (SELECT MAX(period_end) FROM market_stats)
    ORDER BY ms.skill_frequency DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get salary insights for a role
-- ============================================================================

CREATE OR REPLACE FUNCTION get_salary_insights(
    role_name TEXT,
    country_name TEXT DEFAULT NULL
)
RETURNS TABLE (
    country TEXT,
    avg_salary_min INTEGER,
    avg_salary_max INTEGER,
    salary_currency TEXT,
    job_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ms.country,
        ms.avg_salary_min,
        ms.avg_salary_max,
        ms.salary_currency,
        ms.job_count
    FROM market_stats ms
    WHERE ms.role = role_name
      AND (country_name IS NULL OR ms.country = country_name)
      AND ms.skill IS NULL
      AND ms.country IS NOT NULL
      AND ms.period_end = (SELECT MAX(period_end) FROM market_stats)
    ORDER BY ms.avg_salary_max DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get trending skills
-- ============================================================================

CREATE OR REPLACE FUNCTION get_trending_skills(
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    skill TEXT,
    current_frequency INTEGER,
    previous_frequency INTEGER,
    growth_percentage DECIMAL(5, 2)
) AS $$
DECLARE
    current_period_end DATE;
    previous_period_end DATE;
BEGIN
    -- Get current and previous period end dates
    SELECT MAX(period_end) INTO current_period_end FROM market_stats;
    SELECT MAX(period_end) INTO previous_period_end 
    FROM market_stats 
    WHERE period_end < current_period_end;
    
    IF previous_period_end IS NULL THEN
        -- No previous period, return current skills without growth
        RETURN QUERY
        SELECT 
            ms.skill,
            ms.skill_frequency AS current_frequency,
            0 AS previous_frequency,
            0.00 AS growth_percentage
        FROM market_stats ms
        WHERE ms.skill IS NOT NULL
          AND ms.role IS NULL
          AND ms.country IS NULL
          AND ms.period_end = current_period_end
        ORDER BY ms.skill_frequency DESC
        LIMIT limit_count;
    ELSE
        RETURN QUERY
        SELECT 
            curr.skill,
            curr.skill_frequency AS current_frequency,
            COALESCE(prev.skill_frequency, 0) AS previous_frequency,
            CASE 
                WHEN COALESCE(prev.skill_frequency, 0) = 0 THEN 100.00
                ELSE ROUND(
                    ((curr.skill_frequency - COALESCE(prev.skill_frequency, 0))::DECIMAL / 
                     COALESCE(prev.skill_frequency, 1)) * 100, 2
                )
            END AS growth_percentage
        FROM market_stats curr
        LEFT JOIN market_stats prev ON prev.skill = curr.skill
            AND prev.role IS NULL
            AND prev.country IS NULL
            AND prev.period_end = previous_period_end
        WHERE curr.skill IS NOT NULL
          AND curr.role IS NULL
          AND curr.country IS NULL
          AND curr.period_end = current_period_end
        ORDER BY growth_percentage DESC, curr.skill_frequency DESC
        LIMIT limit_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get country comparison
-- ============================================================================

CREATE OR REPLACE FUNCTION get_country_comparison(
    role_name TEXT,
    countries TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    country TEXT,
    job_count INTEGER,
    avg_salary_min INTEGER,
    avg_salary_max INTEGER,
    salary_currency TEXT,
    top_skills TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ms.country,
        ms.job_count,
        ms.avg_salary_min,
        ms.avg_salary_max,
        ms.salary_currency,
        (
            SELECT ARRAY_AGG(skill_ms.skill ORDER BY skill_ms.skill_frequency DESC)
            FROM (
                SELECT skill_inner.skill, skill_inner.skill_frequency
                FROM market_stats skill_inner
                WHERE skill_inner.role = role_name
                  AND skill_inner.country = ms.country
                  AND skill_inner.skill IS NOT NULL
                  AND skill_inner.period_end = ms.period_end
                ORDER BY skill_inner.skill_frequency DESC
                LIMIT 5
            ) skill_ms
        ) AS top_skills
    FROM market_stats ms
    WHERE ms.role = role_name
      AND ms.skill IS NULL
      AND ms.country IS NOT NULL
      AND (countries IS NULL OR ms.country = ANY(countries))
      AND ms.period_end = (SELECT MAX(period_end) FROM market_stats)
    ORDER BY ms.job_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE market_stats IS 'Aggregated market statistics from job postings';
COMMENT ON COLUMN market_stats.role IS 'Job role/title (NULL for aggregated stats)';
COMMENT ON COLUMN market_stats.country IS 'Country (NULL for aggregated stats)';
COMMENT ON COLUMN market_stats.skill IS 'Skill name (NULL for aggregated stats)';
COMMENT ON COLUMN market_stats.job_count IS 'Number of jobs matching the criteria';
COMMENT ON COLUMN market_stats.skill_frequency IS 'How often this skill appears in job postings';

COMMENT ON FUNCTION calculate_market_stats IS 'Calculate and store market statistics for a date range';
COMMENT ON FUNCTION get_top_skills_for_role IS 'Get top skills required for a specific role';
COMMENT ON FUNCTION get_salary_insights IS 'Get salary statistics for a role by country';
COMMENT ON FUNCTION get_trending_skills IS 'Get skills with highest growth between periods';
COMMENT ON FUNCTION get_country_comparison IS 'Compare job market across countries for a role';
