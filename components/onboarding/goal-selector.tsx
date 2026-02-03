"use client";

import { cn } from "@/lib/utils";
import { GraduationCap, ArrowLeftRight, TrendingUp, Check } from "lucide-react";

export type GoalType = "build_first_cv" | "switch_careers" | "improve_cv";

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const goalOptions: GoalOption[] = [
  {
    id: "build_first_cv",
    title: "Building my first CV",
    description: "For students or those entering the workforce for the first time.",
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    id: "switch_careers",
    title: "Switching careers",
    description: "For professionals looking to pivot to a new industry or role.",
    icon: <ArrowLeftRight className="h-6 w-6" />,
  },
  {
    id: "improve_cv",
    title: "Improving my CV",
    description: "Optimize your existing resume for better market demand.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
];

interface GoalSelectorProps {
  value: GoalType | null;
  onChange: (value: GoalType) => void;
}

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Let&apos;s personalize your journey.
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          To help you effectively, we need to know where you are in your career journey.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-center text-foreground">
          What is your primary goal today?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goalOptions.map((option) => {
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

                {/* Checkmark */}
                <div
                  className={cn(
                    "absolute bottom-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground/50"
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
