"use client";

import Image from "next/image";
import { questionHubPaths } from "@/components/teacher/QuestionHubTabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import LogoutButton from "@/components/layout/LogoutButton";
import SubjectSwitcher from "@/components/student/SubjectSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { APP_VERSION } from "@/lib/version";

type SidebarLink = {
  href: string;
  label: string;
  aLevelOnly?: boolean;
  subjectOnly?: "COMPUTER_SCIENCE" | "CREATIVE_IMEDIA";
  group?: string;
};

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const studentLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/adaptive-learning", subjectOnly: "COMPUTER_SCIENCE", label: "Adaptive Learning" },
  { href: "/knowledge-map", subjectOnly: "COMPUTER_SCIENCE", label: "Knowledge Map" },
  { href: "/analytics", label: "Analytics" },
  { href: "/tutor", label: "AI Tutor" },
  { href: "/revision-plan", subjectOnly: "COMPUTER_SCIENCE", label: "Revision Plan" },
  { href: "/assignments", label: "Assignments" },
  { href: "/notifications", label: "Notifications" },
  { href: "/exam", label: "Exam Mode" },
  { href: "/learn", label: "Learn" },
  {
    href: "/a-level-practice",
    label: "A-Level Practice",
    aLevelOnly: true,
    subjectOnly: "COMPUTER_SCIENCE",
  },
  {
    href: "/nea",
    label: "NEA Project",
    aLevelOnly: true,
    subjectOnly: "COMPUTER_SCIENCE",
  },
  { href: "/quiz", label: "Quiz" },
  { href: "/programming", subjectOnly: "COMPUTER_SCIENCE", label: "Programming" },
  { href: "/visualisers", subjectOnly: "COMPUTER_SCIENCE", label: "Visualisers" },
  { href: "/exam-trainer", subjectOnly: "COMPUTER_SCIENCE", label: "Exam Trainer" },
  { href: "/model-papers", subjectOnly: "COMPUTER_SCIENCE", label: "Model Papers" },
  { href: "/student-question-bank", label: "Question Bank" },
  { href: "/imedia-practice", subjectOnly: "CREATIVE_IMEDIA", label: "iMedia Practice" },
  { href: "/join-school", label: "Join School" },
  { href: "/profile", label: "Profile" },
  { href: "/data-rights", label: "Data Rights" },
  { href: "/feedback", label: "Feedback / Report a Problem" },
];

// Grouped so the teacher menu fits without long scrolling.
const teacherLinks: SidebarLink[] = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/classes", label: "Classes", group: "Teaching" },
  { href: "/teacher/students", label: "Students", group: "Teaching" },
  { href: "/teacher/question-bank/enhanced", label: "Question Bank", group: "Teaching" },
  { href: "/teacher/assignment-wizard", label: "Assignment Wizard", group: "Teaching" },
  { href: "/teacher/assignments", label: "Assignments", group: "Teaching" },
  { href: "/teacher/exam-assignments", label: "Exam Assignments", group: "Teaching" },
  { href: "/teacher/content", label: "Content Hub", group: "Teaching" },
  { href: "/teacher/resources", label: "Resource Library", group: "Teaching" },
  { href: "/teacher/assistant", label: "AI Teacher Assistant", group: "Teaching" },
  { href: "/teacher/marking-centre", label: "AI Examination Marking", group: "Marking & insight" },
  { href: "/teacher/analytics", label: "Analytics", group: "Marking & insight" },
  { href: "/teacher/knowledge-map", label: "Class Knowledge Map", group: "Marking & insight" },
  { href: "/teacher/interventions", label: "Interventions", group: "Marking & insight" },
  { href: "/teacher/reports", label: "Reports", group: "Marking & insight" },
  { href: "/teacher/nea", label: "NEA Monitoring", group: "Marking & insight" },
  { href: "/teacher/school", label: "School", group: "School & account" },
  { href: "/teacher/billing", label: "Billing", group: "School & account" },
  { href: "/feedback", label: "Feedback / Report a Problem", group: "School & account" },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/teacher-verification-reviews", label: "Teacher Verification Reviews" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/privacy-requests", label: "Privacy Requests" },
  { href: "/admin/feedback", label: "Feedback & Issues" },
];

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { profile, loading } = useAuth();

  const isAdmin = profile?.role === "admin";
  const isTeacher = profile?.role === "teacher";
  const isStudent = profile?.role === "student";
  const isIndividualStudent = isStudent && !profile?.schoolId;

  const activeSubject = profile?.subject === "CREATIVE_IMEDIA"
    ? "CREATIVE_IMEDIA"
    : "COMPUTER_SCIENCE";

  const qualification =
    (
      profile as {
        qualification?: string;
      } | null
    )?.qualification;

  const links =
    isAdmin
      ? adminLinks
      : isTeacher
        ? teacherLinks
        : studentLinks.filter(
            (link) =>
              (!link.subjectOnly || link.subjectOnly === activeSubject) &&
              (!link.aLevelOnly || qualification === "A_LEVEL"),
          );

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
      : isIndividualStudent
        ? "Individual student account"
        : "Student account";

  function isActive(href: string): boolean {
    if (["/dashboard", "/teacher", "/admin"].includes(href)) {
      return pathname === href;
    }

    /*
     * Question Bank covers papers, AI exam questions and quizzes.
     */
    if (href === "/teacher/question-bank/enhanced") {
      return questionHubPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
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
            onClick={closeMobileNavigation}
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
              <h1 className="truncate text-lg font-extrabold">CS MASTER</h1>
              <p className="truncate text-xs text-slate-400">{portalLabel}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileNavigation}
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
            <p className="truncate font-bold">{accountName}</p>
            <p className="mt-1 text-sm text-slate-400">{accountLabel}</p>
          </>
        )}
      </div>

      {isStudent && <SubjectSwitcher />}

      <nav className="flex-1 space-y-2 overflow-y-auto p-5">
        {links.map((link, index) => {
          const active = isActive(link.href);
          const showGroup = Boolean(link.group) && link.group !== links[index - 1]?.group;

          return (
            <div key={link.href}>
            {showGroup && (
              <p className="px-4 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {link.group}
              </p>
            )}
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileNavigation}
              className={`block rounded-xl px-4 ${link.group ? "py-2" : "py-3"} font-semibold transition ${
                active
                  ? isAdmin
                    ? "bg-violet-600 text-white shadow-lg"
                    : isTeacher
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
            </div>
          );
        })}

        {isIndividualStudent && (
          <Link
            href="/upgrade"
            onClick={closeMobileNavigation}
            className={`mt-4 block rounded-xl border px-4 py-3 font-black transition ${
              isActive("/upgrade")
                ? "border-amber-300 bg-amber-400 text-slate-950 shadow-lg"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950"
            }`}
          >
            Upgrade to Premium
          </Link>
        )}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <LogoutButton />
        <p className="mt-5 text-center text-xs text-slate-500">CS Master v{APP_VERSION}</p>
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
        onClick={closeMobileNavigation}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[1px] transition-opacity xl:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="mobile-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-300 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navigationContent}
      </aside>
    </>
  );
}
