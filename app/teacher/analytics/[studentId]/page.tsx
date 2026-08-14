"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Target,
} from "lucide-react";

import RichAnalyticsOverview from "@/components/analytics/RichAnalyticsOverview";
import TargetGradeControl from "@/components/teacher/analytics/TargetGradeControl";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherStudentAnalytics } from "@/services/analytics/teacherAnalyticsService";
import type { TeacherStudentAnalyticsRow } from "@/types/teacherAnalytics";
import StudentIntelligenceRecord from "@/components/teacher/student/StudentIntelligenceRecord";

export default function TeacherStudentAnalyticsPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const { user, profile, loading: authLoading } = useAuth();

  const [row, setRow] =
    useState<TeacherStudentAnalyticsRow | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading) return;

      if (
        !user?.uid ||
        (profile?.role !== "teacher" && profile?.role !== "admin")
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getTeacherStudentAnalytics({
          teacherId: user.uid,
          studentId,
        });

        if (!cancelled) {
          setRow(result);

          if (!result) {
            setError(
              "This student is not enrolled in one of your classes or analytics data is unavailable.",
            );
          }
        }
      } catch (caughtError) {
        console.error("Unable to load student analytics:", caughtError);

        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Student analytics could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    profile?.role,
    studentId,
    user?.uid,
    refreshKey,
  ]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error || !row) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Student analytics unavailable
        </h1>
        <p className="mt-3 text-red-700">{error}</p>
        <Link
          href="/teacher/analytics"
          className="mt-5 inline-flex items-center gap-2 font-black text-red-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class analytics
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-7 text-white">
        <Link
          href="/teacher/analytics"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Class analytics
        </Link>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-200">
              Student analytics
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {row.studentName}
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {row.className} · {row.studentEmail}
            </p>
          </div>
<StudentIntelligenceRecord studentId={studentId} />
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-sm font-black">
              <Target className="h-4 w-4" />
              Target grade
            </div>

            <TargetGradeControl
              studentId={row.studentId}
              classId={row.classId}
              teacherId={user?.uid || ""}
              qualification={row.qualification}
              value={row.targetGrade}
              onSaved={() => setRefreshKey((value) => value + 1)}
            />
          </div>
        </div>
      </section>

      {row.interventionPriority !== "none" && (
        <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
            <div>
              <h2 className="font-black capitalize text-amber-950">
                {row.interventionPriority} intervention priority
              </h2>

              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {row.interventionReasons.map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>

              <Link
                href="/teacher/interventions"
                className="mt-4 inline-flex font-black text-amber-900 underline"
              >
                Open Interventions
              </Link>
            </div>
          </div>
        </Card>
      )}

      <RichAnalyticsOverview analytics={row.analytics} />
    </div>
  );
}
