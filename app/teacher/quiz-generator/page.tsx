"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import QuizGeneratorForm from "@/components/teacher/QuizGeneratorForm";
import EditableQuizPreview from "@/components/teacher/EditableQuizPreview";
import { useAuth } from "@/contexts/AuthContext";
import { saveGeneratedQuiz } from "@/services/generatedQuizService";
import type {
  GeneratedQuiz,
  GenerateQuizResponse,
  QuizGeneratorSettings,
} from "@/types/generatedQuiz";

const initialSettings: QuizGeneratorSettings = {
  topic: "",
  qualification: "GCSE",
  examBoard: "AQA",
  difficulty: "standard",
  questionCount: 5,
};

export default function QuizGeneratorPage() {
  const { user } = useAuth();

  const [settings, setSettings] =
    useState<QuizGeneratorSettings>(initialSettings);

  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);

  async function handleGenerate() {
    if (!settings.topic.trim()) {
      toast.error("Please enter a quiz topic.");
      return;
    }

    setGenerating(true);
    setQuiz(null);
    setSavedQuizId(null);

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: settings.topic.trim(),
          qualification: settings.qualification,
          examBoard: settings.examBoard,
          difficulty: settings.difficulty,
          questionCount: settings.questionCount,
        }),
      });

      const data = (await response.json()) as GenerateQuizResponse;

      if (!response.ok) {
        throw new Error(data.error || "The quiz could not be generated.");
      }

      if (!data.quiz) {
        throw new Error("The server did not return a quiz.");
      }

      setQuiz(data.quiz);
      toast.success("Quiz generated successfully.");
    } catch (error) {
      console.error("Quiz generation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The quiz could not be generated."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!user) {
      toast.error("You must be logged in as a teacher.");
      return;
    }

    if (!quiz) {
      toast.error("Generate a quiz before saving.");
      return;
    }

    setSaving(true);

    try {
      const quizId = await saveGeneratedQuiz({
        teacherId: user.uid,
        title: quiz.title,
        description: quiz.description,
        topicId: quiz.topicId,
        qualification: settings.qualification,
        examBoard: settings.examBoard,
        difficulty: settings.difficulty,
        estimatedTime: quiz.estimatedTime,
        questions: quiz.questions,
      });

      setSavedQuizId(quizId);
      toast.success("Quiz saved successfully.");
    } catch (error) {
      console.error("Save generated quiz error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The quiz could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetGenerator() {
    setQuiz(null);
    setSavedQuizId(null);
    setSettings(initialSettings);
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-100">
              AI Teacher Tools
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              AI Quiz Generator
            </h1>

            <p className="mt-3 max-w-2xl text-violet-100">
              Generate GCSE Computer Science multiple-choice quizzes, review
              them, and save approved content to your quiz library.
            </p>
          </div>

          <Link
            href="/teacher"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-violet-50"
          >
            ← Teacher Dashboard
          </Link>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Quiz Settings
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Generate a New Quiz
        </h2>

        <QuizGeneratorForm
          settings={settings}
          generating={generating}
          onChange={setSettings}
          onSubmit={handleGenerate}
        />
      </Card>

      {generating && (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Creating your quiz
            </h2>

            <p className="mt-2 text-slate-600">
              The AI is writing and checking the questions.
            </p>
          </div>
        </Card>
      )}

   {quiz && !generating && (
  <EditableQuizPreview
    quiz={quiz}
    saving={saving}
    savedQuizId={savedQuizId}
    onChange={(updatedQuiz) => setQuiz(updatedQuiz)}
    onSave={handleSave}
    onDiscard={resetGenerator}
  />
)}
    </div>
  );
}