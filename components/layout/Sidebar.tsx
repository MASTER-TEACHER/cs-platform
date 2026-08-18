"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BarChart3,
  X,
} from "lucide-react";

import LogoutButton from "@/components/layout/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";

type SidebarLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const studentLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "🏠",
  },
  {
    href: "/adaptive-learning",
    label: "Adaptive Learning",
    icon: "🧬",
  },
  {
    href: "/knowledge-map",
    label: "Knowledge Map",
    icon: "🗺️",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: (
      <BarChart3 className="h-4 w-4" />
    ),
  },
  {
    href: "/tutor",
    label: "AI Tutor",
    icon: "🤖",
  },
  {
    href: "/revision-plan",
    label: "Revision Plan",
    icon: "🧭",
  },
  {
    href: "/assignments",
    label: "Assignments",
    icon: "📋",
  },
  {
    href: "/exam",
    label: "Exam Mode",
    icon: "🎯",
  },
  {
    href: "/learn",
    label: "Learn",
    icon: "📚",
  },
  {
    href: "/quiz",
    label: "Quiz",
    icon: "📝",
  },
  {
    href: "/programming",
    label: "Programming",
    icon: "💻",
  },
  {
    href: "/visualisers",
    label: "Visualisers",
    icon: "🧠",
  },
  {
    href: "/exam-trainer",
    label: "Exam Trainer",
    icon: "🧪",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "👤",
  },
];

const teacherLinks: SidebarLink[] = [
  {
    href: "/teacher",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/teacher/analytics",
    label: "Analytics",
    icon: (
      <BarChart3 className="h-4 w-4" />
    ),
  },
  {
    href: "/teacher/knowledge-map",
    label: "Class Knowledge Map",
    icon: "🗺️",
  },
  {
    href: "/teacher/interventions",
    label: "Interventions",
    icon: "🧭",
  },
  {
    href: "/teacher/students",
    label: "Students",
    icon: "👨‍🎓",
  },
  {
    href: "/teacher/classes",
    label: "Classes",
    icon: "🏫",
  },
  {
    href: "/teacher/assignments",
    label: "Assignments",
    icon: "📋",
  },
  {
    href: "/teacher/exam-assignments",
    label: "Exam Assignments",
    icon: "📝",
  },
  {
    href: "/teacher/assignment-wizard",
    label: "Assignment Wizard",
    icon: "🪄",
  },
  {
    href: "/teacher/quiz-generator",
    label: "AI Quiz Generator",
    icon: "🤖",
  },
  {
    href: "/teacher/quiz-library",
    label: "Quiz Library",
    icon: "🧠",
  },
  {
    href: "/teacher/assistant",
    label: "AI Teacher Assistant",
    icon: "✨",
  },
  {
    href: "/teacher/resources",
    label: "Resource Library",
    icon: "📚",
  },
  {
    href: "/teacher/reports",
    label: "Reports",
    icon: "📈",
  },
];

const adminLinks: SidebarLink[] = [
  {
    href: "/admin",
    label: "Admin Dashboard",
    icon: "🛡️",
  },
  {
    href: "/admin/teachers",
    label: "Teachers",
    icon: "👩‍🏫",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: "👥",
  },
  {
    href: "/admin/schools",
    label: "Schools",
    icon: "🏫",
  },
];

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const {
    profile,
    loading,
  } = useAuth();

  const isAdmin =
    profile?.role === "admin";

  const isTeacher =
    profile?.role === "teacher";

  const links = isAdmin
    ? adminLinks
    : isTeacher
      ? teacherLinks
      : studentLinks;

  const homeHref = isAdmin
    ? "/admin"
    : isTeacher
      ? "/teacher"
      : "/dashboard";

  const portalLabel = isAdmin
    ? "Administration"
    : isTeacher
      ? "Teacher Portal"
      : "Learn • Practice • Master";

  const accountName =
    profile?.name ||
    (isAdmin
      ? "Administrator"
      : isTeacher
        ? "Teacher"
        : "Student");

  const accountLabel = isAdmin
    ? "Administrator account"
    : isTeacher
      ? "Teacher account"
      : "Student account";

  function isActive(
    href: string,
  ): boolean {
    if (
      [
        "/dashboard",
        "/teacher",
        "/admin",
      ].includes(href)
    ) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  }

  function closeMobileNavigation() {
    onMobileClose?.();
  }

  const navigationContent = (
    <>
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={homeHref}
            onClick={
              closeMobileNavigation
            }
            className="flex min-w-0 items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="CS Master Logo"
              width={58}
              height={58}
              priority
              className="h-auto w-auto shrink-0 rounded-xl"
            />

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold">
                CS MASTER
              </h1>

              <p className="truncate text-xs text-slate-400">
                {portalLabel}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={
              closeMobileNavigation
            }
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white xl:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        {loading ? (
          <div className="h-12 animate-pulse rounded-xl bg-slate-800" />
        ) : (
          <>
            <p className="truncate font-bold">
              {accountName}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {accountLabel}
            </p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-5">
        {links.map((link) => {
          const active =
            isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={
                closeMobileNavigation
              }
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                active
                  ? isAdmin
                    ? "bg-violet-600 text-white shadow-lg"
                    : isTeacher
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center"
              >
                {link.icon}
              </span>

              <span>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <LogoutButton />

        <p className="mt-5 text-center text-xs text-slate-500">
          CS Master v1.6
        </p>
      </div>
    </>
  );

  return (
    <>
      {/*
       * Desktop navigation.
       *
       * We deliberately start the permanent sidebar at
       * 1280px instead of 1024px. At laptop/tablet widths
       * the application needs the full content area.
       */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-slate-900 text-white shadow-2xl xl:flex">
        {navigationContent}
      </aside>

      {/*
       * Tablet / mobile backdrop.
       */}
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={
          closeMobileNavigation
        }
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[1px] transition-opacity xl:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/*
       * Tablet / mobile navigation drawer.
       */}
      <aside
        id="mobile-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-300 xl:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {navigationContent}
      </aside>
    </>
  );
}