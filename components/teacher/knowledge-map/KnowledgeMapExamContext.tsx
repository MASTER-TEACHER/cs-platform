"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileBarChart2,
  Target,
} from "lucide-react";

import Card from "@/components/ui/Card";

export default function KnowledgeMapExamContext() {
  const searchParams = useSearchParams();

  const source =
    searchParams.get("source") || "";

  const assignmentId =
    searchParams.get("assignmentId") || "";

  const topic =
    searchParams.get("topic") || "";

  const classId =
    searchParams.get("classId") || "";

  if (
    source !== "exam" ||
    (!topic && !assignmentId)
  ) {
    return null;
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-indigo-200 p-0">
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-600 p-3 text-white">
              <FileBarChart2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-700">
                Written exam evidence
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                Review exam weakness in the class knowledge map
              </h2>

              {topic && (
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-black text-indigo-900">
                  <Target className="h-4 w-4" />
                  Focus topic: {topic}
                </p>
              )}

              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                Compare the written-exam signal with the wider mastery evidence
                before deciding whether the class needs reteaching or targeted
                follow-up.
              </p>

              {classId && (
                <p className="mt-2 text-xs font-bold text-slate-400">
                  Exam class context: {classId}
                </p>
              )}
            </div>
          </div>

          {assignmentId && (
            <Link
              href={`/teacher/exam-assignments/${assignmentId}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to exam intelligence
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
