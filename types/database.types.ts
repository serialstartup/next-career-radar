export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'
export type PrimaryGoal = 'find_job' | 'explore_market' | 'improve_cv'
export type CvStatus = 'draft' | 'complete' | 'archived'
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type JobType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship'
export type ApplicationStatus = 'draft' | 'applied' | 'screening' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn' | 'accepted'

// ============================================================================
// JSON RESUME TYPES
// ============================================================================

export interface JsonResumeBasics {
  name?: string
  label?: string
  email?: string
  phone?: string
  url?: string
  summary?: string
  location?: {
    address?: string
    postalCode?: string
    city?: string
    countryCode?: string
    region?: string
  }
  profiles?: Array<{
    network?: string
    username?: string
    url?: string
  }>
}

export interface JsonResumeWork {
  name?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: string[]
}

export interface JsonResumeEducation {
  institution?: string
  url?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string
  score?: string
  courses?: string[]
}

export interface JsonResumeSkill {
  name?: string
  level?: string
  keywords?: string[]
}

export interface JsonResumeLanguage {
  language?: string
  fluency?: string
}

export interface JsonResumeProject {
  name?: string
  description?: string
  highlights?: string[]
  keywords?: string[]
  startDate?: string
  endDate?: string
  url?: string
  roles?: string[]
  entity?: string
  type?: string
}

export interface JsonResumeCertificate {
  name?: string
  date?: string
  issuer?: string
  url?: string
}

