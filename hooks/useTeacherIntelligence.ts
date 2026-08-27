"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import type { TeacherAnalyticsPortfolio } from "@/types/teacherAnalytics";

export function useTeacherIntelligence() {
  const { user, profile, loading: authLoading } = useAuth();
  const userId = user?.uid;
  const role = profile?.role;

  const [portfolio, setPortfolio] =
    useState<TeacherAnalyticsPortfolio | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (
      !userId ||
      (role !== "teacher" && role !== "admin")
    ) {
      return Promise.resolve().then(() => {
        setPortfolio(null);
        setError("");
        setLoading(false);
      });
    }

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getTeacherAnalyticsPortfolio(userId);
      })
      .then((result) => {
        setPortfolio(result);
      })
      .catch((caughtError: unknown) => {
        const firebaseCode =
          typeof caughtError === "object" &&
          caughtError !== null &&
          "code" in caughtError &&
          typeof (caughtError as { code?: unknown }).code === "string"
            ? (caughtError as { code: string }).code
            : "";

        setPortfolio(null);

        if (
          firebaseCode === "permission-denied" ||
          firebaseCode === "firestore/permission-denied"
        ) {
          setError(
            "Teacher intelligence is unavailable for this account.",
          );
        } else {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Teacher intelligence could not be loaded.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [role, userId]);

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
