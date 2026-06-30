"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicPages = ["/login", "/register", "/forgot-password", "/auth-test"];
  const isPublicPage = publicPages.includes(pathname);

  if (isPublicPage) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}