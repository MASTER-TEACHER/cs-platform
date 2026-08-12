"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getCurriculumDefinition,
  type CurriculumUnitDefinition,
} from "@/data/curriculum/curriculumMap";
import { topicLibrary } from "@/data/curriculum/topics";
import type { Topic } from "@/types/curriculum";

function difficultyLabel(difficulty: Topic["difficulty"]): string {
  if (difficulty === "⭐⭐⭐") {
    return "Advanced";
  }

  if (difficulty === "⭐⭐☆") {
    return "Intermediate";
  }

  return "Foundation";
}

function qualificationLabel(qualification: "GCSE" | "A_LEVEL"): string {
  return qualification === "A_LEVEL" ? "A-level" : "GCSE";
}

export default function LearnPage() {
  const router = useRouter();

  const { user, profile, loading, profileReady, profileError } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (
      !loading &&
      profileReady &&
      profile?.role === "student" &&
      (!profile.onboardingComplete ||
        !profile.qualification ||
        !profile.examBoard)
    ) {
      router.replace("/onboarding");
    }
  }, [loading, user, profileReady, profile, router]);

  const curriculum = useMemo(() => {
    if (!profile || profile.qualification === "" || profile.examBoard === "") {
      return undefined;
    }

    return getCurriculumDefinition(profile.qualification, profile.examBoard);
  }, [profile]);

  const availableTopicIds = useMemo(() => {
    if (!curriculum) {
      return [];
    }

    return Array.from(
      new Set(
        curriculum.units.flatMap(
          (unit: CurriculumUnitDefinition) => unit.topicIds,
        ),
      ),
    );
  }, [curriculum]);

  const availableTopics = useMemo(() => {
    return availableTopicIds
      .map((topicId) => topicLibrary[topicId])
      .filter((topic): topic is Topic => Boolean(topic));
  }, [availableTopicIds]);

  if (loading || (user && !profileReady && !profileError)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 font-bold text-slate-700">
            Loading your curriculum...
          </p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Your curriculum could not be loaded
        </h1>

        <p className="mt-3 text-red-800">{profileError}</p>
      </section>
    );
  }

  if (!profile || !profile.qualification || !profile.examBoard || !curriculum) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Curriculum selection required
        </h1>

        <p className="mt-3 text-amber-800">
          Select your qualification and exam board before accessing lessons.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-6 inline-flex rounded-xl bg-amber-600 px-6 py-3 font-black text-white hover:bg-amber-700"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  const levelLabel = qualificationLabel(profile.qualification);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">
              {profile.examBoard} {levelLabel} curriculum
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-950">
              {curriculum.title}
            </h1>

            <p className="mt-3 max-w-3xl text-slate-600">
              Work through the units and topics assigned to your selected
              qualification and exam board.
            </p>
          </div>

          <Link
            href="/profile/curriculum"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Change curriculum
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <div className="rounded-xl bg-indigo-50 px-4 py-3">
            <p className="text-xs font-bold uppercase text-indigo-600">Units</p>

            <p className="mt-1 text-2xl font-black text-indigo-950">
              {curriculum.units.length}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-3">
            <p className="text-xs font-bold uppercase text-blue-600">
              Topics available
            </p>

            <p className="mt-1 text-2xl font-black text-blue-950">
              {availableTopics.length}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-xs font-bold uppercase text-emerald-600">
              Interactive lessons
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-950">
              {availableTopics.reduce(
                (total, topic) => total + topic.lessons.length,
                0,
              )}
            </p>
          </div>
        </div>
      </section>

      {curriculum.units.map((unit, unitIndex) => {
        const unitTopics = unit.topicIds
          .map((topicId) => topicLibrary[topicId])
          .filter((topic): topic is Topic => Boolean(topic));

        return (
          <section
            key={unit.id}
            className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Unit {unitIndex + 1}
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {unit.title}
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                {unit.description}
              </p>
            </div>

            {unitTopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
                Lessons for this unit are being prepared.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {unitTopics.map((topic) => {
                  const firstLesson = topic.lessons[0];

                  const topicHref = firstLesson
                    ? `/learn/${topic.id}?lesson=${firstLesson.id}`
                    : "";

                  return (
                    <article
                      key={`${unit.id}-${topic.id}`}
                      className="flex min-h-[370px] flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                            {profile.examBoard} {levelLabel}
                          </p>

                          <h3 className="mt-2 text-2xl font-black text-slate-950">
                            {topic.title}
                          </h3>
                        </div>

                        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-blue-700">
                          {levelLabel}
                        </span>
                      </div>

                      <p className="mt-4 leading-7 text-slate-600">
                        {topic.description}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase text-slate-500">
                            Lessons
                          </p>

                          <p className="mt-1 text-xl font-black text-slate-950">
                            {topic.lessons.length}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase text-slate-500">
                            Estimated time
                          </p>

                          <p className="mt-1 font-black text-slate-950">
                            {topic.estimatedTime}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="font-bold text-slate-600">
                          {topic.difficulty}
                        </span>

                        <span className="font-bold text-slate-600">
                          {difficultyLabel(topic.difficulty)}
                        </span>
                      </div>

                      <div className="mt-auto pt-7">
                        {firstLesson ? (
                          <Link
                            href={topicHref}
                            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700"
                          >
                            Start learning →
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-6 py-4 font-black text-slate-500"
                          >
                            Lessons coming soon
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
