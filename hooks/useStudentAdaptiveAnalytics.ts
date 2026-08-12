"use client";

import { useEffect, useState } from "react";

import {
  emptyStudentAdaptiveAnalytics,
  getStudentAdaptiveAnalytics,
  type StudentAdaptiveAnalytics,
} from "@/services/studentAdaptiveAnalyticsService";
import { useAuth } from "@/contexts/AuthContext";

export function useStudentAdaptiveAnalytics() {
  const { user, loading: authLoading } = useAuth();

  const [analytics, setAnalytics] = useState<StudentAdaptiveAnalytics>(
    emptyStudentAdaptiveAnalytics,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.uid) {
      setAnalytics(emptyStudentAdaptiveAnalytics);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const loaded = await getStudentAdaptiveAnalytics(user!.uid);

        if (!cancelled) {
          setAnalytics(loaded);
        }
      } catch (caughtError) {
        console.error("Student adaptive analytics error:", caughtError);

        if (!cancelled) {
          setAnalytics(emptyStudentAdaptiveAnalytics);

          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Assessment analytics could not be loaded.",
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
  }, [authLoading, user?.uid]);

  return {
    analytics,
    loading: authLoading || loading,
    error,
  };
}
