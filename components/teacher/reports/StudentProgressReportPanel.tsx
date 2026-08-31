"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  AlertTriangle,
  Download,
  FileText,
  Printer,
  Target,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  buildStudentProgressReport,
} from "@/services/reporting/studentProgressReportService";

import {
  studentReportToCsv,
} from "@/services/reporting/reportCsvService";

import type {
  StudentProgressReport,
} from "@/types/reporting";

import type {
  TeacherStudentAnalyticsRow,
} from "@/types/teacherAnalytics";

export default function StudentProgressReportPanel({
  teacherId,
  studentId,
  selectedClassId,
  selectedClassName,
  classContext,
}: {
  teacherId: string;
  studentId: string;
  selectedClassId?: string;
  selectedClassName?: string;
  classContext?:
    TeacherStudentAnalyticsRow | null;
}) {
  const [
    report,
    setReport,
  ] =
    useState<StudentProgressReport | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        setReport(null);

        const next =
          await buildStudentProgressReport({
            teacherId,
            studentId,
            classId:
              selectedClassId,
          });

        if (cancelled) {
          return;
        }

        if (!next) {
          setReport(null);

          setError(
            selectedClassId
              ? "This learner could not be found in the selected reporting class."
              : "Student report could not be generated.",
          );

          return;
        }

        /*
         * Do not display a report generated from a different
         * class context.
         */
        if (
          selectedClassId &&
          next.classId !==
            selectedClassId
        ) {
          setReport(null);

          setError(
            "The generated report does not match the selected reporting class. Refresh the reporting workspace and try again.",
          );

          return;
        }

        setReport(next);
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setReport(null);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Student report could not be generated.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    teacherId,
    studentId,
    selectedClassId,
  ]);

  if (loading) {
    return (
      <Card>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    );
  }

  if (
    error ||
    !report
  ) {
    return error ? (
      <Card className="border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-black">
          Student report unavailable
        </p>

        <p className="mt-2 text-sm leading-6">
          {error}
        </p>
      </Card>
    ) : null;
  }

  const effectiveClassName =
    report.className?.trim() ||
    selectedClassName?.trim() ||
    "student";

  const effectiveClassId =
    report.classId?.trim() ||
    selectedClassId?.trim() ||
    "";

  function exportCsv() {
    const blob =
      new Blob(
        [
          studentReportToCsv(
            report!,
          ),
        ],
        {
          type:
            "text/csv;charset=utf-8",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const anchor =
      document.createElement(
        "a",
      );

    anchor.href = url;

    anchor.download =
      `${report!.studentName
        .replace(
          /[^a-z0-9]+/gi,
          "-",
        )
        .toLowerCase()}-${effectiveClassName
        .replace(
          /[^a-z0-9]+/gi,
          "-",
        )
        .toLowerCase()}-progress-intelligence.csv`;

    document.body.appendChild(
      anchor,
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(
      url,
    );
  }

  function printReport() {
    document.body.classList.add(
      "cs-report-printing",
    );

    const cleanup = () => {
      document.body.classList.remove(
        "cs-report-printing",
      );

      window.removeEventListener(
        "afterprint",
        cleanup,
      );
    };

    window.addEventListener(
      "afterprint",
      cleanup,
    );

    window.print();
  }

  const strengths =
    report.strengths.filter(
      (item) =>
        item.mastery >= 70,
    );

  const priorities =
    report.priorities.filter(
      (item) =>
        item.mastery < 70,
    );

  const workingGrade =
    report.workingGrade ||
    classContext?.workingGrade ||
    "—";

  const targetGrade =
    report.targetGrade ||
    classContext?.targetGrade ||
    "Not set";

  const completionRate =
    report.completionRate;

  return (
    <>
      <style>{`
        @media print {
          body.cs-report-printing * {
            visibility: hidden !important;
          }

          body.cs-report-printing [data-cs-report-print-root="true"],
          body.cs-report-printing [data-cs-report-print-root="true"] * {
            visibility: visible !important;
          }

          body.cs-report-printing [data-cs-report-print-root="true"] {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            background: white !important;
          }

          body.cs-report-printing [data-cs-report-print-hidden="true"] {
            display: none !important;
          }
        }
      `}</style>

      <div data-cs-report-print-root="true">
        <Card className="overflow-hidden rounded-3xl border border-slate-200 p-0">
          <div className="flex flex-col gap-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">
                Student progress report
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {report.studentName}
              </h2>

              <p className="mt-2 text-sm text-white/70">
                {effectiveClassName}
              </p>

              <p className="mt-1 text-xs text-white/50">
                Generated{" "}
                {report.generatedAt.toLocaleString(
                  "en-GB",
                )}
              </p>
            </div>

            <div
              data-cs-report-print-hidden="true"
              className="flex flex-wrap gap-2"
            >
              <button
                type="button"
                onClick={
                  printReport
                }
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-black text-white"
              >
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </button>

              <button
                type="button"
                onClick={
                  exportCsv
                }
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-violet-950"
              >
                <Download className="h-4 w-4" />
                Export intelligence CSV
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-6">
            <Metric
              label="Working grade"
              value={
                workingGrade
              }
            />

            <Metric
              label="Target grade"
              value={
                targetGrade
              }
            />

            <Metric
              label="Working %"
              value={
                report.workingPercentage ===
                null
                  ? "—"
                  : `${report.workingPercentage}%`
              }
            />

            <Metric
              label="Next grade"
              value={
                report.nextGrade ||
                "—"
              }
            />

            <Metric
              label="Marks to next"
              value={
                report.marksToNextGrade ===
                null
                  ? "—"
                  : String(
                      report.marksToNextGrade,
                    )
              }
            />

            <Metric
              label="Completion"
              value={`${completionRate}%`}
            />
          </div>

          <div className="mx-6 mb-6 grid gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <SmallMetric
              label="Reporting class"
              value={
                effectiveClassName
              }
            />

            <SmallMetric
              label="Trend"
              value={
                report.trend ||
                "—"
              }
            />

            <SmallMetric
              label="Priority"
              value={
                String(
                  classContext?.interventionPriority ??
                    "none",
                )
              }
            />

            <SmallMetric
              label="Evidence confidence"
              value={
                String(
                  report.confidence,
                )
              }
            />
          </div>

          {report.evidenceWarnings.length >
            0 && (
            <div className="mx-6 mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 font-black text-amber-950">
                <AlertTriangle className="h-4 w-4" />
                Evidence quality
              </p>

              <div className="mt-3 space-y-2">
                {report.evidenceWarnings.map(
                  (
                    warning,
                  ) => (
                    <p
                      key={
                        warning
                      }
                      className="text-sm leading-6 text-amber-900"
                    >
                      {
                        warning
                      }
                    </p>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
            <ReportList
              title="Secure / strongest areas"
              icon={
                <TrendingUp className="h-4 w-4" />
              }
              items={strengths.map(
                (item) =>
                  `${item.topic} — ${item.mastery}% mastery`,
              )}
            />

            <ReportList
              title="Priority / developing areas"
              icon={
                <Target className="h-4 w-4" />
              }
              items={priorities.map(
                (item) =>
                  `${item.topic} — ${item.mastery}% mastery`,
              )}
            />
          </div>

          <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black text-slate-900">
                Evidence sources
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Confidence:{" "}
                {String(
                  report.confidence,
                )}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                <SmallMetric
                  label="Exams"
                  value={
                    report.evidenceSourceCounts.written_exam
                  }
                />

                <SmallMetric
                  label="Quizzes"
                  value={
                    report.evidenceSourceCounts.quiz
                  }
                />

                <SmallMetric
                  label="AI quiz"
                  value={
                    report.evidenceSourceCounts.ai_quiz
                  }
                />

                <SmallMetric
                  label="Programming"
                  value={
                    report.evidenceSourceCounts.programming
                  }
                />

                <SmallMetric
                  label="Lessons"
                  value={
                    report.evidenceSourceCounts.lesson
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black text-slate-900">
                Intervention history
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <SmallMetric
                  label="Active"
                  value={
                    report.interventionSummary.active
                  }
                />

                <SmallMetric
                  label="Completed"
                  value={
                    report.interventionSummary.completed
                  }
                />

                <SmallMetric
                  label="Cancelled"
                  value={
                    report.interventionSummary.cancelled
                  }
                />
              </div>

              <Link
                data-cs-report-print-hidden="true"
                href={`/teacher/interventions?studentId=${encodeURIComponent(
                  studentId,
                )}&studentName=${encodeURIComponent(
                  report.studentName,
                )}&className=${encodeURIComponent(
                  effectiveClassName,
                )}`}
                className="mt-4 inline-flex rounded-xl bg-violet-700 px-4 py-2 text-xs font-black text-white"
              >
                Open interventions
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 p-6">
            <p className="font-black text-slate-900">
              Recent graded evidence
            </p>

            {report.recentEvidence.length ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {report.recentEvidence.map(
                  (
                    item,
                    index,
                  ) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {
                            item.title
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.completedAt
                            ? item.completedAt.toLocaleDateString(
                                "en-GB",
                              )
                            : "Date unavailable"}
                        </p>
                      </div>

                      <p className="text-xl font-black text-slate-950">
                        {item.percentage ===
                        null
                          ? "—"
                          : `${item.percentage}%`}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No recent graded evidence available.
              </p>
            )}
          </div>

          <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
            <ReportList
              title="Teacher commentary"
              icon={
                <FileText className="h-4 w-4" />
              }
              items={
                report.teacherCommentary
              }
            />

            <ReportList
              title="Student next steps"
              icon={
                <Target className="h-4 w-4" />
              }
              items={
                report.studentNextSteps
              }
            />
          </div>

          <div
            data-cs-report-print-hidden="true"
            className="flex flex-wrap gap-3 border-t border-slate-100 p-6"
          >
            <Link
              href={`/teacher/analytics/${studentId}`}
              className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
            >
              Open student intelligence
            </Link>

            {effectiveClassId ? (
              <Link
                href={`/teacher/classes/${effectiveClassId}`}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800"
              >
                Open class
              </Link>
            ) : null}
          </div>
        </Card>
      </div>
    </>
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

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value:
    | number
    | string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black capitalize text-slate-950">
        {value}
      </p>
    </div>
  );
}

function ReportList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center gap-2">
        {icon}

        <p className="font-black text-slate-900">
          {title}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map(
            (
              item,
            ) => (
              <p
                key={
                  item
                }
                className="rounded-xl bg-white px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {item}
              </p>
            ),
          )
        ) : (
          <p className="text-sm text-slate-500">
            No report items available yet.
          </p>
        )}
      </div>
    </div>
  );
}
