import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";

import type { Metadata } from "next";
import "./globals.css";
import { siteDescription, siteUrl } from "@/lib/site";
import { AuthProvider } from "@/contexts/AuthContext";
import IdleSessionGuard from "@/components/auth/IdleSessionGuard";
import AppShell from "@/components/layout/AppShell";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { Toaster } from "react-hot-toast";
import RequireCourse from "@/components/auth/RequireCourse";
import CookieBanner from "@/components/legal/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CS Master | GCSE & A-level Computer Science",
    template: "%s | CS Master",
  },
  description: siteDescription,
  applicationName: "CS Master",
  keywords: [
    "Computer Science",
    "GCSE Computer Science",
    "A-level Computer Science",
    "Computer Science revision",
    "Programming practice",
    "Exam practice",
    "AI marking",
    "Education",
  ],
  authors: [{ name: "Master Teacher (Mr. Richards)" }],
  creator: "Master Teacher (Mr. Richards)",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "CS Master | GCSE & A-level Computer Science",
    description: siteDescription,
    siteName: "CS Master",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1747,
        height: 900,
        alt: "CS Master",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Master | GCSE & A-level Computer Science",
    description: siteDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <IdleSessionGuard />
          <AccessibilityPanel />
          <ProgressProvider>
            <RequireCourse>
              <AppShell>{children}</AppShell>
            </RequireCourse>
          </ProgressProvider>
        </AuthProvider>

        <CookieBanner />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#0f172a",
              color: "#fff",
            },
          }}
        />
        
      </body>
    </html>
  );
}
