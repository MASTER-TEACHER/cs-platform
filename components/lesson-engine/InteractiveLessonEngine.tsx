"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import LessonAudioPlayer from "@/components/audio/LessonAudioPlayer";
import CompleteLessonButton from "@/components/lesson/CompleteLessonButton";
import SimulatorRenderer from "@/components/lesson/SimulatorRenderer";
import LessonExamQuestionStep from "@/components/lesson-engine/LessonExamQuestionStep";
import LessonPracticeStep from "@/components/lesson-engine/LessonPracticeStep";
import LessonProgressHeader from "@/components/lesson-engine/LessonProgressHeader";
import LessonStepNavigation from "@/components/lesson-engine/LessonStepNavigation";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { buildInteractiveLesson } from "@/services/interactiveLessonService";
import {
  calculateLessonMasteryImpact,
  calculateLessonReviewDate,
  calculateOverallLessonAccuracy,
  calculateResponseAccuracy,
  createLessonProgressId,
  getLessonProgress,
  saveLessonProgress,
} from "@/services/lessonProgressService";
import type { Lesson, SimulatorType } from "@/types/curriculum";
import type { InteractiveLessonProgress } from "@/types/interactiveLesson";

type Props = {
  topicId: string;
  lesson: Lesson;
  nextLessonId?: string;
  topicSimulator?: SimulatorType;
};

