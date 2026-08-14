"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";

import ClassAnalyticsDashboard from "@/components/teacher/analytics/ClassAnalyticsDashboard";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import type {
  TeacherAnalyticsPortfolio,
  TeacherClassAnalytics,
} from "@/types/teacherAnalytics";

export default function TeacherAnalyticsPage() {
  const { user, profile, loading: authLoading } = useAuth();

  const [portfolio, setPortfolio] =
    useState<TeacherAnalyticsPortfolio | null>(null);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading) return;

      if (!user?.uid || (profile?.role !== "teacher" && profile?.role !== "admin")) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getTeacherAnalyticsPortfolio(user.uid);

        if (!cancelled) {
          setPortfolio(result);

          setSelectedClassId((current) => {
            if (
              current &&
              result.classes.some((classItem) => classItem.classId === current)
            ) {
              return current;
            }

            return result.classes[0]?.classId || "";
          });
        }
      } catch (caughtError) {
        console.error("Unable to load teacher analytics:", caughtError);

        if (!cancelled) {
          setPortfolio(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Teacher analytics could not be loaded.",
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
  }, [authLoading, profile?.role, user?.uid, refreshKey]);

  const selectedClass = useMemo<TeacherClassAnalytics | null>(() => {
    return (
      portfolio?.classes.find(
        (classItem) => classItem.classId === selectedClassId,
      ) || null
    );
  }, [portfolio, selectedClassId]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Teacher analytics unavailable
        </h1>
        <p className="mt-3 text-red-700">{error}</p>
      </Card>
    );
  }

  if (!portfolio || portfolio.classes.length === 0) {
    return (
      <Card className="rounded-3xl p-8">
        <h1 className="text-2xl font-black text-slate-950">
          No classes available
        </h1>
        <p className="mt-3 text-slate-600">
          Create a class and enrol students before using teacher analytics.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-7 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white/80">
                Teacher intelligence
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-black">
              Class Analytics
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/85">
              Track working grades, target gaps, marks to the next grade,
              mastery, trends, evidence quality and intervention priorities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-teal-800 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh analytics
          </button>
        </div>
      </section>

      <Card className="rounded-3xl border border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-slate-900">
              Select class
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {portfolio.classCount} classes · {portfolio.uniqueStudentCount} unique students
            </p>
          </div>

          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="min-h-11 min-w-[280px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          >
            {portfolio.classes.map((classItem) => (
              <option key={classItem.classId} value={classItem.classId}>
                {classItem.className} · {classItem.yearGroup}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedClass && (
        <ClassAnalyticsDashboard
          analytics={selectedClass}
          teacherId={user?.uid || ""}
          onRefresh={() => setRefreshKey((value) => value + 1)}
        />
      )}
    </div>
  );
}
