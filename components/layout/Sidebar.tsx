"use client";

import Image from "next/image";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import type {
  ReactNode,
} from "react";

import {
  BarChart3,
  Crown,
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
  // STUDENT LINKS

{
  href: "/dashboard",
  label: "Dashboard",
  icon: "\u{1F3E0}", // 🏠
},
{
  href: "/adaptive-learning",
  label: "Adaptive Learning",
  icon: "\u{1F9EC}", // 🧬
},
{
  href: "/knowledge-map",
  label: "Knowledge Map",
  icon: "\u{1F5FA}\u{FE0F}", // 🗺️
},

// Analytics stays as BarChart3

{
  href: "/tutor",
  label: "AI Tutor",
  icon: "\u{1F916}", // 🤖
},
{
  href: "/revision-plan",
  label: "Revision Plan",
  icon: "\u{1F9ED}", // 🧭
},
{
  href: "/assignments",
  label: "Assignments",
  icon: "\u{1F4CB}", // 📋
},
{
  href: "/notifications",
  label: "Notifications",
  icon: "\u{1F514}", // 🔔
},
{
  href: "/exam",
  label: "Exam Mode",
  icon: "\u{1F3AF}", // 🎯
},
{
  href: "/learn",
  label: "Learn",
  icon: "\u{1F4DA}", // 📚
},
{
  href: "/quiz",
  label: "Quiz",
  icon: "\u{1F4DD}", // 📝
},
{
  href: "/programming",
  label: "Programming",
  icon: "\u{1F4BB}", // 💻
},
{
  href: "/visualisers",
  label: "Visualisers",
  icon: "\u{1F9E0}", // 🧠
},
{
  href: "/exam-trainer",
  label: "Exam Trainer",
  icon: "\u{1F9EA}", // 🧪
},
{
  href: "/join-school",
  label: "Join School",
  icon: "\u{1F3EB}", // 🏫
},
{
  href: "/profile",
  label: "Profile",
  icon: "\u{1F464}", // 👤
},
{
  href: "/data-rights",
  label: "Data Rights",
  icon: "\u{1F510}", // 🔐
},
{
  href: "/feedback",
  label: "Feedback / Report a Problem",
  icon: "\u{1F4AC}", // 💬
},
];

const teacherLinks: SidebarLink[] = [
  {
    href: "/teacher",
    label: "Dashboard",
    icon: "ðŸ“Š",
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
    icon: "ðŸ—ºï¸",
  },
  {
    href: "/teacher/interventions",
    label: "Interventions",
    icon: "ðŸ§­",
  },
  {
    href: "/teacher/students",
    label: "Students",
    icon: "ðŸ‘¨â€ðŸŽ“",
  },
  {
    href: "/teacher/classes",
    label: "Classes",
    icon: "ðŸ«",
  },
  {
    href: "/teacher/school",
    label: "School",
    icon: "ðŸ¢",
  },
  {
    href: "/teacher/billing",
    label: "Billing",
    icon: "ðŸ’³",
  },
  {
    href: "/teacher/assignments",
    label: "Assignments",
    icon: "ðŸ“‹",
  },
  {
    href: "/teacher/exam-assignments",
    label: "Exam Assignments",
    icon: "ðŸ“",
  },
  {
    href: "/teacher/assignment-wizard",
    label: "Assignment Wizard",
    icon: "ðŸª„",
  },
  {
    href: "/teacher/quiz-generator",
    label: "AI Quiz Generator",
    icon: "ðŸ¤–",
  },
  {
    href: "/teacher/quiz-library",
    label: "Quiz Library",
    icon: "ðŸ§ ",
  },
  {
    href: "/teacher/assistant",
    label: "AI Teacher Assistant",
    icon: "âœ¨",
  },
  {
    href: "/teacher/content",
    label: "Content Hub",
    icon: "\u{1F782}\u{FE0F}", // 🗂️
  },
  {
    href: "/teacher/resources",
    label: "Resource Library",
    icon: "ðŸ“š",
  },
  {
    href: "/teacher/reports",
    label: "Reports",
    icon: "ðŸ“ˆ",
  },
  {
    href: "/feedback",
    label: "Feedback / Report a Problem",
    icon: "ðŸ’¬",
  },
];

const adminLinks: SidebarLink[] = [
  // ADMIN LINKS

{
  href: "/admin",
  label: "Admin Dashboard",
  icon: "\u{1F6E1}\u{FE0F}", // 🛡️
},
{
  href: "/admin/teacher-verification-reviews",
  label: "Teacher Verification Reviews",
  icon: "\u{1F510}", // 🔐
},
{
  href: "/admin/teachers",
  label: "Teachers",
  icon: "\u{1F469}\u{200D}\u{1F3EB}", // 👩‍🏫
},
{
  href: "/admin/users",
  label: "Users",
  icon: "\u{1F465}", // 👥
},
{
  href: "/admin/schools",
  label: "Schools",
  icon: "\u{1F3EB}", // 🏫
},
{
  href: "/admin/privacy-requests",
  label: "Privacy Requests",
  icon: "\u{1F510}", // 🔐
},
{
  href: "/admin/feedback",
  label: "Feedback & Issues",
  icon: "\u{1F4AC}", // 💬
},
];

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname =
    usePathname();

  const {
    profile,
    loading,
  } =
    useAuth();

  const isAdmin =
    profile?.role ===
    "admin";

  const isTeacher =
    profile?.role ===
    "teacher";

  const isStudent =
    profile?.role ===
    "student";

  const isIndividualStudent =
    isStudent &&
    !profile?.schoolId;

  const links =
    isAdmin
      ? adminLinks
      : isTeacher
        ? teacherLinks
        : studentLinks;

  const homeHref =
    isAdmin
      ? "/admin"
      : isTeacher
        ? "/teacher"
        : "/dashboard";

  const portalLabel =
    isAdmin
      ? "Administration"
      : isTeacher
        ? "Teacher Portal"
       : "Learn \u2022 Practice \u2022 Master";

  const accountName =
    profile?.name ||
    (
      isAdmin
        ? "Administrator"
        : isTeacher
          ? "Teacher"
          : "Student"
    );

  const accountLabel =
    isAdmin
      ? "Administrator account"
      : isTeacher
        ? "Teacher account"
        : isIndividualStudent
          ? "Individual student account"
          : "Student account";

  function isActive(
    href: string,
  ): boolean {
    if (
      [
        "/dashboard",
        "/teacher",
        "/admin",
      ].includes(
        href,
      )
    ) {
      return (
        pathname === href
      );
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
        {links.map(
          (
            link,
          ) => {
            const active =
              isActive(
                link.href,
              );

            return (
              <Link
                key={
                  link.href
                }
                href={
                  link.href
                }
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
                  {
                    link.icon
                  }
                </span>

                <span>
                  {
                    link.label
                  }
                </span>
              </Link>
            );
          },
        )}

        {isIndividualStudent && (
          <Link
            href="/upgrade"
            onClick={
              closeMobileNavigation
            }
            className={`mt-4 flex items-center gap-3 rounded-xl border px-4 py-3 font-black transition ${
              isActive("/upgrade")
                ? "border-amber-300 bg-amber-400 text-slate-950 shadow-lg"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950"
            }`}
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center"
            >
              <Crown className="h-5 w-5" />
            </span>

            <span>
              Upgrade to Premium
            </span>
          </Link>
        )}
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
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-slate-900 text-white shadow-2xl xl:flex">
        {navigationContent}
      </aside>

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