export default function InteractiveLessonEngine({
  topicId,
  lesson,
  nextLessonId,
  topicSimulator,
}: Props) {
  const { user } = useAuth();

  const definition = useMemo(
    () =>
      buildInteractiveLesson(topicId, {
        ...lesson,
        simulator: lesson.simulator ?? topicSimulator,
      }),
    [lesson, topicId, topicSimulator],
  );

  const [progress, setProgress] = useState<InteractiveLessonProgress | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const audioSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const existingProgress = await getLessonProgress(user.uid, lesson.id);

        if (cancelled) {
          return;
        }

        const initialProgress: InteractiveLessonProgress = existingProgress ?? {
          id: createLessonProgressId(user.uid, lesson.id),
          studentId: user.uid,
          lessonId: lesson.id,
          topicId,

          currentStepIndex: 0,
          completedStepIds: [],

          practiceResponses: [],
          checkpointResponses: [],

          examResponse: "",
          examMarking: null,
          reflection: "",

          audioEnabled: false,
          audioRate: 1,
          selectedVoiceName: "",

          practiceAccuracy: 0,
          checkpointAccuracy: 0,
          examAccuracy: 0,
          overallAccuracy: 0,
          masteryImpact: 0,
          reviewAt: null,

          status: "in_progress",

          startedAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
        };

        setProgress(initialProgress);
      } catch (error) {
        console.error("Lesson progress load error:", error);

        toast.error("Your saved lesson progress could not be loaded.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      cancelled = true;

      if (audioSaveTimer.current) {
        clearTimeout(audioSaveTimer.current);
      }
    };
  }, [lesson.id, topicId, user?.uid]);

  async function persistProgress(nextProgress: InteractiveLessonProgress) {
    setProgress(nextProgress);

    if (!user?.uid) {
      return;
    }

    try {
      await saveLessonProgress(nextProgress);
    } catch (error) {
      console.error("Lesson progress save error:", error);

      toast.error("Your lesson progress could not be saved.");
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />;
  }

  if (!user) {
    return (
      <Card>
        <h2 className="text-2xl font-black text-slate-950">Sign in required</h2>

        <p className="mt-3 text-slate-600">
          Please sign in to begin this interactive lesson and save your
          progress.
        </p>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card>
        <h2 className="text-2xl font-black text-slate-950">
          Lesson progress unavailable
        </h2>

        <p className="mt-3 text-slate-600">
          Your lesson progress could not be prepared. Refresh the page and try
          again.
        </p>
      </Card>
    );
  }

  /*
   * A stable non-null reference prevents TypeScript from treating
   * progress as possibly null inside nested functions and callbacks.
   */
  const currentProgress = progress;

  const safeStepIndex = Math.min(
    Math.max(currentProgress.currentStepIndex, 0),
    Math.max(definition.steps.length - 1, 0),
  );

  const currentStep = definition.steps[safeStepIndex];

  if (!currentStep) {
    return (
      <Card>
        <h2 className="text-2xl font-black text-slate-950">
          Lesson step unavailable
        </h2>

        <p className="mt-3 text-slate-600">
          This lesson step could not be loaded. Return to the lesson and try
          again.
        </p>
      </Card>
    );
  }

  const nextLessonHref = nextLessonId
    ? `/learn/${topicId}?lesson=${nextLessonId}`
    : undefined;

  const checkpointQuestions = lesson.checkpointQuestions?.length
    ? lesson.checkpointQuestions
    : lesson.practiceQuestions.slice(
        0,
        Math.min(3, lesson.practiceQuestions.length),
      );

  const practiceCompleted =
    lesson.practiceQuestions.length > 0 &&
    currentProgress.practiceResponses.length ===
      lesson.practiceQuestions.length &&
    currentProgress.practiceResponses.every((response) => response.checked);

  const checkpointCompleted =
    checkpointQuestions.length > 0 &&
    currentProgress.checkpointResponses.length === checkpointQuestions.length &&
    currentProgress.checkpointResponses.every((response) => response.checked);

  const examResponseCompleted =
    Boolean(currentProgress.examResponse.trim()) &&
    Boolean(currentProgress.examMarking);

  const reflectionCompleted = Boolean(currentProgress.reflection.trim());

  const canContinue =
    currentStep.type === "practice"
      ? practiceCompleted
      : currentStep.type === "checkpoint"
        ? checkpointCompleted
        : currentStep.type === "exam-question"
          ? examResponseCompleted
          : currentStep.type === "reflection"
            ? reflectionCompleted
            : true;

  const completeAudioText =
    lesson.audioTranscript ||
    [
      lesson.title,
      lesson.description,
      ...lesson.objectives,
      lesson.explanation,
      lesson.workedExample,
    ]
      .filter(Boolean)
      .join(". ");

  function withCalculatedMetrics(
    nextProgress: InteractiveLessonProgress,
  ): InteractiveLessonProgress {
    const practiceAccuracy = calculateResponseAccuracy(
      nextProgress.practiceResponses,
    );

    const checkpointAccuracy = calculateResponseAccuracy(
      nextProgress.checkpointResponses,
    );

    const examAccuracy = nextProgress.examMarking?.percentage ?? 0;

    const overallAccuracy = calculateOverallLessonAccuracy(
      nextProgress.practiceResponses,
      nextProgress.checkpointResponses,
      examAccuracy,
      Boolean(nextProgress.examMarking),
    );

    return {
      ...nextProgress,
      practiceAccuracy,
      checkpointAccuracy,
      examAccuracy,
      overallAccuracy,
      masteryImpact: calculateLessonMasteryImpact(overallAccuracy),
      reviewAt: calculateLessonReviewDate(overallAccuracy),
    };
  }

  async function goToNextStep() {
    const completedStepIds = Array.from(
      new Set([...currentProgress.completedStepIds, currentStep.id]),
    );

    const nextStepIndex = Math.min(
      safeStepIndex + 1,
      definition.steps.length - 1,
    );

    await persistProgress(
      withCalculatedMetrics({
        ...currentProgress,
        completedStepIds,
        currentStepIndex: nextStepIndex,
        status:
          currentProgress.status === "completed" ? "completed" : "in_progress",
        updatedAt: new Date(),
      }),
    );
  }

  async function goToPreviousStep() {
    const previousStepIndex = Math.max(0, safeStepIndex - 1);

    await persistProgress({
      ...currentProgress,
      currentStepIndex: previousStepIndex,
      updatedAt: new Date(),
    });
  }

  function updateAudioPreferences(preferences: {
    rate: number;
    voiceName: string;
    enabled: boolean;
  }) {
    setProgress((existingProgress) => {
      if (!existingProgress) {
        return existingProgress;
      }

      const preferencesUnchanged =
        existingProgress.audioEnabled === preferences.enabled &&
        existingProgress.audioRate === preferences.rate &&
        existingProgress.selectedVoiceName === preferences.voiceName;

      /*
       * Returning the same object prevents a needless render.
       */
      if (preferencesUnchanged) {
        return existingProgress;
      }

      const nextProgress: InteractiveLessonProgress = {
        ...existingProgress,
        audioEnabled: preferences.enabled,
        audioRate: preferences.rate,
        selectedVoiceName: preferences.voiceName,
        updatedAt: new Date(),
      };

      if (audioSaveTimer.current) {
        clearTimeout(audioSaveTimer.current);
      }

      audioSaveTimer.current = setTimeout(() => {
        void saveLessonProgress(nextProgress).catch((error) => {
          console.error("Audio preference save error:", error);
        });
      }, 500);

      return nextProgress;
    });
  }

  async function updatePracticeResponses(
    responses: InteractiveLessonProgress["practiceResponses"],
  ) {
    await persistProgress(
      withCalculatedMetrics({
        ...currentProgress,
        practiceResponses: responses,
        updatedAt: new Date(),
      }),
    );
  }

  async function updateCheckpointResponses(
    responses: InteractiveLessonProgress["checkpointResponses"],
  ) {
    await persistProgress(
      withCalculatedMetrics({
        ...currentProgress,
        checkpointResponses: responses,
        updatedAt: new Date(),
      }),
    );
  }

  async function updateExamResponse(examResponse: string) {
    await persistProgress(
      withCalculatedMetrics({
        ...currentProgress,
        examResponse,
        examMarking: null,
        updatedAt: new Date(),
      }),
    );
  }

  async function updateExamMarking(
    examMarking: InteractiveLessonProgress["examMarking"],
  ) {
    await persistProgress(
      withCalculatedMetrics({
        ...currentProgress,
        examMarking,
        updatedAt: new Date(),
      }),
    );
  }

  function updateReflectionLocally(reflection: string) {
    setProgress({
      ...currentProgress,
      reflection,
      updatedAt: new Date(),
    });
  }

  async function saveReflection() {
    const latestReflection = progress?.reflection ?? "";

    await persistProgress({
      ...currentProgress,
      reflection: latestReflection,
      updatedAt: new Date(),
    });
  }

  return (
    <div className="space-y-6">
      <LessonProgressHeader
        steps={definition.steps}
        currentStepIndex={safeStepIndex}
      />

      {currentStep.type === "introduction" && (
        <Card className="border-0 bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
            Interactive lesson
          </p>

          <h1 className="mt-2 text-4xl font-black">{lesson.title}</h1>

          <p className="mt-3 max-w-3xl text-blue-100">{lesson.description}</p>

          <p className="mt-5 text-sm font-bold text-blue-100">
            ⏱ {lesson.estimatedTime} · ⭐ {lesson.xpReward} XP
          </p>
        </Card>
      )}

      {currentStep.type === "objectives" && (
        <Card>
          <h2 className="text-2xl font-black">🎯 Learning objectives</h2>

          {lesson.objectives.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {lesson.objectives.map((objective) => (
                <li
                  key={objective}
                  className="rounded-2xl bg-blue-50 p-4 font-bold text-blue-950"
                >
                  {objective}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 italic text-slate-500">
              No separate learning objectives are required for this lesson.
            </p>
          )}
        </Card>
      )}

      {currentStep.type === "explanation" && (
        <Card>
          <h2 className="text-2xl font-black">📖 Explanation</h2>

          <div className="mt-5">
            <LessonAudioPlayer
              text={completeAudioText}
              initialRate={currentProgress.audioRate}
              initialVoiceName={currentProgress.selectedVoiceName}
              onPreferencesChange={updateAudioPreferences}
            />
          </div>

          <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-slate-700">
            {lesson.explanation || "This lesson does not include a separate explanation step."}
          </p>
        </Card>
      )}

      {currentStep.type === "worked-example" && (
        <Card>
          <h2 className="text-2xl font-black">💡 Worked example</h2>

          <div className="mt-5">
            <LessonAudioPlayer
              text={lesson.workedExample}
              title="Listen to the worked example"
              initialRate={currentProgress.audioRate}
              initialVoiceName={currentProgress.selectedVoiceName}
              onPreferencesChange={updateAudioPreferences}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-amber-50 p-5 text-lg leading-8 text-amber-950">
            {lesson.workedExample || "This lesson does not include a separate worked example."}
          </div>
        </Card>
      )}

      {currentStep.type === "simulator" && definition.lesson.simulator && (
        <SimulatorRenderer simulator={definition.lesson.simulator} />
      )}

      {currentStep.type === "practice" && (
        <>
          <Card>
            <h2 className="text-2xl font-black">✍ Guided practice</h2>

            <p className="mt-3 text-slate-600">
              Check every guided-practice answer before continuing.
            </p>
          </Card>

          <LessonPracticeStep
            questions={lesson.practiceQuestions}
            initialResponses={currentProgress.practiceResponses}
            onChange={(responses) => {
              void updatePracticeResponses(responses);
            }}
          />
        </>
      )}

      {currentStep.type === "checkpoint" && (
        <>
          <Card>
            <h2 className="text-2xl font-black">✅ Checkpoint</h2>

            <p className="mt-3 text-slate-600">
              Check every checkpoint answer before continuing.
            </p>
          </Card>

          <LessonPracticeStep
            questions={checkpointQuestions}
            initialResponses={currentProgress.checkpointResponses}
            onChange={(responses) => {
              void updateCheckpointResponses(responses);
            }}
          />
        </>
      )}

      {currentStep.type === "exam-question" && (
        <LessonExamQuestionStep
          topic={lesson.title}
          lessonTitle={lesson.title}
          question={lesson.examQuestion}
          response={currentProgress.examResponse}
          marking={currentProgress.examMarking}
          onChange={(examResponse) => {
            void updateExamResponse(examResponse);
          }}
          onMarked={(examMarking) => {
            void updateExamMarking(examMarking);
          }}
        />
      )}

      {currentStep.type === "reflection" && (
        <Card>
          <h2 className="text-2xl font-black">🧠 Reflection</h2>

          <p className="mt-3 text-slate-600">
            {lesson.reflectionPrompt ||
              "Explain one thing you learned and one thing you still need to practise."}
          </p>

          <textarea
            rows={6}
            value={currentProgress.reflection}
            onChange={(event) => updateReflectionLocally(event.target.value)}
            onBlur={() => {
              void saveReflection();
            }}
            placeholder="Write your reflection..."
            className="mt-5 w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </Card>
      )}

      {currentStep.type === "completion" && (
        <Card className="border border-emerald-200 bg-emerald-50">
          <h2 className="text-3xl font-black text-emerald-950">
            🎉 Lesson complete
          </h2>

          <p className="mt-3 text-emerald-800">
            Save your completed lesson and collect your XP.
          </p>

          <div className="mt-6">
            <CompleteLessonButton
              lessonId={lesson.id}
              topicId={topicId}
              nextLessonId={nextLessonId}
              progress={currentProgress}
              xpReward={lesson.xpReward}
            />
          </div>
        </Card>
      )}

      <LessonStepNavigation
        currentStepIndex={safeStepIndex}
        totalSteps={definition.steps.length}
        canContinue={canContinue}
        nextLessonHref={nextLessonHref}
        onPrevious={() => {
          void goToPreviousStep();
        }}
        onNext={() => {
          void goToNextStep();
        }}
      />
    </div>
  );
}
