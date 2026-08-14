"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardLearning from "@/components/dashboard/DashboardLearning";
import DashboardQuiz from "@/components/dashboard/DashboardQuiz";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import AssessmentInsights from "@/components/dashboard/AssessmentInsights";
import AdaptiveLearningCard from "@/components/dashboard/AdaptiveLearningCard";
import StudentAnalyticsSnapshot from "@/components/dashboard/StudentAnalyticsSnapshot";

import { useAuth } from "@/contexts/AuthContext";
import { useRecentQuiz } from "@/hooks/useRecentQuiz";
import { useStudentAdaptiveAnalytics } from "@/hooks/useStudentAdaptiveAnalytics";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";

import { getDailyMission } from "@/lib/missionEngine";
import { getTotalLessonCount } from "@/lib/curriculumProgress";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  const {
    quiz: recentQuiz,
    loading: recentQuizLoading,
  } = useRecentQuiz();

  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
  } = useStudentAdaptiveAnalytics();

  const {
    plan: adaptivePlan,
    loading: adaptiveLoading,
  } = useAdaptiveLearning();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profileReady || !profile) {
      return;
    }

    if (
      profile.role === "teacher" ||
      profile.role === "admin"
    ) {
      router.replace("/teacher");
      return;
    }

    const curriculumComplete =
      profile.onboardingComplete === true &&
      Boolean(profile.qualification) &&
      Boolean(profile.examBoard);

    if (!curriculumComplete) {
      router.replace("/onboarding");
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    router,
  ]);

  if (
    loading ||
    (user &&
      !profileReady &&
      !profileError)
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-72 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Your dashboard could not be loaded
        </h1>

        <p className="mt-3 text-red-800">
          {profileError}
        </p>
      </section>
    );
  }

  if (
    !profile ||
    profile.role !== "student" ||
    !profile.onboardingComplete ||
    !profile.qualification ||
    !profile.examBoard
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 font-bold text-slate-700">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const name =
    profile.name || "Student";

  const xp =
    profile.xp || 0;

  const streak =
    profile.streak || 0;

  const badges =
    profile.badges || [];

  const completedLessons =
    profile.completedLessons || [];

  const totalLessons =
    getTotalLessonCount();

  const mission =
    getDailyMission(
      completedLessons,
    );

  return (
    <div className="space-y-8">
      <DashboardHero
        name={name}
        xp={xp}
        streak={streak}
        badges={badges.length}
      />

      <DashboardStats
        xp={xp}
        completedLessons={
          completedLessons.length
        }
        streak={streak}
        badges={badges.length}
      />

      {/* NEW RICH ATTAINMENT ANALYTICS */}
      <StudentAnalyticsSnapshot />

      <AdaptiveLearningCard
        plan={adaptivePlan}
        loading={adaptiveLoading}
      />

      <AssessmentInsights
        analytics={analytics}
        loading={analyticsLoading}
        error={analyticsError}
      />

      <DashboardLearning
        mission={mission}
        completedLessons={
          completedLessons
        }
        totalLessons={totalLessons}
      />

      <DashboardQuiz
        recentQuiz={recentQuiz}
        recentQuizLoading={
          recentQuizLoading
        }
        unlockedBadges={badges}
        xp={xp}
        completedLessons={
          completedLessons
        }
      />

      <DashboardActivity
        unlockedBadges={badges}
        xp={xp}
        completedLessons={
          completedLessons
        }
      />
    </div>
  );
}