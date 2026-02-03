"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { GoalSelector, type GoalType } from "./goal-selector";
import { ExperienceSelector, type ExperienceType, getExperienceLevelFromType } from "./experience-selector";
import { RoleSelector } from "./role-selector";
import { saveOnboardingData } from "@/lib/actions/onboarding";
import type { PrimaryGoal } from "@/types/database.types";

interface OnboardingFormProps {
  userId?: string;
}

// Map GoalType to database PrimaryGoal
function mapGoalToPrimaryGoal(goal: GoalType): PrimaryGoal {
  switch (goal) {
    case "build_first_cv":
      return "improve_cv";
    case "switch_careers":
      return "find_job";
    case "improve_cv":
      return "improve_cv";
    default:
      return "explore_market";
  }
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const totalSteps = 3;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedGoal !== null;
      case 2:
        return selectedExperience !== null;
      case 3:
        return true; // Roles are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await saveOnboardingData({
          primaryGoal: selectedGoal ? mapGoalToPrimaryGoal(selectedGoal) : null,
          experienceLevel: selectedExperience
            ? getExperienceLevelFromType(selectedExperience)
            : null,
          targetRoles: selectedRoles,
        });

        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.error || "Failed to save onboarding data");
        }
      } catch {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Card */}
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* Progress Section */}
        <div className="px-6 py-5 border-b border-border bg-muted/30">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 md:px-10 md:py-10">
          {/* Step 1: Goal Selection */}
          {currentStep === 1 && (
            <GoalSelector value={selectedGoal} onChange={setSelectedGoal} />
          )}

          {/* Step 2: Experience Selection */}
          {currentStep === 2 && (
            <ExperienceSelector
              value={selectedExperience}
              onChange={setSelectedExperience}
            />
          )}

          {/* Step 3: Role Selection */}
          {currentStep === 3 && (
            <RoleSelector value={selectedRoles} onChange={setSelectedRoles} />
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-6 py-5 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <div>
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isPending}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isPending}
                  className="text-muted-foreground"
                >
                  Skip for now
                </Button>
              )}
            </div>

            {/* Continue/Finish Button */}
            <div className="flex items-center gap-3">
              {currentStep === 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isPending}
                  className="text-muted-foreground"
                >
                  Skip for now
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || isPending}
                className="gap-2 min-w-[140px]"
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    Finish & Explore
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-6 text-center">
        {currentStep === 1 && (
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to Career Radar&apos;s{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
            <br />
            Your information is used to personalize your market analysis experience.
          </p>
        )}
        {currentStep === 2 && (
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span className="text-primary">ℹ</span>
            This data helps us calculate salary benchmarks for your specific level.
          </p>
        )}
        {currentStep === 3 && (
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Career Radar. Powered by real-time market data.
          </p>
        )}
      </div>
    </div>
  );
}
