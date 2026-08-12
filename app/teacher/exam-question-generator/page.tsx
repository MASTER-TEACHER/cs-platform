"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { createBalancedBlueprint } from "@/components/teacher/exam-questions/AssessmentBlueprintBuilder";
import ExamQuestionGeneratorForm from "@/components/teacher/exam-questions/ExamQuestionGeneratorForm";
import EditableExamQuestionPreview from "@/components/teacher/exam-questions/EditableExamQuestionPreview";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { saveExamQuestionSet } from "@/services/examQuestionService";
import type {
  AssessmentBlueprintItem,
  ExamQuestionDifficulty,
  ExamQuestionGeneratorSettings,
  GenerateExamQuestionsResponse,
  GeneratedExamQuestionSet,
} from "@/types/examQuestion";

function normaliseDifficulty(value: string | null): ExamQuestionDifficulty {
  if (value === "foundation" || value === "higher") {
    return value;
  }

  return "standard";
}

function createInitialSettings(): ExamQuestionGeneratorSettings {
  return {
    topic: "",
    qualification: "GCSE",
    examBoard: "AQA",
    difficulty: "standard",
    generationMode: "automatic",
    blueprint: createBalancedBlueprint("", "standard"),
  };
}

function createBlueprintFromQuery({
  topic,
  difficulty,
  questionCount,
  totalMarks,
}: {
  topic: string;
  difficulty: ExamQuestionDifficulty;
  questionCount: number;
  totalMarks: number;
}): AssessmentBlueprintItem[] {
  const balanced = createBalancedBlueprint(topic, difficulty);

  const safeCount = Math.min(20, Math.max(1, questionCount));

  const blueprint = Array.from(
    {
      length: safeCount,
    },
    (_, index) => ({
      ...balanced[index % balanced.length],
      id: `query-blueprint-${Date.now()}-${index}`,
      questionNumber: index + 1,
      topicFocus: topic,
    }),
  );

  if (totalMarks > 0) {
    let remaining = Math.min(totalMarks, safeCount * 12);

    blueprint.forEach((item, index) => {
      const questionsLeft = blueprint.length - index;

      const marks = Math.min(
        12,
        Math.max(1, Math.round(remaining / questionsLeft)),
      );

      item.marks = marks;
      remaining -= marks;
    });
  }

  return blueprint;
}

export default function ExamQuestionGeneratorPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [settings, setSettings] = useState<ExamQuestionGeneratorSettings>(
    createInitialSettings,
  );

  const [questionSet, setQuestionSet] =
    useState<GeneratedExamQuestionSet | null>(null);

  const [generating, setGenerating] = useState(false);

  const [saving, setSaving] = useState(false);

  const [savedQuestionSetId, setSavedQuestionSetId] = useState<string | null>(
    null,
  );

  const [useDemo, setUseDemo] = useState(true);

  const totalMarks = useMemo(
    () => settings.blueprint.reduce((sum, item) => sum + item.marks, 0),
    [settings.blueprint],
  );

  useEffect(() => {
    const topic = searchParams.get("topic");

    if (!topic?.trim()) {
      return;
    }

    const difficulty = normaliseDifficulty(searchParams.get("difficulty"));

    const questionCount = Number(searchParams.get("questionCount")) || 4;

    const requestedTotalMarks = Number(searchParams.get("totalMarks")) || 13;

    setSettings({
      topic: topic.trim(),
      qualification: searchParams.get("qualification") || "GCSE",
      examBoard: searchParams.get("examBoard") || "AQA",
      difficulty,
      generationMode: "automatic",
      blueprint: createBlueprintFromQuery({
        topic: topic.trim(),
        difficulty,
        questionCount,
        totalMarks: requestedTotalMarks,
      }),
    });
  }, [searchParams]);

  async function generateQuestions() {
    if (!settings.topic.trim()) {
      toast.error("Please enter a topic.");
      return;
    }

    if (settings.blueprint.length === 0) {
      toast.error("Add at least one question to the blueprint.");
      return;
    }

    setGenerating(true);
    setQuestionSet(null);
    setSavedQuestionSetId(null);

    try {
      const response = await fetch("/api/ai/generate-exam-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          useDemo,
        }),
      });

      const data = (await response.json()) as GenerateExamQuestionsResponse;

      if (!response.ok || !data.questionSet) {
        throw new Error(data.error || "The questions could not be generated.");
      }

      setQuestionSet(data.questionSet);

      toast.success(
        data.source === "demo"
          ? "Demo exam-style paper generated."
          : "Exam-style paper generated.",
      );
    } catch (error) {
      console.error("Generate exam questions error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The questions could not be generated.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function saveQuestionSet() {
    if (!user) {
      toast.error("You must be logged in as a teacher.");
      return;
    }

    if (!questionSet) {
      return;
    }

    setSaving(true);

    try {
      const documentId = await saveExamQuestionSet(user.uid, questionSet);

      setSavedQuestionSetId(documentId);

      toast.success("Question set saved to the Question Bank.");
    } catch (error) {
      console.error("Save question set error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The question set could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  function resetGenerator() {
    setQuestionSet(null);
    setSavedQuestionSetId(null);
    setSettings(createInitialSettings());
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-200">
              AI Assessment Tools
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Exam-Style Paper Builder
            </h1>

            <p className="mt-3 max-w-3xl text-indigo-100">
              Design the assessment blueprint, then generate original Computer
              Science questions, mark schemes, model answers and examiner
              guidance.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/teacher/question-bank"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-800"
            >
              Question Bank
            </Link>

            <Link
              href="/teacher"
              className="rounded-xl border border-white/20 px-5 py-3 text-center font-bold text-white"
            >
              Teacher Dashboard
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              Paper configuration
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Build a controlled assessment blueprint
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Every generated question follows the teacher-selected objective,
              type, command word, mark value and topic focus. Individual
              questions may be worth up to 12 marks.
            </p>

            <p className="mt-3 text-sm font-bold text-indigo-700">
              Current paper: {settings.blueprint.length} questions ·{" "}
              {totalMarks} marks
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <input
              type="checkbox"
              checked={useDemo}
              onChange={(event) => setUseDemo(event.target.checked)}
            />

            <span className="text-sm font-bold text-amber-900">
              Use demo mode
            </span>
          </label>
        </div>

        <ExamQuestionGeneratorForm
          settings={settings}
          generating={generating}
          onChange={setSettings}
          onSubmit={generateQuestions}
        />
      </Card>

      {generating && (
        <Card>
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Writing the assessment paper
            </h2>

            <p className="mt-2 text-slate-600">
              Every question is being generated from its blueprint row.
            </p>
          </div>
        </Card>
      )}

      {questionSet && !generating && (
        <EditableExamQuestionPreview
          questionSet={questionSet}
          saving={saving}
          savedQuestionSetId={savedQuestionSetId}
          onChange={setQuestionSet}
          onSave={saveQuestionSet}
          onDiscard={resetGenerator}
        />
      )}
    </div>
  );
}
