"use client";

import { useMemo, useState } from "react";

import { quizLibrary } from "@/data/quizzes/index";
import type { AssignmentWizardResource } from "@/types/assignmentWizard";
import type { Quiz } from "@/types/quiz";

type Props = {
  selectedResource: AssignmentWizardResource | null;
  onSelect: (resource: AssignmentWizardResource) => void;
};

function normalise(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
}

function quizSearchText(quiz: Quiz): string {
  return [quiz.id, quiz.topicId, quiz.title, quiz.description, quiz.estimatedTime]
    .join(" ")
    .toLowerCase();
}

export default function ExistingQuizSelector({
  selectedResource,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const quizzes = useMemo(
    () =>
      Object.values(quizLibrary).sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    [],
  );

  const filteredQuizzes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quizzes;
    return quizzes.filter((quiz) => quizSearchText(quiz).includes(term));
  }, [quizzes, search]);

  return (
    <section className="mt-8 rounded-3xl border border-violet-200 bg-violet-50/50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
        Existing quiz library
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Choose the exact quiz
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Students will receive this exact CS Master quiz. Their real quiz score,
        percentage and XP will be recorded when they submit it.
      </p>

      <label className="mt-5 block max-w-xl">
        <span className="text-xs font-black uppercase tracking-wide text-slate-500">
          Search quizzes
        </span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Quiz title or topic..."
          className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      {filteredQuizzes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          No existing quizzes match this search.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredQuizzes.map((quiz) => {
            const selected =
              selectedResource?.resourceType === "quiz" &&
              selectedResource.resourceId === quiz.topicId;

            return (
              <button
                key={quiz.id}
                type="button"
                onClick={() =>
                  onSelect({
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    resourceType: "quiz",
                    resourceId: quiz.topicId,
                    quizTopicId: quiz.topicId,
                    questionCount: quiz.questions.length,
                    estimatedTime: quiz.estimatedTime,
                  })
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-violet-600 bg-white ring-2 ring-violet-100"
                    : "border-violet-100 bg-white hover:border-violet-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                      {normalise(quiz.topicId)}
                    </p>
                    <h4 className="mt-2 text-lg font-black text-slate-950">
                      {quiz.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {quiz.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-black ${
                      selected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    {quiz.questions.length} questions
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {quiz.estimatedTime}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
