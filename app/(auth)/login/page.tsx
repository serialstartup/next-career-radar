import { AuthCard, LoginForm } from "@/components/auth";

export const metadata = {
  title: "Login",
  description: "Sign in to your Career Radar account",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthCard>
  );
}
