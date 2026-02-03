import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Career Radar - Navigate Your Career with Confidence",
    template: "%s | Career Radar",
  },
  description:
    "AI-powered career intelligence platform. Build your CV, discover market insights, and find your perfect job match.",
  keywords: [
    "career",
    "job search",
    "CV builder",
    "resume",
    "market intelligence",
    "job matching",
    "career insights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
