"use client";

import { cn } from "@/lib/utils";
import { GraduationCap, Settings, RefreshCw, Award, Check } from "lucide-react";
import type { ExperienceLevel } from "@/types/database.types";

export type ExperienceType = "student" | "junior" | "career_switcher" | "senior";

interface ExperienceOption {
  id: ExperienceType;
  title: string;
  description: string;
  icon: React.ReactNode;
  dbValue: ExperienceLevel;
}

const experienceOptions: ExperienceOption[] = [
  {
    id: "student",
    title: "Student/Graduate",
    description: "Looking for your first career break.",
    icon: <GraduationCap className="h-6 w-6" />,
    dbValue: "entry",
  },
  {
    id: "junior",
    title: "Junior Professional",
    description: "1-3 years of relevant experience.",
    icon: <Settings className="h-6 w-6" />,
    dbValue: "junior",
  },
  {
    id: "career_switcher",
    title: "Career Switcher",
    description: "Transitioning to a new industry.",
    icon: <RefreshCw className="h-6 w-6" />,
    dbValue: "mid",
  },
  {
    id: "senior",
    title: "Senior Professional",
    description: "5+ years or leadership experience.",
    icon: <Award className="h-6 w-6" />,
    dbValue: "senior",
  },
];

interface ExperienceSelectorProps {
  value: ExperienceType | null;
  onChange: (value: ExperienceType) => void;
}

export function ExperienceSelector({ value, onChange }: ExperienceSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Where are you in your journey?
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Tell us your current professional stage so we can tailor market demand data and CV suggestions specifically for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {experienceOptions.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200 text-left",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {/* Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors",
                  isSelected
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.icon}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to convert ExperienceType to database ExperienceLevel
export function getExperienceLevelFromType(type: ExperienceType): ExperienceLevel {
  const option = experienceOptions.find((opt) => opt.id === type);
  return option?.dbValue ?? "entry";
}
