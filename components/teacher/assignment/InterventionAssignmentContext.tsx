"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Target } from "lucide-react";

import Card from "@/components/ui/Card";

export default function InterventionAssignmentContext() {
  const searchParams = useSearchParams();

  const source = searchParams.get("source");
  const studentId = searchParams.get("studentId") || "";
  const topic = searchParams.get("topic") || "";

  if (source !== "intervention" || !studentId) {
    return null;
  }

  return (
    <Card className="border border-amber-200 bg-amber-50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-500 p-3 text-white">
            <Target className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">
              Targeted intervention assignment
            </p>

            <p className="mt-1 font-black text-amber-950">
              {topic
                ? `Choose work that targets ${topic}.`
                : "Choose work for this learner's intervention pathway."}
            </p>

            <p className="mt-1 text-sm text-amber-800">
              Use the normal Assignment Wizard. The analytics context is
              informational and does not change your existing assignment rules.
            </p>
          </div>
        </div>

        <Link
          href={`/teacher/students/${studentId}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-black text-amber-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Student record
        </Link>
      </div>
    </Card>
  );
}
