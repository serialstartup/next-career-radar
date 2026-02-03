-- ============================================================================
-- Migration: 002_create_cv_tables.sql
-- Description: Create CV-related tables (cv_profiles, cv_skills, cv_experiences, cv_education)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- CV status enum
CREATE TYPE cv_status AS ENUM (
    'draft',
    'complete',
    'archived'
);

-- Skill proficiency level enum
CREATE TYPE proficiency_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);

-- ============================================================================
-- CV PROFILES TABLE
-- ============================================================================
-- Main CV data storage with JSON Resume format support

CREATE TABLE cv_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- CV metadata
    title TEXT NOT NULL DEFAULT 'My CV',
    
    -- JSON Resume format data
    -- See: https://jsonresume.org/schema/
    json_resume JSONB NOT NULL DEFAULT '{
        "basics": {},
        "work": [],
        "education": [],
        "skills": [],
        "languages": [],
        "projects": [],
        "certificates": []
    }'::jsonb,
    
    -- Target settings
    target_role TEXT,
    target_countries TEXT[] DEFAULT '{}',
    
    -- Status and progress
    status cv_status NOT NULL DEFAULT 'draft',
    completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for cv_profiles
CREATE INDEX idx_cv_profiles_user_id ON cv_profiles(user_id);
CREATE INDEX idx_cv_profiles_target_role ON cv_profiles(target_role);
CREATE INDEX idx_cv_profiles_status ON cv_profiles(status);
CREATE INDEX idx_cv_profiles_created_at ON cv_profiles(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_cv_profiles_updated_at
    BEFORE UPDATE ON cv_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CV SKILLS TABLE
-- ============================================================================
-- Normalized skills extracted from CV for matching and analytics

CREATE TABLE cv_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to cv_profiles
    cv_profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
    
    -- Skill data
    skill_name TEXT NOT NULL,
    proficiency_level proficiency_level,
    years_of_experience INTEGER CHECK (years_of_experience >= 0),
    
    -- Display settings
    is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one skill per CV
    UNIQUE(cv_profile_id, skill_name)
);

-- Indexes for cv_skills
CREATE INDEX idx_cv_skills_cv_profile_id ON cv_skills(cv_profile_id);
CREATE INDEX idx_cv_skills_skill_name ON cv_skills(skill_name);
CREATE INDEX idx_cv_skills_skill_name_lower ON cv_skills(LOWER(skill_name));
CREATE INDEX idx_cv_skills_is_highlighted ON cv_skills(cv_profile_id, is_highlighted) WHERE is_highlighted = TRUE;

-- ============================================================================
-- CV EXPERIENCES TABLE
-- ============================================================================
-- Work experience entries

CREATE TABLE cv_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to cv_profiles
    cv_profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
    
    -- Experience data
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    
    -- Date range
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Description and achievements
    description TEXT,
    achievements TEXT[] DEFAULT '{}',
    
    -- Display order
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: end_date must be after start_date if provided
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date),
    -- Constraint: is_current should be true only if end_date is null
    CONSTRAINT valid_current_status CHECK (NOT is_current OR end_date IS NULL)
);

-- Indexes for cv_experiences
CREATE INDEX idx_cv_experiences_cv_profile_id ON cv_experiences(cv_profile_id);
CREATE INDEX idx_cv_experiences_company ON cv_experiences(company);
CREATE INDEX idx_cv_experiences_sort_order ON cv_experiences(cv_profile_id, sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_cv_experiences_updated_at
    BEFORE UPDATE ON cv_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CV EDUCATION TABLE
-- ============================================================================
-- Education history entries

CREATE TABLE cv_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to cv_profiles
    cv_profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
    
    -- Education data
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    
    -- Date range
    start_date DATE,
    end_date DATE,
    
    -- Additional info
    gpa DECIMAL(3, 2) CHECK (gpa >= 0 AND gpa <= 4.0),
    description TEXT,
    
    -- Display order
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: end_date must be after start_date if both provided
    CONSTRAINT valid_education_date_range CHECK (
        start_date IS NULL OR end_date IS NULL OR end_date >= start_date
    )
);