export interface JsonResume {
  basics?: JsonResumeBasics
  work?: JsonResumeWork[]
  education?: JsonResumeEducation[]
  skills?: JsonResumeSkill[]
  languages?: JsonResumeLanguage[]
  projects?: JsonResumeProject[]
  certificates?: JsonResumeCertificate[]
}

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          target_roles: string[]
          target_countries: string[]
          experience_level: ExperienceLevel | null
          primary_goal: PrimaryGoal | null
          email_notifications: boolean
          job_alerts: boolean
          weekly_digest: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_roles?: string[]
          target_countries?: string[]
          experience_level?: ExperienceLevel | null
          primary_goal?: PrimaryGoal | null
          email_notifications?: boolean
          job_alerts?: boolean
          weekly_digest?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_roles?: string[]
          target_countries?: string[]
          experience_level?: ExperienceLevel | null
          primary_goal?: PrimaryGoal | null
          email_notifications?: boolean
          job_alerts?: boolean
          weekly_digest?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cv_profiles: {
        Row: {
          id: string
          user_id: string
          title: string
          json_resume: JsonResume
          target_role: string | null
          target_countries: string[]
          status: CvStatus
          completion_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          json_resume?: JsonResume
          target_role?: string | null
          target_countries?: string[]
          status?: CvStatus
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          json_resume?: JsonResume
          target_role?: string | null
          target_countries?: string[]
          status?: CvStatus
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cv_skills: {
        Row: {
          id: string
          cv_profile_id: string
          skill_name: string
          proficiency_level: ProficiencyLevel | null
          years_of_experience: number | null
          is_highlighted: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          cv_profile_id: string
          skill_name: string
          proficiency_level?: ProficiencyLevel | null
          years_of_experience?: number | null
          is_highlighted?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          cv_profile_id?: string
          skill_name?: string
          proficiency_level?: ProficiencyLevel | null
          years_of_experience?: number | null
          is_highlighted?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_skills_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cv_experiences: {
        Row: {
          id: string
          cv_profile_id: string
          company: string
          title: string
          location: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          achievements: string[]
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cv_profile_id: string
          company: string
          title: string
          location?: string | null
          start_date: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          achievements?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cv_profile_id?: string
          company?: string
          title?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          achievements?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_experiences_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cv_education: {
        Row: {
          id: string
          cv_profile_id: string
          institution: string
          degree: string
          field_of_study: string | null
          start_date: string | null
          end_date: string | null
          gpa: number | null
          description: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cv_profile_id: string
          institution: string
          degree: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          gpa?: number | null
          description?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cv_profile_id?: string
          institution?: string
          degree?: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          gpa?: number | null
          description?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_education_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs_raw: {
        Row: {
          id: string
          source: string
          external_id: string
          url: string | null
          title: string
          company: string
          company_logo_url: string | null
          country: string | null
          city: string | null
          description: string | null
          requirements: Json
          salary_min: number | null
          salary_max: number | null
          salary_currency: string | null
          job_type: JobType | null
          experience_level: ExperienceLevel | null
          is_remote: boolean
          posted_at: string | null
          scraped_at: string
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source: string
          external_id: string
          url?: string | null
          title: string
          company: string
          company_logo_url?: string | null
          country?: string | null
          city?: string | null
          description?: string | null
          requirements?: Json
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          job_type?: JobType | null
          experience_level?: ExperienceLevel | null
          is_remote?: boolean
          posted_at?: string | null
          scraped_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source?: string
          external_id?: string
          url?: string | null
          title?: string
          company?: string
          company_logo_url?: string | null
          country?: string | null
          city?: string | null
          description?: string | null
          requirements?: Json
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          job_type?: JobType | null
          experience_level?: ExperienceLevel | null
          is_remote?: boolean
          posted_at?: string | null
          scraped_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_skills: {
        Row: {
          id: string
          job_id: string
          skill_name: string
          weight: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          skill_name: string
          weight?: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          skill_name?: string
          weight?: number
          is_required?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs_raw"
            referencedColumns: ["id"]
          }
        ]
      }
      market_stats: {
        Row: {
          id: string
          role: string | null
          country: string | null
          skill: string | null
          job_count: number
          skill_frequency: number
          avg_salary_min: number | null
          avg_salary_max: number | null
          median_salary: number | null
          salary_currency: string | null
          period_start: string
          period_end: string
          calculated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          role?: string | null
          country?: string | null
          skill?: string | null
          job_count?: number
          skill_frequency?: number
          avg_salary_min?: number | null
          avg_salary_max?: number | null
          median_salary?: number | null
          salary_currency?: string | null
          period_start: string
          period_end: string
          calculated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string | null
          country?: string | null
          skill?: string | null
          job_count?: number
          skill_frequency?: number
          avg_salary_min?: number | null
          avg_salary_max?: number | null
          median_salary?: number | null
          salary_currency?: string | null
          period_start?: string
          period_end?: string
          calculated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          user_id: string
          cv_profile_id: string
          job_id: string
          match_score: number
          matching_skills: Json
          missing_skills: Json
          improvement_suggestions: Json
          is_viewed: boolean
          calculated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_profile_id: string
          job_id: string
          match_score: number
          matching_skills?: Json
          missing_skills?: Json
          improvement_suggestions?: Json
          is_viewed?: boolean
          calculated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_profile_id?: string
          job_id?: string
          match_score?: number
          matching_skills?: Json
          missing_skills?: Json
          improvement_suggestions?: Json
          is_viewed?: boolean
          calculated_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs_raw"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs_raw"
            referencedColumns: ["id"]
          }
        ]
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          cv_profile_id: string | null
          status: ApplicationStatus
          cover_letter: string | null
          notes: string | null
          applied_at: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          cv_profile_id?: string | null
          status?: ApplicationStatus
          cover_letter?: string | null
          notes?: string | null
          applied_at?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          cv_profile_id?: string | null
          status?: ApplicationStatus
          cover_letter?: string | null
          notes?: string | null
          applied_at?: string | null
          updated_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs_raw"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_cv_completion: {
        Args: {
          cv_id: string
        }
        Returns: number
      }
      calculate_match_score: {
        Args: {
          cv_uuid: string
          job_uuid: string
        }
        Returns: {
          score: number
          matching_skills: Json
          missing_skills: Json
        }[]
      }
      calculate_market_stats: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: number
      }
      deactivate_expired_jobs: {
        Args: Record<string, never>
        Returns: number
      }
      get_application_stats: {
        Args: {
          p_user_id: string
        }
        Returns: {
          total_applications: number
          draft_count: number
          applied_count: number
          screening_count: number
          interviewing_count: number
          offer_count: number
          rejected_count: number
          withdrawn_count: number
          accepted_count: number
        }[]
      }
      get_country_comparison: {
        Args: {
          role_name: string
          countries?: string[] | null
        }
        Returns: {
          country: string
          job_count: number
          avg_salary_min: number
          avg_salary_max: number
          salary_currency: string
          top_skills: string[]
        }[]
      }
      get_job_with_skills: {
        Args: {
          job_uuid: string
        }
        Returns: {
          job_data: Json
          skills: Json
        }[]
      }
      get_salary_insights: {
        Args: {
          role_name: string
          country_name?: string | null
        }
        Returns: {
          country: string
          avg_salary_min: number
          avg_salary_max: number
          salary_currency: string
          job_count: number
        }[]
      }
      get_top_skills_for_role: {
        Args: {
          role_name: string
          country_name?: string | null
          limit_count?: number
        }
        Returns: {
          skill: string
          frequency: number
          percentage: number
        }[]
      }
      get_trending_skills: {
        Args: {
          limit_count?: number
        }
        Returns: {
          skill: string
          current_frequency: number
          previous_frequency: number
          growth_percentage: number
        }[]
      }
      get_user_matches: {
        Args: {
          p_user_id: string
          p_cv_profile_id?: string | null
          p_min_score?: number
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          match_id: string
          match_score: number
          matching_skills: Json
          missing_skills: Json
          improvement_suggestions: Json
          is_viewed: boolean
          calculated_at: string
          job_id: string
          job_title: string
          job_company: string
          job_country: string
          job_city: string
          job_is_remote: boolean
          job_salary_min: number
          job_salary_max: number
          job_salary_currency: string
          job_posted_at: string
          is_saved: boolean
          application_status: ApplicationStatus
        }[]
      }
      search_jobs: {
        Args: {
          search_query: string
          country_filter?: string | null
          job_type_filter?: JobType | null
          is_remote_filter?: boolean | null
          experience_filter?: ExperienceLevel | null
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          company: string
          country: string
          city: string
          job_type: JobType
          is_remote: boolean
          salary_min: number
          salary_max: number
          salary_currency: string
          posted_at: string
          rank: number
        }[]
      }
      upsert_match: {
        Args: {
          p_user_id: string
          p_cv_profile_id: string
          p_job_id: string
          p_improvement_suggestions?: Json
        }
        Returns: string
      }
    }
    Enums: {
      experience_level: ExperienceLevel
      primary_goal: PrimaryGoal
      cv_status: CvStatus
      proficiency_level: ProficiencyLevel
      job_type: JobType
      application_status: ApplicationStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type CvProfile = Database['public']['Tables']['cv_profiles']['Row']
export type CvProfileInsert = Database['public']['Tables']['cv_profiles']['Insert']
export type CvProfileUpdate = Database['public']['Tables']['cv_profiles']['Update']

export type CvSkill = Database['public']['Tables']['cv_skills']['Row']
export type CvSkillInsert = Database['public']['Tables']['cv_skills']['Insert']
export type CvSkillUpdate = Database['public']['Tables']['cv_skills']['Update']

export type CvExperience = Database['public']['Tables']['cv_experiences']['Row']
export type CvExperienceInsert = Database['public']['Tables']['cv_experiences']['Insert']
export type CvExperienceUpdate = Database['public']['Tables']['cv_experiences']['Update']

export type CvEducation = Database['public']['Tables']['cv_education']['Row']
export type CvEducationInsert = Database['public']['Tables']['cv_education']['Insert']
export type CvEducationUpdate = Database['public']['Tables']['cv_education']['Update']

export type JobRaw = Database['public']['Tables']['jobs_raw']['Row']
export type JobRawInsert = Database['public']['Tables']['jobs_raw']['Insert']
export type JobRawUpdate = Database['public']['Tables']['jobs_raw']['Update']

export type JobSkill = Database['public']['Tables']['job_skills']['Row']
export type JobSkillInsert = Database['public']['Tables']['job_skills']['Insert']
export type JobSkillUpdate = Database['public']['Tables']['job_skills']['Update']

export type MarketStats = Database['public']['Tables']['market_stats']['Row']
export type MarketStatsInsert = Database['public']['Tables']['market_stats']['Insert']
export type MarketStatsUpdate = Database['public']['Tables']['market_stats']['Update']

export type Match = Database['public']['Tables']['matches']['Row']
export type MatchInsert = Database['public']['Tables']['matches']['Insert']
export type MatchUpdate = Database['public']['Tables']['matches']['Update']

export type SavedJob = Database['public']['Tables']['saved_jobs']['Row']
export type SavedJobInsert = Database['public']['Tables']['saved_jobs']['Insert']
export type SavedJobUpdate = Database['public']['Tables']['saved_jobs']['Update']

export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']
export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']

// ============================================================================
// EXTENDED TYPES (with relations)
// ============================================================================

export interface CvProfileWithRelations extends CvProfile {
  skills?: CvSkill[]
  experiences?: CvExperience[]
  education?: CvEducation[]
}

export interface JobWithSkills extends JobRaw {
  skills?: JobSkill[]
}

export interface MatchWithDetails extends Match {
  job?: JobRaw
  cv_profile?: CvProfile
}

export interface SavedJobWithDetails extends SavedJob {
  job?: JobRaw
}

export interface JobApplicationWithDetails extends JobApplication {
  job?: JobRaw
  cv_profile?: CvProfile
}

// ============================================================================
// FUNCTION RETURN TYPES
// ============================================================================

export type MatchScoreResult = Database['public']['Functions']['calculate_match_score']['Returns'][0]
export type ApplicationStats = Database['public']['Functions']['get_application_stats']['Returns'][0]
export type CountryComparison = Database['public']['Functions']['get_country_comparison']['Returns'][0]
export type SalaryInsight = Database['public']['Functions']['get_salary_insights']['Returns'][0]
export type TopSkill = Database['public']['Functions']['get_top_skills_for_role']['Returns'][0]
export type TrendingSkill = Database['public']['Functions']['get_trending_skills']['Returns'][0]
export type UserMatchResult = Database['public']['Functions']['get_user_matches']['Returns'][0]
export type JobSearchResult = Database['public']['Functions']['search_jobs']['Returns'][0]
