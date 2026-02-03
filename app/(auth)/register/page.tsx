import { AuthCard, RegisterForm } from "@/components/auth";

export const metadata = {
  title: "Sign Up",
  description: "Create your Career Radar account",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Start your career journey with Career Radar"
    >
      <RegisterForm />
    </AuthCard>
  );
}
