"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/actions/auth";
import { SocialButtons } from "./social-buttons";

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error("Login failed", {
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={isPending}
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isPending}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full h-11" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Social Login */}
      <SocialButtons isLoading={isPending} />

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
