"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherStudentAnalytics } from "@/services/analytics/teacherAnalyticsService";

import StudentActionWorkflowPanel from "@/components/teacher/student/StudentActionWorkflowPanel";
import StudentInterventionHistoryPanel from "@/components/teacher/student/StudentInterventionHistoryPanel";

import type { TeacherStudentAnalyticsRow } from "@/types/teacherAnalytics";

export default function StudentIntelligenceRecord({
  studentId,
}: {
  studentId: string;
}) {
  const { user } = useAuth();

  const [row, setRow] =
    useState<TeacherStudentAnalyticsRow | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.uid || !studentId.trim()) {
        if (!cancelled) {
          setLoading(false);
        }

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
        }
      } catch (caughtError) {
        console.error(
          "Unable to load student intelligence record:",
          caughtError,
        );

        if (!cancelled) {
          setRow(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Student intelligence could not be loaded.",
          );
        }
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
  }, [studentId, user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="rounded-3xl">
          <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
        </Card>

        <Card className="rounded-3xl">
          <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
        </Card>
      </div>
    );
  }

  if (error || !row || !user?.uid) {
    return error ? (
      <Card className="border border-amber-200 bg-amber-50">
        <p className="font-black text-amber-950">
          Intelligence actions unavailable
        </p>
        <p className="mt-2 text-sm text-amber-800">
          {error}
        </p>
      </Card>
    ) : null;
  }

  return (
    <div className="space-y-6">
      <StudentActionWorkflowPanel row={row} />

      <StudentInterventionHistoryPanel
        teacherId={user.uid}
        studentId={studentId}
      />
    </div>
  );
}
