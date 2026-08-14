"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import type { TeacherAnalyticsPortfolio } from "@/types/teacherAnalytics";

export function useTeacherIntelligence() {
  const { user, profile, loading: authLoading } = useAuth();

  const [portfolio, setPortfolio] =
    useState<TeacherAnalyticsPortfolio | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (
      !user?.uid ||
      (profile?.role !== "teacher" && profile?.role !== "admin")
    ) {
      setPortfolio(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getTeacherAnalyticsPortfolio(user.uid);

      setPortfolio(result);
    } catch (caughtError) {
      console.error("Unable to load teacher intelligence:", caughtError);

      setPortfolio(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Teacher intelligence could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [profile?.role, user?.uid]);

  useEffect(() => {
    if (authLoading) return;

    void refresh();
  }, [authLoading, refresh]);

  return {
    portfolio,
    loading: authLoading || loading,
    error,
    refresh,
  };
}
