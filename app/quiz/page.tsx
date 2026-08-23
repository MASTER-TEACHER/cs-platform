"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import QuizPlayer from "@/components/quiz/QuizPlayer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

import { useAuth } from "@/contexts/AuthContext";

import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";

import {
  getCurriculumQuizByTopic,
  getCurriculumQuizzes,
  getCurriculumTopicsWithoutQuizzes,
} from "@/data/quizzes/quizRegistry";

import { db } from "@/lib/firebase";

import type { Quiz } from "@/types/quiz";
import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

type SavedQuizQuestion = {
  id?: string;
  type?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  xpReward?: number;
};

function normaliseLookupValue(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/*
 * Query strings may contain either:
 *
 *   /quiz?topic=binary
 *
 * or a human-readable adaptive-learning topic:
 *
 *   /quiz?topic=Binary%20Numbers
 *
 * Resolve both forms through the canonical curriculum registry.
 */
function resolveCurriculumTopicId(
  value: string,
): string | null {
  const cleaned =
    normaliseLookupValue(value);

  if (!cleaned) {
    return null;
  }

  const match =
    curriculumRegistry.find(
      (topic) => {
        const searchable = [
          topic.id,
          topic.title,
          ...(topic.aliases || []),
        ].map(
          normaliseLookupValue,
        );

        return searchable.includes(
          cleaned,
        );
      },
    );

  return match?.id || null;
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const {
    profile,
    loading: authLoading,
    profileReady,
  } = useAuth();

  const topicParam =
    searchParams.get("topic");

  const assignmentId =
    searchParams.get(
      "assignment",
    );

  const [
    selectedQuizId,
    setSelectedQuizId,
  ] = useState<
    string | null
  >(null);

  const [
    generatedQuiz,
    setGeneratedQuiz,
  ] = useState<Quiz | null>(
    null,
  );

  const [
    loadingGeneratedQuiz,
    setLoadingGeneratedQuiz,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const qualification =
    profile?.qualification as
      | Qualification
      | undefined;

  const examBoard =
    profile?.examBoard as
      | ExamBoard
      | undefined;

  /*
   * The visible Quiz Centre is now derived from the
   * student's selected curriculum.
   */
  const curriculumQuizzes =
    useMemo(() => {
      if (
        !qualification ||
        !examBoard
      ) {
        return [];
      }

      return getCurriculumQuizzes(
        qualification,
        examBoard,
      );
    }, [
      qualification,
      examBoard,
    ]);

  /*
   * Useful while we are still authoring the full quiz bank.
   * This lets the UI communicate that the curriculum may
   * contain topics whose quizzes have not yet been published.
   */
  const unpublishedQuizTopics =
    useMemo(() => {
      if (
        !qualification ||
        !examBoard
      ) {
        return [];
      }

      return getCurriculumTopicsWithoutQuizzes(
        qualification,
        examBoard,
      );
    }, [
      qualification,
      examBoard,
    ]);

  const builtInQuiz =
  selectedQuizId &&
  qualification &&
  examBoard
    ? getCurriculumQuizByTopic(
        selectedQuizId,
        qualification,
        examBoard,
      )
    : null;

  const selectedQuiz =
    generatedQuiz ||
    builtInQuiz;

  useEffect(() => {
    if (
      authLoading ||
      !profileReady
    ) {
      return;
    }

    if (!topicParam) {
      setGeneratedQuiz(null);
      setSelectedQuizId(
        null,
      );
      setLoadError("");
      return;
    }

    /*
     * ----------------------------------------------------------
     * BUILT-IN CURRICULUM QUIZ
     * ----------------------------------------------------------
     *
     * Resolve both canonical topic IDs and human-readable topic
     * names/aliases.
     */
    const resolvedTopicId =
      resolveCurriculumTopicId(
        topicParam,
      );

    if (
      resolvedTopicId &&
      qualification &&
      examBoard
    ) {
      const curriculumQuiz =
        getCurriculumQuizByTopic(
          resolvedTopicId,
          qualification,
          examBoard,
        );

      if (curriculumQuiz) {
        setSelectedQuizId(
          resolvedTopicId,
        );

        setGeneratedQuiz(
          null,
        );

        setLoadError("");

        return;
      }
    }

    /*
     * ----------------------------------------------------------
     * GENERATED / TEACHER-ASSIGNED QUIZ
     * ----------------------------------------------------------
     *
     * A generated quiz does not have to exist in quizLibrary.
     * Its Firestore document ID is supplied through ?topic=.
     *
     * This preserves the existing teacher assignment workflow.
     */
    let cancelled =
      false;

    async function loadGeneratedQuiz() {
      setLoadingGeneratedQuiz(
        true,
      );

      setLoadError("");

      setSelectedQuizId(
        null,
      );

      try {
        const quizSnapshot =
          await getDoc(
            doc(
              db,
              "generatedQuizzes",
              topicParam as string,
            ),
          );

        if (cancelled) {
          return;
        }

        if (
          !quizSnapshot.exists()
        ) {
          setGeneratedQuiz(
            null,
          );

          /*
           * If this looked like a genuine curriculum topic but
           * no built-in quiz exists yet, give the learner a
           * meaningful message rather than pretending a generated
           * quiz should exist.
           */
          if (
            resolvedTopicId
          ) {
            setLoadError(
              "A quiz for this curriculum topic has not been published yet.",
            );
          } else {
            setLoadError(
              "The assigned quiz could not be found.",
            );
          }

          return;
        }

        const data =
          quizSnapshot.data();

        const rawQuestions:
          SavedQuizQuestion[] =
          Array.isArray(
            data.questions,
          )
            ? data.questions
            : [];

        const questions =
          rawQuestions
            .filter(
              (question) =>
                typeof question.question ===
                  "string" &&
                Array.isArray(
                  question.options,
                ) &&
                typeof question.correctAnswer ===
                  "string",
            )
            .map(
              (
                question,
                index,
              ) => ({
                id:
                  question.id ||
                  `${quizSnapshot.id}-question-${index + 1}`,

                type:
                  "multipleChoice" as const,

                question:
                  question.question ||
                  `Question ${index + 1}`,

                options:
                  question.options ||
                  [],

                correctAnswer:
                  question.correctAnswer ||
                  "",

                explanation:
                  question.explanation ||
                  "Review this topic with your teacher.",

                xpReward:
                  typeof question.xpReward ===
                  "number"
                    ? question.xpReward
                    : 10,
              }),
            );

        if (
          questions.length ===
          0
        ) {
          setGeneratedQuiz(
            null,
          );

          setLoadError(
            "This quiz does not contain any valid questions.",
          );

          return;
        }

        const loadedQuiz:
          Quiz = {
          id:
            quizSnapshot.id,

          /*
           * Prefer stored curriculum metadata if the generated
           * quiz has it. Fall back to the document ID for legacy
           * generated quizzes.
           */
          topicId:
            typeof data.topicId ===
              "string" &&
            data.topicId.trim()
              ? data.topicId.trim()
              : quizSnapshot.id,

          title:
            typeof data.title ===
              "string" &&
            data.title.trim()
              ? data.title.trim()
              : "AI Generated Quiz",

          description:
            typeof data.description ===
              "string" &&
            data.description.trim()
              ? data.description.trim()
              : "Complete this quiz assigned by your teacher.",

          estimatedTime:
            typeof data.estimatedTime ===
              "string" &&
            data.estimatedTime.trim()
              ? data.estimatedTime.trim()
              : "10 minutes",

          questions,
        };

        setGeneratedQuiz(
          loadedQuiz,
        );
      } catch (error) {
        console.error(
          "Failed to load generated quiz:",
          error,
        );

        if (!cancelled) {
          setGeneratedQuiz(
            null,
          );

          setLoadError(
            "The assigned quiz could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingGeneratedQuiz(
            false,
          );
        }
      }
    }

    void loadGeneratedQuiz();

    return () => {
      cancelled = true;
    };
  }, [
    topicParam,
    qualification,
    examBoard,
    authLoading,
    profileReady,
  ]);

  function selectBuiltInQuiz(
    topicId: string,
  ) {
    if (
      !qualification ||
      !examBoard
    ) {
      return;
    }

    const quiz =
      getCurriculumQuizByTopic(
        topicId,
        qualification,
        examBoard,
      );

    if (!quiz) {
      setLoadError(
        "This quiz is not available for your selected curriculum.",
      );

      return;
    }

    setSelectedQuizId(
      topicId,
    );

    setGeneratedQuiz(null);

    setLoadError("");

    router.push(
      `/quiz?topic=${encodeURIComponent(
        topicId,
      )}`,
    );
  }

  function returnToQuizLibrary() {
    setSelectedQuizId(
      null,
    );

    setGeneratedQuiz(null);

    setLoadError("");

    router.push("/quiz");
  }

  /*
   * ------------------------------------------------------------
   * AUTH / CURRICULUM LOADING
   * ------------------------------------------------------------
   */
  if (
    authLoading ||
    !profileReady
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-36 w-full" />

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  if (
    !qualification ||
    !examBoard
  ) {
    return (
      <Card>
        <p className="text-sm font-bold uppercase tracking-wide text-amber-600">
          Curriculum required
        </p>

        <h1 className="mt-3 text-2xl font-black text-slate-950">
          Complete your curriculum setup
        </h1>

        <p className="mt-3 text-slate-600">
          Choose your qualification and exam board before using the Quiz
          Centre.
        </p>

        <div className="mt-6">
          <Button
            onClick={() =>
              router.push(
                "/onboarding",
              )
            }
          >
            Complete setup
          </Button>
        </div>
      </Card>
    );
  }

  if (
    loadingGeneratedQuiz
  ) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-48" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Card>
        <div className="text-5xl">
          ⚠️
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Quiz unavailable
        </h1>

        <p className="mt-3 text-slate-600">
          {loadError}
        </p>

        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={
              returnToQuizLibrary
            }
          >
            ← Back to quizzes
          </Button>
        </div>
      </Card>
    );
  }

  /*
   * ------------------------------------------------------------
   * ACTIVE QUIZ
   * ------------------------------------------------------------
   */
  if (selectedQuiz) {
    return (
      <div className="space-y-8">
        {!assignmentId && (
          <Button
            variant="secondary"
            onClick={
              returnToQuizLibrary
            }
          >
            ← Back to quizzes
          </Button>
        )}

        {assignmentId && (
          <Card className="border border-blue-200 bg-blue-50">
            <p className="font-semibold text-blue-800">
              📋 You are completing an assigned quiz.
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Your result will be recorded in your teacher&apos;s markbook.
            </p>
          </Card>
        )}

        <QuizPlayer
          quiz={selectedQuiz}
        />
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * CURRICULUM-AWARE QUIZ CENTRE
   * ------------------------------------------------------------
   */
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">
              Quiz Centre
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Choose a quiz
            </h1>

            <p className="mt-2 max-w-3xl text-blue-100">
              Test your knowledge, review your answers and build exam
              confidence using quizzes matched to your curriculum.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">
              Your curriculum
            </p>

            <p className="mt-1 text-lg font-black">
              {examBoard} ·{" "}
              {qualification ===
              "A_LEVEL"
                ? "A Level"
                : "GCSE"}
            </p>
          </div>
        </div>
      </Card>

      {curriculumQuizzes.length ===
      0 ? (
        <Card>
          <h2 className="text-2xl font-black text-slate-950">
            Quizzes are being prepared
          </h2>

          <p className="mt-3 text-slate-600">
            Your curriculum is recognised, but no built-in quizzes have been
            published for it yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {curriculumQuizzes.map(
            ({
              quiz,
              topicId,
              unitTitle,
            }) => (
              <Card
                key={quiz.id}
                className="flex h-full flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-600">
                      {unitTitle}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {quiz.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {quiz.questions.length} Q
                  </span>
                </div>

                <p className="mt-3 flex-1 text-slate-600">
                  {quiz.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  ⏱{" "}
                  {quiz.estimatedTime}
                  {" · "}
                  {
                    quiz.questions
                      .length
                  }{" "}
                  questions
                </p>

                <div className="mt-6">
                  <Button
                    onClick={() =>
                      selectBuiltInQuiz(
                        topicId,
                      )
                    }
                  >
                    Start Quiz →
                  </Button>
                </div>
              </Card>
            ),
          )}
        </div>
      )}

      {unpublishedQuizTopics.length >
        0 && (
        <Card className="border border-slate-200 bg-slate-50">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Curriculum coverage
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-950">
            More quizzes are coming
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your curriculum contains{" "}
            {
              unpublishedQuizTopics.length
            }{" "}
            additional topic
            {unpublishedQuizTopics.length ===
            1
              ? ""
              : "s"}{" "}
            whose built-in quizzes have not yet been published.
          </p>
        </Card>
      )}
    </div>
  );
}