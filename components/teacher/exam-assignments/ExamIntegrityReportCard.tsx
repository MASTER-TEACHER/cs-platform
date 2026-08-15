"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import Card from "@/components/ui/Card";
import type {
  ExamIntegrityIncident,
  ExamSubmission,
} from "@/types/examAssignment";

function formatDate(
  value: Date | null,
): string {
  if (!value) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  ).format(value);
}

function incidentLabel(
  incident: ExamIntegrityIncident,
): string {
  switch (incident.type) {
    case "fullscreen_exit":
      return "Exited fullscreen";

    case "fullscreen_restored":
      return "Returned to fullscreen";

    case "page_hidden":
      return "Exam page hidden";

    case "page_visible":
      return "Exam page visible again";

    case "integrity_termination":
      return "Exam terminated";

    default:
      return incident.type;
  }
}

export default function ExamIntegrityReportCard({
  submission,
}: {
  submission: ExamSubmission;
}) {
  const incidents =
    submission.integrityIncidents || [];

  const violationCount =
    incidents.filter(
      (incident) =>
        incident.type ===
          "fullscreen_exit" ||
        incident.type ===
          "page_hidden" ||
        incident.type ===
          "integrity_termination",
    ).length;

  return (
    <Card
      className={`overflow-hidden rounded-3xl ${
        submission.integrityTerminated
          ? "border border-red-300"
          : "border border-slate-200"
      }`}
    >
      <div
        className={`p-6 ${
          submission.integrityTerminated
            ? "bg-red-950 text-white"
            : "bg-slate-950 text-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />

          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
            Integrity review
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Exam integrity incidents
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {violationCount} recorded violation
              {violationCount === 1
                ? ""
                : "s"}
            </p>
          </div>

          {submission.integrityTerminated ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-800">
              <AlertTriangle className="h-4 w-4" />
              Auto-terminated
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Not auto-terminated
            </span>
          )}
        </div>
      </div>

      {submission.integrityTerminated && (
        <div className="border-b border-red-200 bg-red-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-red-600">
            Termination reason
          </p>

          <p className="mt-2 font-bold text-red-950">
            {submission.integrityTerminationReason ||
              "Integrity policy triggered automatic submission."}
          </p>
        </div>
      )}

      <div className="p-6">
        {incidents.length === 0 ? (
          <p className="text-sm text-slate-500">
            No integrity incidents were recorded for this submission.
          </p>
        ) : (
          <div className="space-y-3">
            {incidents.map(
              (incident) => (
                <div
                  key={incident.id}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {incidentLabel(
                        incident,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(
                        incident.occurredAt,
                      )}
                      {incident.questionNumber
                        ? ` · Question ${incident.questionNumber}`
                        : ""}
                    </p>

                    {incident.detail && (
                      <p className="mt-2 text-sm text-slate-700">
                        {incident.detail}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Integrity events are contextual evidence for teacher review. They do
          not prove misconduct and should not be treated as a secure-browser
          guarantee.
        </p>
      </div>
    </Card>
  );
}
