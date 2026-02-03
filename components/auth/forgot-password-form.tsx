"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/actions/auth";

interface FormErrors {
  email?: string;
}

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const email = formData.get("email") as string;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    const email = formData.get("email") as string;

    startTransition(async () => {
      const result = await forgotPassword(formData);
      if (result?.error) {
        toast.error("Request failed", {
          description: result.error,
        });
      } else {
        setSubmittedEmail(email);
        setIsSuccess(true);
        toast.success("Email sent!", {
          description: "Check your inbox for the password reset link.",
        });
      }
    });
  };

  const handleResend = () => {
    const formData = new FormData();
    formData.append("email", submittedEmail);

    startTransition(async () => {
      const result = await forgotPassword(formData);
      if (result?.error) {
        toast.error("Request failed", {
          description: result.error,
        });
      } else {
        toast.success("Email resent!", {
          description: "Check your inbox for the password reset link.",
        });
      }
    });
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?
          </p>
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend email"
            )}
          </Button>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  // Form State
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

        {/* Submit Button */}
        <Button type="submit" className="w-full h-11" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
