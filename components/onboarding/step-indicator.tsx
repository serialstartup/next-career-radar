"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepLabels = ["Goal Setting", "Experience", "Interests"],
}: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  const getStepLabel = () => {
    if (currentStep === totalSteps) {
      return "Final Step";
    }
    return `Step ${currentStep} of ${totalSteps}`;
  };

  const getProgressLabel = () => {
    if (currentStep === totalSteps) {
      return "100% Complete";
    }
    return `${Math.round(progress)}% Complete`;
  };

  const getEncouragementMessage = () => {
    switch (currentStep) {
      case 1:
        return null;
      case 2:
        return "Almost there! You're doing great.";
      case 3:
        return "We're tailoring your experience!";
      default:
        return null;
    }
  };

  const encouragementMessage = getEncouragementMessage();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {getStepLabel()}
          </p>
          {currentStep === 1 && stepLabels[0] && (
            <p className="text-sm font-semibold text-foreground">
              {stepLabels[currentStep - 1]}
            </p>
          )}
        </div>
        <p className="text-sm font-medium text-primary">{getProgressLabel()}</p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-500 ease-out"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Encouragement Message */}
      {encouragementMessage && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-primary">✦</span>
          {encouragementMessage}
        </p>
      )}
    </div>
  );
}
