"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";

import type { SimulatorType } from "@/types/curriculum";

type VisualiserEntry = {
  key: string;
  simulator: SimulatorType;
  title: string;
  topicTitle: string;
  lessonTitle: string;
  href: string;
};

function simulatorTitle(
  simulator: SimulatorType,
): string {
  return simulator
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export default function VisualisersPage() {
  const { profile } = useAuth();

  const coverage = useMemo(() => {
    if (
      !profile?.qualification ||
      !profile.examBoard
    ) {
      return null;
    }

    return getCurriculumCoverage(
      profile.qualification,
      profile.examBoard,
    );
  }, [
    profile?.qualification,
    profile?.examBoard,
  ]);

  const entries =
    useMemo<VisualiserEntry[]>(() => {
      if (!coverage) {
        return [];
      }

      const seen =
        new Set<string>();

      const result:
        VisualiserEntry[] = [];

      for (
        const unitCoverage of
        coverage.units
      ) {
        for (
          const topic of
          unitCoverage.topics
        ) {
          const firstLesson =
            topic.lessons[0];

          if (
            topic.simulator &&
            firstLesson
          ) {
            const key =
              `${topic.id}:${topic.simulator}:${firstLesson.id}`;

            if (!seen.has(key)) {
              seen.add(key);

              result.push({
                key,
                simulator:
                  topic.simulator,
                title:
                  simulatorTitle(
                    topic.simulator,
                  ),
                topicTitle:
                  topic.title,
                lessonTitle:
                  firstLesson.title,
                href:
                  `/learn/${topic.id}?lesson=${firstLesson.id}`,
              });
            }
          }

          for (
            const lesson of
            topic.lessons
          ) {
            if (!lesson.simulator) {
              continue;
            }

            const key =
              `${topic.id}:${lesson.simulator}:${lesson.id}`;

            if (seen.has(key)) {
              continue;
            }

            seen.add(key);

            result.push({
              key,
              simulator:
                lesson.simulator,
              title:
                simulatorTitle(
                  lesson.simulator,
                ),
              topicTitle:
                topic.title,
              lessonTitle:
                lesson.title,
              href:
                `/learn/${topic.id}?lesson=${lesson.id}`,
            });
          }
        }
      }

      return result.sort(
        (a, b) =>
          a.topicTitle.localeCompare(
            b.topicTitle,
          ) ||
          a.lessonTitle.localeCompare(
            b.lessonTitle,
          ),
      );
    }, [coverage]);

  if (!coverage) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-3xl font-black text-amber-950">
          Curriculum required
        </h1>

        <p className="mt-3 text-amber-800">
          Choose your qualification and exam board before opening interactive
          visualisers.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-6 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-black text-white hover:bg-amber-700"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 p-8 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
          Interactive learning labs
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black">
              Visualisers & Simulators
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-white/75">
              Explore the interactive tools published for your current
              curriculum. Each tool opens inside the lesson that teaches the
              concept, so your activity remains connected to learning progress.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">
              Active curriculum
            </p>

            <p className="mt-1 font-black">
              {profile?.examBoard} ·{" "}
              {profile?.qualification ===
              "A_LEVEL"
                ? "A-level"
                : "GCSE"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(
          (entry) => (
            <article
              key={entry.key}
              className="flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                Interactive lab
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {entry.title}
              </h2>

              <p className="mt-4 font-bold text-slate-700">
                {entry.topicTitle}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {entry.lessonTitle}
              </p>

              <div className="mt-auto pt-6">
                <Link
                  href={entry.href}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700"
                >
                  Open interactive lesson →
                </Link>
              </div>
            </article>
          ),
        )}
      </section>

      {entries.length === 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-black text-slate-950">
            No interactive labs are mapped yet
          </h2>

          <p className="mt-3 text-slate-600">
            Continue through Learn while interactive tools are mapped to this
            curriculum.
          </p>

          <Link
            href="/learn"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700"
          >
            Go to Learn
          </Link>
        </section>
      )}
    </div>
  );
}
