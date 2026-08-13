"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getTeacherExamQuestionSets,
  type SavedExamQuestionSet,
} from "@/services/examQuestionService";
import type { AssignmentWizardResource } from "@/types/assignmentWizard";

type Props = {
  selectedResource: AssignmentWizardResource | null;
  onSelect: (resource: AssignmentWizardResource) => void;
};

function cleanLabel(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchText(questionSet: SavedExamQuestionSet): string {
  const content = questionSet.content;

  return [
    questionSet.id,
    questionSet.title,
    content.title,
    content.description,
    content.topic,
    content.qualification,
    content.examBoard,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function ExamPaperAssignmentSelector({
  selectedResource,
  onSelect,
}: Props) {
  const { user } = useAuth();

  const [questionSets, setQuestionSets] =
    useState<SavedExamQuestionSet[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuestionSets() {
      if (!user?.uid) {
        if (!cancelled) {
          setQuestionSets([]);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const loaded =
          await getTeacherExamQuestionSets(
            user.uid,
          );

        if (cancelled) return;

        setQuestionSets(
          [...loaded].sort((a, b) =>
            a.title.localeCompare(
              b.title,
            ),
          ),
        );
      } catch (caughtError) {
        console.error(
          "Unable to load saved exam papers:",
          caughtError,
        );

        if (!cancelled) {
          setQuestionSets([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "The Question Bank could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuestionSets();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const filtered = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) {
      return questionSets;
    }

    return questionSets.filter(
      (questionSet) =>
        searchText(
          questionSet,
        ).includes(term),
    );
  }, [questionSets, search]);

  return (
    <section className="mt-8 rounded-3xl border border-indigo-200 bg-indigo-50/50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">
        Question Bank
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Choose the exact exam paper
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Select a saved exam-style question set.
        CS Master will preserve the exact
        questions, marks, mark scheme and model
        answers in the class assignment.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full max-w-xl">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
            Search Question Bank
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Paper, topic, exam board..."
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <a
          href="/teacher/question-bank"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
        >
          Open Question Bank
        </a>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="font-bold text-slate-900">
            No saved exam papers found
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Save an exam-style paper to the Question
            Bank first, then return here.
          </p>

          <a
            href="/teacher/exam-question-generator"
            className="mt-4 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Generate Exam Paper
          </a>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map(
            (questionSet) => {
              const content =
                questionSet.content;

              const selected =
                selectedResource?.resourceType ===
                  "exam-paper" &&
                selectedResource.resourceId ===
                  questionSet.id;

              return (
                <button
                  key={questionSet.id}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: questionSet.id,
                      title:
                        questionSet.title ||
                        content.title,
                      description:
                        content.description ||
                        `Written assessment on ${content.topic}.`,
                      resourceType:
                        "exam-paper",
                      resourceId:
                        questionSet.id,
                      examTopic:
                        content.topic,
                      examQualification:
                        content.qualification,
                      examBoard:
                        content.examBoard,
                      questionCount:
                        content.questionCount,
                      totalMarks:
                        content.totalMarks,
                    })
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-indigo-600 bg-white ring-2 ring-indigo-100"
                      : "border-indigo-100 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">
                        {content.examBoard} ·{" "}
                        {cleanLabel(
                          content.qualification,
                        )}
                      </p>

                      <h4 className="mt-2 text-lg font-black text-slate-950">
                        {questionSet.title ||
                          content.title}
                      </h4>

                      <p className="mt-2 text-sm font-semibold text-indigo-700">
                        {content.topic}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {
                          content.description
                        }
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-black ${
                        selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {
                        content.questionCount
                      }{" "}
                      questions
                    </span>

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                      {content.totalMarks} marks
                    </span>
                  </div>
                </button>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}
