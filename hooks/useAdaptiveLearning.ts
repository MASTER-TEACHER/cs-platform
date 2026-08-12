"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import type { AdaptiveLearningPlan } from "@/types/adaptiveLearning";

export function useAdaptiveLearning() {
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<AdaptiveLearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    if (!user?.uid) {
      setPlan(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      setPlan(await getAdaptiveLearningPlan(user.uid));
    } catch (caughtError) {
      console.error("Adaptive learning error:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The adaptive learning plan could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) void refresh();
  }, [authLoading, user?.uid]);

  return {
    plan,
    loading: authLoading || loading,
    error,
    refresh,
  };
}
