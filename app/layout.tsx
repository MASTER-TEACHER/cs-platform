import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { Toaster } from "react-hot-toast";
import RequireCourse from "@/components/auth/RequireCourse";

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