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
      return;
    }

    const studentId = user.uid;
    let cancelled = false;

    void getStudentAdaptiveAnalytics(studentId)
      .then((loaded) => {
        if (cancelled) return;

        setAnalytics(loaded);
        setError("");
      })
      .catch((caughtError) => {
        console.error("Student adaptive analytics error:", caughtError);

        if (cancelled) return;

        setAnalytics(emptyStudentAdaptiveAnalytics);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Assessment analytics could not be loaded.",
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
    analytics: user?.uid ? analytics : emptyStudentAdaptiveAnalytics,
    loading: authLoading || (Boolean(user?.uid) && loading),
    error: user?.uid ? error : "",
  };
}
