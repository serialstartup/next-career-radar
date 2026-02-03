"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signup } from "@/lib/actions/auth";
import { SocialButtons } from "./social-buttons";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const passwordRequirements = useMemo(
    () => [
      { met: password.length >= 8, text: "At least 8 characters" },
      { met: /[0-9]/.test(password), text: "Contains a number" },
      { met: /[A-Z]/.test(password), text: "Contains uppercase letter" },
      { met: /[a-z]/.test(password), text: "Contains lowercase letter" },
    ],
    [password]
  );

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirmPassword") as string;

    // Full name validation
    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!pwd) {
      newErrors.password = "Password is required";
    } else if (pwd.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[0-9]/.test(pwd)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!confirmPwd) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (pwd !== confirmPwd) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        toast.error("Registration failed", {
          description: result.error,
        });
      } else {
        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              className={`pl-10 h-11 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={isPending}
              autoComplete="name"
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className={`pl-10 h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={isPending}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={isPending}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength.label === "Weak"
                      ? "text-destructive"
                      : passwordStrength.label === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    {req.met ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={
                        req.met ? "text-green-600" : "text-muted-foreground"
                      }
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={isPending}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPassword && password === confirmPassword && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Passwords match
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              disabled={isPending}
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-destructive">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full h-11" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Social Login */}
      <SocialButtons isLoading={isPending} />

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
