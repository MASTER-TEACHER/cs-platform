"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
} from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardLearning from "@/components/dashboard/DashboardLearning";
import DashboardQuiz from "@/components/dashboard/DashboardQuiz";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import AdaptiveLearningCard from "@/components/dashboard/AdaptiveLearningCard";
import StudentAnalyticsSnapshot from "@/components/dashboard/StudentAnalyticsSnapshot";

import { useAuth } from "@/contexts/AuthContext";
import { useRecentQuiz } from "@/hooks/useRecentQuiz";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { buildStudentJourney } from "@/services/studentJourneyService";
import {
  getIndividualSubscription,
} from "@/services/billingClientService";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  const [
    individualPremiumActive,
    setIndividualPremiumActive,
  ] = useState<boolean | null>(
    null,
  );

  const {
    quiz: recentQuiz,
    loading: recentQuizLoading,
  } = useRecentQuiz();

  const {
    plan: adaptivePlan,
    loading: adaptiveLoading,
  } = useAdaptiveLearning();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profileReady || !profile) return;

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

  useEffect(() => {
    let cancelled = false;

    if (
  !user ||
  !profileReady ||
  profile?.role !== "student" ||
  profile.schoolId
) {
  return;
}

    void getIndividualSubscription()
      .then((subscription) => {
        if (!cancelled) {
          setIndividualPremiumActive(
            subscription.active,
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIndividualPremiumActive(
            null,
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    user,
    profileReady,
    profile?.role,
    profile?.schoolId,
  ]);

  if (
    loading ||
    (user && !profileReady && !profileError)
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
    profile.name ||
    "Student";

  const xp =
    profile.xp ||
    0;

  const streak =
    profile.streak ||
    0;

  const badges =
    profile.badges ||
    [];

  const completedLessons =
    profile.completedLessons ||
    [];

  const isIndividualStudent =
    !profile.schoolId;

  const showPremiumUpgrade =
    isIndividualStudent &&
    individualPremiumActive ===
      false;

  const journey = buildStudentJourney({
    qualification:
      profile.qualification,
    examBoard:
      profile.examBoard,
    completedLessons,
  });

  if (!journey) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Your curriculum could not be resolved
        </h1>

        <p className="mt-3 text-amber-800">
          Your account has a curriculum selection, but CS Master
          could not map it to an available course.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/profile/curriculum",
            )
          }
          className="mt-6 rounded-xl bg-amber-600 px-6 py-3 font-black text-white hover:bg-amber-700"
        >
          Review curriculum selection
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHero
        name={name}
        xp={xp}
        streak={streak}
        badges={badges.length}
        curriculum={`${journey.examBoard} ${
          journey.qualification ===
          "A_LEVEL"
            ? "A-level"
            : "GCSE"
        }`}
      />

      {showPremiumUpgrade && (
        <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-950 via-blue-900 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-300" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                  CS Master Premium
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Unlock the complete student experience
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                Keep your core learning access free, or upgrade for
                Adaptive Learning, AI Tutor, Exam Mode, Programming,
                Knowledge Map, Revision Planning and detailed analytics.
              </p>
            </div>

            <Link
              href="/upgrade"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-300"
            >
              View Premium plans
            </Link>
          </div>
        </section>
      )}

      <DashboardStats
        xp={xp}
        completedLessons={
          journey.completedLessonCount
        }
        streak={streak}
        badges={badges.length}
      />

      <StudentAnalyticsSnapshot />

      <AdaptiveLearningCard
        plan={adaptivePlan}
        loading={
          adaptiveLoading
        }
      />

      <DashboardLearning
        mission={
          journey.mission
        }
        completedLessons={
          journey.completedLessonCount
        }
        totalLessons={
          journey.totalLessonCount
        }
        progressPercentage={
          journey.progressPercentage
        }
        curriculumTitle={
          journey.curriculumTitle
        }
      />

      <DashboardQuiz
        recentQuiz={
          recentQuiz
        }
        recentQuizLoading={
          recentQuizLoading
        }
        unlockedBadges={
          badges
        }
        xp={xp}
        completedLessons={
          completedLessons
        }
      />

      <DashboardActivity
        unlockedBadges={
          badges
        }
        xp={xp}
        completedLessons={
          completedLessons
        }
        mission={
          journey.mission
        }
        recentQuiz={
          recentQuiz
        }
      />
    </div>
  );
}