-- Indexes for cv_education
CREATE INDEX idx_cv_education_cv_profile_id ON cv_education(cv_profile_id);
CREATE INDEX idx_cv_education_institution ON cv_education(institution);
CREATE INDEX idx_cv_education_sort_order ON cv_education(cv_profile_id, sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_cv_education_updated_at
    BEFORE UPDATE ON cv_education
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Calculate CV completion percentage
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_cv_completion(cv_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completion INTEGER := 0;
    cv_record RECORD;
    skills_count INTEGER;
    experiences_count INTEGER;
    education_count INTEGER;
BEGIN
    -- Get CV profile
    SELECT * INTO cv_record FROM cv_profiles WHERE id = cv_id;
    
    IF cv_record IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Check basics (20%)
    IF cv_record.json_resume->'basics'->>'name' IS NOT NULL AND 
       cv_record.json_resume->'basics'->>'name' != '' THEN
        completion := completion + 10;
    END IF;
    
    IF cv_record.json_resume->'basics'->>'email' IS NOT NULL AND 
       cv_record.json_resume->'basics'->>'email' != '' THEN
        completion := completion + 5;
    END IF;
    
    IF cv_record.json_resume->'basics'->>'summary' IS NOT NULL AND 
       cv_record.json_resume->'basics'->>'summary' != '' THEN
        completion := completion + 5;
    END IF;
    
    -- Check skills (25%)
    SELECT COUNT(*) INTO skills_count FROM cv_skills WHERE cv_profile_id = cv_id;
    IF skills_count >= 5 THEN
        completion := completion + 25;
    ELSIF skills_count >= 3 THEN
        completion := completion + 15;
    ELSIF skills_count >= 1 THEN
        completion := completion + 10;
    END IF;
    
    -- Check experiences (30%)
    SELECT COUNT(*) INTO experiences_count FROM cv_experiences WHERE cv_profile_id = cv_id;
    IF experiences_count >= 2 THEN
        completion := completion + 30;
    ELSIF experiences_count >= 1 THEN
        completion := completion + 20;
    END IF;
    
    -- Check education (15%)
    SELECT COUNT(*) INTO education_count FROM cv_education WHERE cv_profile_id = cv_id;
    IF education_count >= 1 THEN
        completion := completion + 15;
    END IF;
    
    -- Check target role (5%)
    IF cv_record.target_role IS NOT NULL AND cv_record.target_role != '' THEN
        completion := completion + 5;
    END IF;
    
    -- Check target countries (5%)
    IF array_length(cv_record.target_countries, 1) > 0 THEN
        completion := completion + 5;
    END IF;
    
    RETURN LEAST(completion, 100);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: Auto-update completion percentage
-- ============================================================================

CREATE OR REPLACE FUNCTION update_cv_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cv_profiles 
    SET completion_percentage = calculate_cv_completion(
        COALESCE(NEW.cv_profile_id, OLD.cv_profile_id)
    )
    WHERE id = COALESCE(NEW.cv_profile_id, OLD.cv_profile_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers on related tables
CREATE TRIGGER update_cv_completion_on_skills
    AFTER INSERT OR UPDATE OR DELETE ON cv_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_cv_completion();

CREATE TRIGGER update_cv_completion_on_experiences
    AFTER INSERT OR UPDATE OR DELETE ON cv_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_cv_completion();

CREATE TRIGGER update_cv_completion_on_education
    AFTER INSERT OR UPDATE OR DELETE ON cv_education
    FOR EACH ROW
    EXECUTE FUNCTION update_cv_completion();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE cv_profiles IS 'Main CV profiles with JSON Resume format support';
COMMENT ON COLUMN cv_profiles.json_resume IS 'Full CV data in JSON Resume format (https://jsonresume.org/schema/)';
COMMENT ON COLUMN cv_profiles.completion_percentage IS 'Auto-calculated CV completion percentage';

COMMENT ON TABLE cv_skills IS 'Normalized skills for matching and analytics';
COMMENT ON COLUMN cv_skills.is_highlighted IS 'Featured skills shown prominently';

COMMENT ON TABLE cv_experiences IS 'Work experience entries';
COMMENT ON COLUMN cv_experiences.achievements IS 'Array of achievement bullet points';

COMMENT ON TABLE cv_education IS 'Education history entries';
COMMENT ON COLUMN cv_education.gpa IS 'GPA on 4.0 scale';
