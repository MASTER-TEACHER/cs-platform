"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  emptyTeacherDashboardData,
  getTeacherDashboardData,
  type TeacherDashboardData,
} from "@/services/teacherDashboardService";

export type {
  RecentTeacherActivity,
  AtRiskStudent,
  TopStudent,
  TopicPerformance,
  TeacherDashboardData,
} from "@/services/teacherDashboardService";

export function useTeacherDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<TeacherDashboardData>(
    emptyTeacherDashboardData,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.uid) {
      setData(emptyTeacherDashboardData);

      setError("");
      setLoading(false);

      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const dashboardData = await getTeacherDashboardData(user!.uid);

        if (cancelled) {
          return;
        }

        setData(dashboardData);
      } catch (caughtError) {
        console.error("Teacher dashboard load error:", caughtError);

        if (cancelled) {
          return;
        }

        setData(emptyTeacherDashboardData);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The teacher dashboard could not be loaded.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.uid]);

  return {
    ...data,
    loading: authLoading || loading,
    error,
  };
}
