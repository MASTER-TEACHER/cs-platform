"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Target,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";

export default function InterventionActionContext() {
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId") || "";
  const classId = searchParams.get("classId") || "";
  const topic = searchParams.get("topic") || "";
  const reason = searchParams.get("reason") || "";

  if (!studentId) {
    return null;
  }

  const cleanHref = "/teacher/interventions";

  return (
    <Card className="overflow-hidden rounded-3xl border border-violet-200">
      <div className="flex flex-col gap-5 bg-violet-50 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-600 p-3 text-white">
            <Target className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
              Intelligence handoff
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              Create support from analytics
            </h2>

            {topic && (
              <p className="mt-2 text-sm font-black text-violet-900">
                Focus: {topic}
              </p>
            )}

            {reason && (
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                {reason}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/teacher/students/${studentId}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white"
          >
            Student record
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <a
  href={
    `/teacher/assignment-wizard?studentId=${encodeURIComponent(studentId)}` +
    `&classId=${encodeURIComponent(classId)}` +
    `&topic=${encodeURIComponent(topic)}` +
    `&source=intervention`
  }
  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
>
  Assign targeted work
  <ArrowRight className="h-3.5 w-3.5" />
</a>

          <Link
            href={cleanHref}
            title="Clear analytics context"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-700"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
