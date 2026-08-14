"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Target,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import type { TeacherAnalyticsPortfolio } from "@/types/teacherAnalytics";

export default function TeacherAnalyticsSnapshot() {
  const { user, profile } = useAuth();

  const [portfolio, setPortfolio] =
    useState<TeacherAnalyticsPortfolio | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (
        !user?.uid ||
        (profile?.role !== "teacher" && profile?.role !== "admin")
      ) {
        return;
      }

      try {
        const result = await getTeacherAnalyticsPortfolio(user.uid);

        if (!cancelled) setPortfolio(result);
      } catch (error) {
        console.error("Unable to load teacher analytics snapshot:", error);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [profile?.role, user?.uid]);

  const totals = useMemo(() => {
    if (!portfolio) return null;

    const students = portfolio.classes.flatMap((classItem) => classItem.students);

    const targetRows = students.filter(
      (student) => student.targetGrade !== null && student.gradeGap !== null,
    );

    const onTarget = targetRows.filter(
      (student) => (student.gradeGap ?? -99) >= 0,
    ).length;

    return {
      highPriority: students.filter(
        (student) => student.interventionPriority === "high",
      ).length,
      targetsMissing: students.filter(
        (student) => student.targetGrade === null,
      ).length,
      onTargetPercentage:
        targetRows.length > 0
          ? Math.round((onTarget / targetRows.length) * 100)
          : 0,
    };
  }, [portfolio]);

  if (!portfolio || !totals) return null;

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">
                Class intelligence
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Attainment and intervention overview
            </h2>
          </div>

          <Link
            href="/teacher/analytics"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-teal-800 hover:bg-slate-100"
          >
            Open analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Classes"
          value={String(portfolio.classCount)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <Metric
          label="Students"
          value={String(portfolio.uniqueStudentCount)}
          icon={<Users className="h-5 w-5" />}
        />
        <Metric
          label="On / above target"
          value={`${totals.onTargetPercentage}%`}
          icon={<Target className="h-5 w-5" />}
        />
        <Metric
          label="High priority"
          value={String(totals.highPriority)}
          detail={`${totals.targetsMissing} target grades not set`}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {value}
          </p>
          {detail && (
            <p className="mt-1 text-xs text-slate-500">{detail}</p>
          )}
        </div>
        <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
          {icon}
        </div>
      </div>
    </div>
  );
}
