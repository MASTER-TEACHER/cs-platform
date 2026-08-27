"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";

export default function CurriculumLessonGate({
  topicId,
  children,
}: {
  topicId: string;
  children: ReactNode;
}) {
  const {
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  if (
    loading ||
    (!profileReady &&
      !profileError)
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-bold text-slate-600">
          Checking your curriculum...
        </p>
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Curriculum check unavailable
        </h1>

        <p className="mt-3 text-red-800">
          {profileError}
        </p>
      </section>
    );
  }

  /*
   * Teacher/admin users may preview curriculum content.
   * Student access is restricted to the qualification and
   * exam board stored in the student profile.
   */
  if (
    profile?.role !== "student"
  ) {
    return <>{children}</>;
  }

  if (
    !profile.qualification ||
    !profile.examBoard
  ) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Curriculum selection required
        </h1>

        <p className="mt-3 text-amber-800">
          Select your qualification and exam board before opening lessons.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-6 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-black text-white"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  const coverage =
    getCurriculumCoverage(
      profile.qualification,
      profile.examBoard,
    );

  const allowed =
    Boolean(coverage) &&
    coverage!.units.some(
      (unit) =>
        unit.topics.some(
          (topic) =>
            topic.id === topicId,
        ),
    );

  if (!allowed) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-sm font-black uppercase tracking-wide text-amber-700">
          Curriculum restricted
        </p>

        <h1 className="mt-2 text-2xl font-black text-amber-950">
          This topic is not mapped to your selected curriculum
        </h1>

        <p className="mt-3 text-amber-800">
          Your current selection is{" "}
          {profile.examBoard}{" "}
          {profile.qualification ===
          "A_LEVEL"
            ? "A-level"
            : "GCSE"}.
        </p>

        <Link
          href="/learn"
          className="mt-6 inline-flex rounded-xl bg-amber-700 px-5 py-3 font-black text-white"
        >
          Back to my curriculum
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}