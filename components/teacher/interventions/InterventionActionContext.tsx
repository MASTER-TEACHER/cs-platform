"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  FileBarChart2,
  Target,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";

export default function InterventionActionContext() {
  const searchParams = useSearchParams();

  const studentId =
    searchParams.get("studentId") || "";

  const classId =
    searchParams.get("classId") || "";

  const topic =
    searchParams.get("topic") || "";

  const reason =
    searchParams.get("reason") || "";

  const source =
    searchParams.get("source") || "";

  const assignmentId =
    searchParams.get("assignmentId") || "";

  if (!studentId) {
    return null;
  }

  const examSource =
    source === "exam";

  const cleanHref =
    "/teacher/interventions";

  return (
    <Card
      className={`overflow-hidden rounded-3xl ${
        examSource
          ? "border border-indigo-200"
          : "border border-violet-200"
      }`}
    >
      <div
        className={`flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between ${
          examSource
            ? "bg-indigo-50"
            : "bg-violet-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`rounded-xl p-3 text-white ${
              examSource
                ? "bg-indigo-600"
                : "bg-violet-600"
            }`}
          >
            {examSource ? (
              <FileBarChart2 className="h-5 w-5" />
            ) : (
              <Target className="h-5 w-5" />
            )}
          </div>

          <div>
            <p
              className={`text-xs font-black uppercase tracking-[0.16em] ${
                examSource
                  ? "text-indigo-700"
                  : "text-violet-700"
              }`}
            >
              {examSource
                ? "Exam intelligence handoff"
                : "Intelligence handoff"}
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              {examSource
                ? "Create support from written-exam evidence"
                : "Create support from analytics"}
            </h2>

            {topic && (
              <p
                className={`mt-2 text-sm font-black ${
                  examSource
                    ? "text-indigo-900"
                    : "text-violet-900"
                }`}
              >
                Focus: {topic}
              </p>
            )}

            {reason && (
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                {reason}
              </p>
            )}

            {examSource && (
              <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-500">
                Use the exam result alongside the learner&apos;s wider mastery,
                completion and trend evidence before deciding the support
                pathway.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {examSource &&
            assignmentId && (
              <Link
                href={`/teacher/exam-assignments/${assignmentId}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 text-xs font-black text-indigo-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exam intelligence
              </Link>
            )}

          <Link
            href={`/teacher/students/${studentId}`}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-xs font-black text-white ${
              examSource
                ? "bg-indigo-600"
                : "bg-violet-600"
            }`}
          >
            Student record
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={
              `/teacher/assignment-wizard?studentId=${encodeURIComponent(studentId)}` +
              `&classId=${encodeURIComponent(classId)}` +
              `&topic=${encodeURIComponent(topic)}` +
              `&source=${encodeURIComponent(examSource ? "exam" : "intervention")}`
            }
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
          >
            Assign targeted work
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={cleanHref}
            title="Clear intelligence context"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white ${
              examSource
                ? "border-indigo-200 text-indigo-700"
                : "border-violet-200 text-violet-700"
            }`}
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
