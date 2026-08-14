"use client";

import { useEffect, useState } from "react";

import RichAnalyticsOverview from "@/components/analytics/RichAnalyticsOverview";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getRichStudentAnalytics } from "@/services/analytics/richStudentAnalyticsService";
import type { RichStudentAnalytics } from "@/types/analytics";

export default function AnalyticsPage() {
  const {
    user,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const [analytics, setAnalytics] =
    useState<RichStudentAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading || !profileReady) {
        return;
      }

      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const loaded =
          await getRichStudentAnalytics(
            user.uid,
          );

        if (!cancelled) {
          setAnalytics(loaded);
        }
      } catch (caughtError) {
        console.error(
          "Unable to load rich student analytics:",
          caughtError,
        );

        if (!cancelled) {
          setAnalytics(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Your analytics could not be loaded.",
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
  }, [
    authLoading,
    profileReady,
    user?.uid,
  ]);

  if (
    authLoading ||
    !profileReady ||
    loading
  ) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-7">
        <h1 className="text-2xl font-black text-red-950">
          Analytics unavailable
        </h1>

        <p className="mt-3 text-red-700">
          {error ||
            "No analytics data is available yet."}
        </p>
      </Card>
    );
  }

  return (
    <RichAnalyticsOverview
      analytics={analytics}
    />
  );
}
