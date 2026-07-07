import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { Toaster } from "react-hot-toast";
import RequireCourse from "@/components/auth/RequireCourse";

export const metadata: Metadata = {
  metadataBase: new URL("https://cs-platform-5cgp.vercel.app"),
  title: {
    default: "CS Master",
    template: "%s | CS Master",
  },
  description:
    "CS Master is an interactive GCSE Computer Science learning platform with lessons, simulators, XP, badges and progress tracking.",
  applicationName: "CS Master",
  keywords: [
    "Computer Science",
    "GCSE Computer Science",
    "Binary",
    "Hexadecimal",
    "Coding",
    "Education",
    "Revision",
  ],
  authors: [{ name: "Chris Brown" }],
  creator: "Chris Brown",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "CS Master",
    description:
      "Interactive GCSE Computer Science lessons, simulators, XP, badges and progress tracking.",
    siteName: "CS Master",
    type: "website",
    images: ["/logo.png"],
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
          <ProgressProvider>
            <RequireCourse>
              <AppShell>{children}</AppShell>
            </RequireCourse>
          </ProgressProvider>
        </AuthProvider>

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