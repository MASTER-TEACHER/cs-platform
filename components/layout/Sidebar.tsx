"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import LogoutButton from "@/components/layout/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3 } from "lucide-react";

type SidebarLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

const studentLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/adaptive-learning", label: "Adaptive Learning", icon: "🧬" },
  { href: "/knowledge-map", label: "Knowledge Map", icon: "🗺️" },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  { href: "/tutor", label: "AI Tutor", icon: "🤖" },
  { href: "/revision-plan", label: "Revision Plan", icon: "🧭" },
  { href: "/assignments", label: "Assignments", icon: "📋" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
  { href: "/programming", label: "Programming", icon: "💻" },
  { href: "/visualisers", label: "Visualisers", icon: "🧠" },
  { href: "/exam", label: "Exam Mode", icon: "🎯" },
  { href: "/exam-trainer", label: "Exam Trainer", icon: "🧪" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const teacherLinks: SidebarLink[] = [
  { href: "/teacher", label: "Dashboard", icon: "📊" },
  {
    href: "/teacher/analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
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
  { href: "/teacher/students", label: "Students", icon: "👨‍🎓" },
  { href: "/teacher/classes", label: "Classes", icon: "🏫" },
  { href: "/teacher/assignments", label: "Assignments", icon: "📋" },
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
  { href: "/teacher/reports", label: "Reports", icon: "📈" },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Admin Dashboard", icon: "🛡️" },
  { href: "/admin/teachers", label: "Teachers", icon: "👩‍🏫" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/schools", label: "Schools", icon: "🏫" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, loading } = useAuth();

  const isAdmin = profile?.role === "admin";
  const isTeacher = profile?.role === "teacher";

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;

  const homeHref = isAdmin ? "/admin" : isTeacher ? "/teacher" : "/dashboard";

  const portalLabel = isAdmin
    ? "Administration"
    : isTeacher
      ? "Teacher Portal"
      : "Learn • Practice • Master";

  const accountName =
    profile?.name ||
    (isAdmin ? "Administrator" : isTeacher ? "Teacher" : "Student");

  const accountLabel = isAdmin
    ? "Administrator account"
    : isTeacher
      ? "Teacher account"
      : "Student account";

  function isActive(href: string): boolean {
    if (["/dashboard", "/teacher", "/admin"].includes(href)) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col bg-slate-900 text-white shadow-2xl">
      <div className="border-b border-slate-800 p-5">
        <Link href={homeHref} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="CS Master Logo"
            width={58}
            height={58}
            priority
            className="h-auto w-auto rounded-xl"
          />

          <div>
            <h1 className="text-lg font-extrabold">CS MASTER</h1>
            <p className="text-xs text-slate-400">{portalLabel}</p>
          </div>
        </Link>
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        {loading ? (
          <div className="h-12 animate-pulse rounded-xl bg-slate-800" />
        ) : (
          <>
            <p className="font-bold">{accountName}</p>
            <p className="mt-1 text-sm text-slate-400">{accountLabel}</p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-5">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
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
              <span aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
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
    </aside>
  );
}
