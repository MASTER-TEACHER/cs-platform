"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * One place for questions: papers, AI exam questions and quizzes share these
 * tabs so teachers move between them without separate sidebar entries.
 */
export const questionHubTabs = [
  {
    href: "/teacher/question-bank/enhanced",
    label: "Papers & questions",
    matches: ["/teacher/question-bank"],
  },
  {
    href: "/teacher/exam-question-generator",
    label: "Generate exam questions (AI)",
    matches: ["/teacher/exam-question-generator"],
  },
  {
    href: "/teacher/quiz-library",
    label: "Quizzes",
    matches: ["/teacher/quiz-library"],
  },
  {
    href: "/teacher/quiz-generator",
    label: "Generate a quiz (AI)",
    matches: ["/teacher/quiz-generator"],
  },
];

export const questionHubPaths = questionHubTabs.flatMap((tab) => tab.matches);

export default function QuestionHubTabs() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Question Bank sections"
      className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2"
    >
      {questionHubTabs.map((tab) => {
        const active = tab.matches.some(
          (path) => pathname === path || pathname.startsWith(`${path}/`),
        );

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white"
                : "rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
