"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Menu,
} from "lucide-react";
import {
  usePathname,
} from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import StudentAccessGate from "@/components/student/StudentAccessGate";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] =
    useState(false);

  const publicPages = [
  "/",
  "/landing",
  "/login",
  "/register",
  "/forgot-password",
  "/pricing",
  "/onboarding",
  "/teacher-verification",
  "/cookies",
  "/terms",
  "/privacy",
  "/help",
  "/contact",
  "/about",
  "/teacher-access",
];

  const isPublicPage =
    publicPages.includes(
      pathname,
    );

  const isTeacherWorkspace =
    pathname ===
      "/teacher" ||
    pathname.startsWith(
      "/teacher/",
    );

  const isAdminWorkspace =
    pathname ===
      "/admin" ||
    pathname.startsWith(
      "/admin/",
    );

  /*
   * Written-exam attempts deliberately remove the ordinary
   * student navigation shell. The page itself controls the
   * monitored exam experience, while StudentAccessGate still
   * protects access to the authenticated student workspace.
   */
  const isWrittenExamAttempt =
    pathname.startsWith(
      "/assignments/exam/",
    );

  useEffect(() => {
    void Promise.resolve().then(
      () => {
        setMobileSidebarOpen(
          false,
        );
      },
    );
  }, [
    pathname,
  ]);

  useEffect(() => {
    if (
      !mobileSidebarOpen
    ) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    mobileSidebarOpen,
  ]);

  if (
    isPublicPage
  ) {
    return (
      <main className="min-h-screen bg-slate-100">
        {children}
      </main>
    );
  }

  if (
    isWrittenExamAttempt
  ) {
    return (
      <StudentAccessGate>
        <main className="min-h-screen bg-slate-100">
          {children}
        </main>
      </StudentAccessGate>
    );
  }

  const applicationShell = (
    <div className="min-h-screen bg-slate-100 xl:flex">
      <Sidebar
        mobileOpen={
          mobileSidebarOpen
        }
        onMobileClose={() =>
          setMobileSidebarOpen(
            false,
          )
        }
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 xl:hidden">
          <div>
            <p className="text-sm font-black tracking-wide text-slate-950">
              CS MASTER
            </p>

            <p className="text-xs text-slate-500">
              Learning Platform
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(
                true,
              )
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Open navigation"
            aria-expanded={
              mobileSidebarOpen
            }
            aria-controls="mobile-navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="min-w-0 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );

  if (
    isTeacherWorkspace ||
    isAdminWorkspace
  ) {
    return applicationShell;
  }

  return (
    <StudentAccessGate>
      {applicationShell}
    </StudentAccessGate>
  );
}
