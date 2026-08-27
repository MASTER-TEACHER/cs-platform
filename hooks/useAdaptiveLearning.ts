"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import type { AdaptiveLearningPlan } from "@/types/adaptiveLearning";

export function useAdaptiveLearning() {
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<AdaptiveLearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setPlan(null);
        setError("");
        setLoading(false);
      });
    }

    const userId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getAdaptiveLearningPlan(userId);
      })
      .then((loadedPlan) => {
        setPlan(loadedPlan);
      })
      .catch((caughtError) => {
        console.error("Adaptive learning error:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The adaptive learning plan could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!authLoading) void refresh();
  }, [authLoading, refresh]);

  return {
    plan,
    loading: authLoading || loading,
    error,
    refresh,
  };
}
