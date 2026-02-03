"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ExperienceLevel, PrimaryGoal } from "@/types/database.types";

export interface OnboardingData {
  primaryGoal: PrimaryGoal | null;
  experienceLevel: ExperienceLevel | null;
  targetRoles: string[];
}

export interface OnboardingResult {
  success: boolean;
  error?: string;
}

export async function saveOnboardingData(
  data: OnboardingData
): Promise<OnboardingResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to complete onboarding",
      };
    }

    // Check if user_preferences already exists
    const { data: existingPrefs } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingPrefs) {
      // Update existing preferences
      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({
          primary_goal: data.primaryGoal,
          experience_level: data.experienceLevel,
          target_roles: data.targetRoles,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating user preferences:", updateError);
        return {
          success: false,
          error: "Failed to update preferences",
        };
      }
    } else {
      // Insert new preferences
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user.id,
          primary_goal: data.primaryGoal,
          experience_level: data.experienceLevel,
          target_roles: data.targetRoles,
        });

      if (insertError) {
        console.error("Error inserting user preferences:", insertError);
        return {
          success: false,
          error: "Failed to save preferences",
        };
      }
    }

    // Update profile to mark onboarding as completed
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Don't fail the whole operation if profile update fails
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in saveOnboardingData:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function skipOnboarding(): Promise<OnboardingResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    // Update profile to mark onboarding as completed (skipped)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return {
        success: false,
        error: "Failed to skip onboarding",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in skipOnboarding:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
