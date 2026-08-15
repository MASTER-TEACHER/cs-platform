"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Download,
  ShieldAlert,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { buildExamClassIntelligence } from "@/services/analytics/examIntelligenceService";
import { downloadExamQuestionLevelAnalysisCsv } from "@/services/reporting/examQuestionLevelAnalysisCsvService";
import type {
  ExamAssignment,
  ExamSubmission,
} from "@/types/examAssignment";

function percentage(value: number | null): string {
  return value === null ? "—" : `${value}%`;
}

function priorityClass(
  value: "high" | "medium" | "monitor" | "none",
): string {
  if (value === "high") {
    return "bg-red-100 text-red-700";
  }

  if (value === "medium") {
    return "bg-amber-100 text-amber-700";
  }

  if (value === "monitor") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

export default function ExamAssignmentIntelligencePanel({
  assignment,
  submissions,
}: {
  assignment: ExamAssignment;
  submissions: ExamSubmission[];
}) {
  const intelligence =
    buildExamClassIntelligence(
      assignment,
      submissions,
    );

  const priorityStudents =
    intelligence.studentPriorities.filter(
      (student) =>
        student.priority !== "none",
    );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-6 text-white">
          <div className="flex items-center gap-2 text-violet-200">
            <BarChart3 className="h-5 w-5" />

            <p className="text-xs font-black uppercase tracking-[0.16em]">
              Exam intelligence
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black">
            Class performance and integrity overview
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/70">
            Use marked evidence to identify difficult questions, weak curriculum
            areas and students requiring follow-up. Integrity events are contextual
            evidence for teacher review and do not by themselves prove misconduct.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-6">
          <Metric
            label="Submission"
            value={`${intelligence.submissionPercentage}%`}
          />

          <Metric
            label="Marking"
            value={`${intelligence.markingPercentage}%`}
          />

          <Metric
            label="Class average"
            value={percentage(
              intelligence.classAverage,
            )}
          />

          <Metric
            label="Highest"
            value={percentage(
              intelligence.highestPercentage,
            )}
          />

          <Metric
            label="Lowest"
            value={percentage(
              intelligence.lowestPercentage,
            )}
          />

          <Metric
            label="Integrity events"
            value={String(
              intelligence.integrity
                .totalIncidents,
            )}
          />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              <TrendingDown className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-red-600">
                Reteaching priority
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Weakest assessed area
              </h3>
            </div>
          </div>

          {intelligence.weakestTopic ? (
            <div className="mt-5 rounded-2xl bg-red-50 p-5">
              <p className="text-lg font-black text-red-950">
                {
                  intelligence.weakestTopic
                    .topic
                }
              </p>

              <p className="mt-2 text-sm text-red-800">
                Average success:{" "}
                {percentage(
                  intelligence.weakestTopic
                    .averageSuccessPercentage,
                )}
              </p>

              <p className="mt-1 text-sm text-red-800">
                {
                  intelligence.weakestTopic
                    .questionCount
                }{" "}
                question
                {intelligence.weakestTopic
                  .questionCount === 1
                  ? ""
                  : "s"}{" "}
                ·{" "}
                {
                  intelligence.weakestTopic
                    .availableMarks
                }{" "}
                available marks
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Marked evidence is required before a reteaching priority can be identified.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/teacher/knowledge-map"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white"
            >
              Class Knowledge Map
              <ChevronRight className="h-4 w-4" />
            </Link>

            <Link
              href="/teacher/assignment-wizard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700"
            >
              Assign follow-up work
            </Link>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
                Strength
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Strongest assessed area
              </h3>
            </div>
          </div>

          {intelligence.strongestTopic ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
              <p className="text-lg font-black text-emerald-950">
                {
                  intelligence.strongestTopic
                    .topic
                }
              </p>

              <p className="mt-2 text-sm text-emerald-800">
                Average success:{" "}
                {percentage(
                  intelligence.strongestTopic
                    .averageSuccessPercentage,
                )}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Marked evidence is required before a strength can be identified.
            </p>
          )}
        </Card>
      </div>

      <Card className="rounded-3xl border border-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
              Question-level analysis
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-950">
              Which questions caused difficulty?
            </h3>

            {intelligence.hardestQuestion && (
              <p className="mt-2 text-sm font-bold text-slate-500">
                Hardest: Q
                {
                  intelligence.hardestQuestion
                    .questionNumber
                }{" "}
                ·{" "}
                {percentage(
                  intelligence.hardestQuestion
                    .successPercentage,
                )}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              downloadExamQuestionLevelAnalysisCsv({
                assignment,
                intelligence,
              })
            }
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Download QLA CSV
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="p-4">Question</th>
                <th className="p-4">Topic</th>
                <th className="p-4">Avg marks</th>
                <th className="p-4">Success</th>
                <th className="p-4">Attempted</th>
                <th className="p-4">Zero marks</th>
                <th className="p-4">Interpretation</th>
              </tr>
            </thead>

            <tbody>
              {intelligence.questionIntelligence.map(
                (question) => (
                  <tr
                    key={question.questionId}
                    className="border-b border-slate-100"
                  >
                    <td className="p-4 font-black text-slate-950">
                      Q{question.questionNumber}{" "}
                      <span className="font-normal text-slate-400">
                        / {question.availableMarks}
                      </span>
                    </td>

                    <td className="p-4 text-sm font-bold text-slate-700">
                      {question.topic}
                    </td>

                    <td className="p-4 text-sm font-bold text-slate-700">
                      {question.averageAwardedMarks ===
                      null
                        ? "—"
                        : `${question.averageAwardedMarks}/${question.availableMarks}`}
                    </td>

                    <td className="p-4 font-black text-slate-900">
                      {percentage(
                        question.successPercentage,
                      )}
                    </td>

                    <td className="p-4 text-sm text-slate-700">
                      {question.attemptedStudents}/
                      {question.markedStudents}
                    </td>

                    <td className="p-4 text-sm text-slate-700">
                      {question.zeroMarkStudents}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
                          question.difficulty ===
                          "priority"
                            ? "bg-red-100 text-red-700"
                            : question.difficulty ===
                                "developing"
                              ? "bg-amber-100 text-amber-700"
                              : question.difficulty ===
                                  "secure"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-violet-600">
                Integrity intelligence
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Context for teacher review
              </h3>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniMetric
              label="Clean submissions"
              value={
                intelligence.integrity
                  .cleanSubmissionCount
              }
            />

            <MiniMetric
              label="With incidents"
              value={
                intelligence.integrity
                  .submissionsWithIncidents
              }
            />

            <MiniMetric
              label="Auto-terminated"
              value={
                intelligence.integrity
                  .integrityTerminatedCount
              }
            />

            <MiniMetric
              label="Total incidents"
              value={
                intelligence.integrity
                  .totalIncidents
              }
            />
          </div>

          <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-950">
            Integrity events should be reviewed alongside the student's submission,
            device/browser context and teacher judgement. They are not automatically
            evidence of cheating.
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-amber-600">
                Student priorities
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Review next
              </h3>
            </div>
          </div>

          {priorityStudents.length === 0 ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
              <CheckCircle2 className="h-5 w-5" />

              <p className="font-bold">
                No marked or integrity evidence currently meets the review thresholds.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {priorityStudents
                .slice(0, 8)
                .map((student) => (
                  <div
                    key={student.studentId}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">
                            {student.studentName}
                          </p>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black capitalize ${priorityClass(
                              student.priority,
                            )}`}
                          >
                            {student.priority}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {student.percentage ===
                          null
                            ? "Result not yet marked"
                            : `${student.percentage}%`}
                          {" · "}
                          {
                            student.integrityIncidentCount
                          }{" "}
                          integrity event
                          {student.integrityIncidentCount ===
                          1
                            ? ""
                            : "s"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/teacher/exam-assignments/${assignment.id}/submissions/${student.studentId}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-black text-white"
                        >
                          Submission
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/teacher/analytics/${student.studentId}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700"
                        >
                          Analytics
                        </Link>
                      </div>
                    </div>

                    {student.reasons.length >
                      0 && (
                      <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
                        {student.reasons.map(
                          (reason) => (
                            <li
                              key={reason}
                              className="flex items-start gap-2"
                            >
                              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                              {reason}
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
