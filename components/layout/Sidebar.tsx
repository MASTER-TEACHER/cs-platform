"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/layout/LogoutButton";
import { useUserProfile } from "@/hooks/useUserProfile";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/assignments", label: "Assignments", icon: "📋" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
  { href: "/visualisers", label: "Visualisers", icon: "🧠" },
  { href: "/exam", label: "Exam Mode", icon: "🎯" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const teacherLinks = [
  { href: "/teacher", label: "Dashboard", icon: "📊" },
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
  { href: "/teacher/reports", label: "Reports", icon: "📈" },
];
const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: "🛡️" },
  { href: "/admin/teachers", label: "Teachers", icon: "👩‍🏫" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/schools", label: "Schools", icon: "🏫" },
  { href: "/teacher", label: "Teacher Portal", icon: "📊" },
];
export default function Sidebar() {
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();

  const isAdmin = profile?.role === "admin";

const isTeacher =
  profile?.role === "teacher" || isAdmin;

const links = isAdmin
  ? adminLinks
  : isTeacher
    ? teacherLinks
    : studentLinks;

  function isActive(href: string) {
    if (href === "/dashboard" || href === "/teacher") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col bg-slate-900 text-white shadow-2xl">
      <div className="border-b border-slate-800 p-5">
        <Link
         href={
  isAdmin
    ? "/admin"
    : isTeacher
      ? "/teacher"
      : "/dashboard"
}
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.png"
            alt="CS Master Logo"
            width={58}
            height={58}
            priority
            className="h-auto w-auto rounded-xl"
          />

          <div>
            <h1 className="text-lg font-extrabold tracking-wide">
              CS MASTER
            </h1>

            <p className="text-xs text-slate-400">
              {isAdmin
  ? "Admin Portal"
  : isTeacher
    ? "Teacher Portal"
    : "Learn • Practice • Master"}
            </p>
          </div>
        </Link>
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        {loading ? (
          <div className="h-12 animate-pulse rounded-xl bg-slate-800" />
        ) : (
          <>
            <p className="font-bold text-white">
             {profile?.name ||
  (isAdmin ? "Administrator" : isTeacher ? "Teacher" : "Student")}
            </p>

            <p className="mt-1 text-sm capitalize text-slate-400">
              {isAdmin
  ? "Administrator account"
  : isTeacher
    ? "Teacher account"
    : "Student account"}
            </p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                active
                  ? isTeacher
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <LogoutButton />

        <p className="mt-5 text-center text-xs text-slate-500">
          CS Master v1.2
        </p>
      </div>
    </aside>
  );
}