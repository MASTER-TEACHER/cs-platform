import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { ProgressProvider } from "@/contexts/ProgressContext";

export const metadata: Metadata = {
  title: "CS Master",
  description: "Computer Science learning platform",
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
    <AppShell>{children}</AppShell>
  </ProgressProvider>
</AuthProvider>
      </body>
    </html>
  );
}