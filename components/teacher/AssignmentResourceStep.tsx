"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

import type {
  AssignmentResourceType,
  AssignmentWizardResource,
} from "@/types/assignmentWizard";

type AssignmentResourceStepProps = {
  selectedResource: AssignmentWizardResource | null;
  onSelect: (resource: AssignmentWizardResource) => void;
  onNext: () => void;
};

type SavedQuizOption = {
  id: string;
  title: string;
  description: string;
  qualification: string;
  examBoard: string;
  difficulty: string;
  questionCount: number;
};

const resourceOptions: Array<{
  type: AssignmentResourceType;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    type: "lesson",
    title: "Existing Lesson",
    description:
      "Assign one of the learning resources already in CS Master.",
    icon: "📚",
  },
  {
    type: "quiz",
    title: "Existing Quiz",
    description:
      "Assign one of the standard quizzes already available.",
    icon: "📝",
  },
  {
    type: "ai-quiz",
    title: "AI Quiz",
    description:
      "Choose a saved quiz from your AI quiz library.",
    icon: "🤖",
  },
  {
    type: "exam-paper",
    title: "Exam Paper",
    description:
      "Assign an exam-style assessment or practice paper.",
    icon: "📄",
  },
];

function createPlaceholderResource(
  type: AssignmentResourceType,
  title: string,
  description: string
): AssignmentWizardResource {
  return {
    id: type,
    title,
    description,
    resourceType: type,
    resourceId: type,
  };
}

export default function AssignmentResourceStep({
  selectedResource,
  onSelect,
  onNext,
}: AssignmentResourceStepProps) {
  const { user, loading: authLoading } = useAuth();

  const [selectedType, setSelectedType] =
    useState<AssignmentResourceType | null>(
      selectedResource?.resourceType || null
    );

  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizOption[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [quizLoadError, setQuizLoadError] = useState("");

  useEffect(() => {
    setSelectedType(selectedResource?.resourceType || null);
  }, [selectedResource]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setSavedQuizzes([]);
      setLoadingQuizzes(false);
      return;
    }

    const quizzesQuery = query(
      collection(db, "generatedQuizzes"),
      where("teacherId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      quizzesQuery,
      (snapshot) => {
        const loadedQuizzes: SavedQuizOption[] = snapshot.docs.map(
          (quizDocument) => {
            const data = quizDocument.data();

            return {
              id: quizDocument.id,
              title: data.title || "Untitled Quiz",
              description:
                data.description || "Complete the assigned quiz.",
              qualification: data.qualification || "GCSE",
              examBoard: data.examBoard || "AQA",
              difficulty: data.difficulty || "standard",
              questionCount:
                typeof data.questionCount === "number"
                  ? data.questionCount
                  : Array.isArray(data.questions)
                    ? data.questions.length
                    : 0,
            };
          }
        );

        loadedQuizzes.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

        setSavedQuizzes(loadedQuizzes);
        setQuizLoadError("");
        setLoadingQuizzes(false);
      },
      (error) => {
        console.error("Failed to load saved quizzes:", error);
        setSavedQuizzes([]);
        setQuizLoadError("Could not load your saved quizzes.");
        setLoadingQuizzes(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  function chooseResourceType(option: {
    type: AssignmentResourceType;
    title: string;
    description: string;
  }) {
    setSelectedType(option.type);

    if (option.type === "ai-quiz") {
      if (selectedResource?.resourceType !== "ai-quiz") {
        onSelect(
          createPlaceholderResource(
            "ai-quiz",
            "Choose an AI Quiz",
            "Select a saved quiz from the list below."
          )
        );
      }

      return;
    }

    onSelect(
      createPlaceholderResource(
        option.type,
        option.title,
        option.description
      )
    );
  }

  function chooseSavedQuiz(quiz: SavedQuizOption) {
    setSelectedType("ai-quiz");

    onSelect({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      resourceType: "ai-quiz",
      resourceId: quiz.id,
    });
  }

  const validResourceSelected =
    selectedResource !== null &&
    !(
      selectedResource.resourceType === "ai-quiz" &&
      selectedResource.resourceId === "ai-quiz"
    );

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Step 1 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Choose Assignment Type
      </h2>

      <p className="mt-2 text-slate-600">
        Select the type of resource you want to assign.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {resourceOptions.map((option) => {
          const selected = selectedType === option.type;

          return (
            <button
              key={option.type}
              type="button"
              onClick={() => chooseResourceType(option)}
              className={`rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
                  : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50"
              }`}
            >
              <div className="text-4xl">{option.icon}</div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {option.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedType === "ai-quiz" && (
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            AI Quiz Library
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Choose a Saved Quiz
          </h3>

          {loadingQuizzes ? (
            <div className="mt-6 space-y-3">
              <div className="h-28 animate-pulse rounded-xl bg-white" />
              <div className="h-28 animate-pulse rounded-xl bg-white" />
            </div>
          ) : quizLoadError ? (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
              {quizLoadError}
            </div>
          ) : savedQuizzes.length === 0 ? (
            <div className="mt-6 rounded-xl bg-white p-6 text-center">
              <div className="text-4xl">🤖</div>

              <h4 className="mt-3 text-lg font-bold text-slate-900">
                No saved AI quizzes
              </h4>

              <p className="mt-2 text-sm text-slate-600">
                Generate and save a quiz before assigning it.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {savedQuizzes.map((quiz) => {
                const selected =
                  selectedResource?.resourceType === "ai-quiz" &&
                  selectedResource.resourceId === quiz.id;

                return (
                  <button
                    key={quiz.id}
                    type="button"
                    onClick={() => chooseSavedQuiz(quiz)}
                    className={`rounded-xl border p-5 text-left transition ${
                      selected
                        ? "border-indigo-500 bg-white ring-2 ring-indigo-100"
                        : "border-indigo-100 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {quiz.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {quiz.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-bold ${
                          selected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
                        {quiz.qualification}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                        {quiz.examBoard}
                      </span>

                      <span className="rounded-full bg-amber-50 px-3 py-1 capitalize text-amber-700">
                        {quiz.difficulty}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {quiz.questionCount} questions
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedResource && validResourceSelected && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">
            Selected resource
          </p>

          <p className="mt-1 font-bold text-slate-900">
            {selectedResource.title}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!validResourceSelected}
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </Card>
  );
}