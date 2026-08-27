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
      return;
    }

    const teacherId = user.uid;
    let cancelled = false;

    void getTeacherDashboardData(teacherId)
      .then((dashboardData) => {
        if (cancelled) return;

        setData(dashboardData);
        setError("");
      })
      .catch((caughtError) => {
        console.error("Teacher dashboard load error:", caughtError);

        if (cancelled) return;

        setData(emptyTeacherDashboardData);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The teacher dashboard could not be loaded.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  return {
    ...(user?.uid ? data : emptyTeacherDashboardData),
    loading: authLoading || (Boolean(user?.uid) && loading),
    error: user?.uid ? error : "",
  };
}
