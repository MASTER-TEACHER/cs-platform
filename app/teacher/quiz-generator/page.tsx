"use client";

import {
  AlertTriangle,
  Beaker,
  Brain,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import EditableQuizPreview from "@/components/teacher/EditableQuizPreview";
import QuizGeneratorForm from "@/components/teacher/QuizGeneratorForm";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { saveGeneratedQuiz } from "@/services/generatedQuizService";
import type {
  GeneratedQuiz,
  GeneratedQuizQuestion,
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

type GenerationMode = "ai" | "demo" | null;

type ApiErrorResponse = GenerateQuizResponse & {
  errorCode?: string;
  demoAvailable?: boolean;
};

function normaliseDifficulty(
  value: string | null,
): QuizGeneratorSettings["difficulty"] {
  if (value === "foundation" || value === "higher") {
    return value;
  }

  return "standard";
}

function normaliseQuestionCount(value: string | null): number {
  const parsed = Number(value);

  if (Number.isInteger(parsed) && parsed >= 3 && parsed <= 20) {
    return parsed;
  }

  return initialSettings.questionCount;
}

function createTopicId(topic: string): string {
  const cleanedTopic = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleanedTopic || "computer-science";
}

function createDemoQuestionBank(
  topic: string,
): Omit<GeneratedQuizQuestion, "id">[] {
  const displayTopic = topic.trim() || "Computer Science";

  return [
    {
      type: "multipleChoice",
      question: `Which statement best describes ${displayTopic}?`,
      options: [
        `It is a concept studied in Computer Science`,
        "It is only used in physical education",
        "It cannot be represented using data",
        "It has no connection to computing",
      ],
      correctAnswer: "It is a concept studied in Computer Science",
      explanation: `${displayTopic} is being used here as a Computer Science topic. A full live AI quiz would generate more topic-specific wording.`,
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `Why is it useful to understand ${displayTopic}?`,
      options: [
        "It helps explain and solve computing problems",
        "It removes the need to test programs",
        "It guarantees that every program is error-free",
        "It prevents computers from processing data",
      ],
      correctAnswer: "It helps explain and solve computing problems",
      explanation:
        "Understanding core concepts helps learners analyse problems and choose suitable computing solutions.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `Which activity is most suitable when learning about ${displayTopic}?`,
      options: [
        "Applying the concept to an example",
        "Ignoring all worked examples",
        "Avoiding explanations and feedback",
        "Memorising unrelated facts only",
      ],
      correctAnswer: "Applying the concept to an example",
      explanation:
        "Applying knowledge to examples helps demonstrate understanding rather than simple recall.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `What should a student do after answering a question about ${displayTopic} incorrectly?`,
      options: [
        "Review the explanation and try again",
        "Delete the entire topic",
        "Assume the correct answer is wrong",
        "Avoid all future questions",
      ],
      correctAnswer: "Review the explanation and try again",
      explanation:
        "Reviewing feedback helps identify misconceptions and supports improvement.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `Which approach provides the strongest evidence of understanding ${displayTopic}?`,
      options: [
        "Explaining and applying the idea",
        "Repeating the title only",
        "Leaving every answer blank",
        "Selecting answers without reading",
      ],
      correctAnswer: "Explaining and applying the idea",
      explanation:
        "A learner demonstrates deeper understanding by explaining a concept and applying it accurately.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `Which resource could support revision of ${displayTopic}?`,
      options: [
        "Worked examples and practice questions",
        "An unrelated shopping list",
        "A blank document with no instructions",
        "A random collection of passwords",
      ],
      correctAnswer: "Worked examples and practice questions",
      explanation:
        "Worked examples model the process, while practice questions help learners apply it independently.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `What is the purpose of testing knowledge of ${displayTopic}?`,
      options: [
        "To identify strengths and areas for improvement",
        "To prevent students receiving feedback",
        "To make revision impossible",
        "To remove the need for teaching",
      ],
      correctAnswer: "To identify strengths and areas for improvement",
      explanation:
        "Assessment evidence helps learners and teachers identify what is secure and what needs further practice.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `Which response shows effective problem-solving when studying ${displayTopic}?`,
      options: [
        "Breaking the problem into manageable parts",
        "Ignoring the question requirements",
        "Changing every answer randomly",
        "Refusing to examine the available information",
      ],
      correctAnswer: "Breaking the problem into manageable parts",
      explanation:
        "Decomposition makes complex problems easier to understand and solve.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `What should a good explanation of ${displayTopic} include?`,
      options: [
        "Accurate terminology and a relevant example",
        "Only unrelated vocabulary",
        "No explanation or evidence",
        "A list of random numbers",
      ],
      correctAnswer: "Accurate terminology and a relevant example",
      explanation:
        "Accurate terminology and relevant examples make an explanation clearer and more convincing.",
      xpReward: 10,
    },
    {
      type: "multipleChoice",
      question: `How can a teacher use quiz results about ${displayTopic}?`,
      options: [
        "Plan support and future teaching",
        "Automatically delete every lesson",
        "Prevent students from revising",
        "Replace all assessment with guessing",
      ],
      correctAnswer: "Plan support and future teaching",
      explanation:
        "Quiz results provide evidence that can inform reteaching, intervention and future lesson planning.",
      xpReward: 10,
    },
  ];
}

function createDemoQuiz(settings: QuizGeneratorSettings): GeneratedQuiz {
  const topic = settings.topic.trim() || "Computer Science";

  const topicId = createTopicId(topic);

  const questionBank = createDemoQuestionBank(topic);

  const questions = Array.from(
    {
      length: settings.questionCount,
    },
    (_, index) => {
      const template = questionBank[index % questionBank.length];

      return {
        ...template,
        id: `${topicId}-demo-${index + 1}`,
      };
    },
  );

  return {
    title: `${topic} Demo Quiz`,
    description: `A development-mode ${settings.qualification} ${settings.examBoard} quiz for testing the complete CS Master assignment workflow without using API credits.`,
    topicId,
    estimatedTime: `${Math.max(
      5,
      Math.ceil(settings.questionCount * 1.5),
    )} minutes`,
    questions,
  };
}

export default function QuizGeneratorPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [settings, setSettings] =
    useState<QuizGeneratorSettings>(initialSettings);

  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);

  const [generating, setGenerating] = useState(false);

  const [saving, setSaving] = useState(false);

  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);

  const [generationMode, setGenerationMode] = useState<GenerationMode>(null);

  const [quotaUnavailable, setQuotaUnavailable] = useState(false);

  const [copilotPrefilled, setCopilotPrefilled] = useState(false);

  useEffect(() => {
    const topic = searchParams.get("topic");

    if (!topic?.trim()) {
      return;
    }

    setSettings({
      topic: topic.trim(),
      qualification:
        searchParams.get("qualification")?.trim() ||
        initialSettings.qualification,
      examBoard:
        searchParams.get("examBoard")?.trim() || initialSettings.examBoard,
      difficulty: normaliseDifficulty(searchParams.get("difficulty")),
      questionCount: normaliseQuestionCount(searchParams.get("questionCount")),
    });

    setQuiz(null);
    setSavedQuizId(null);
    setGenerationMode(null);
    setQuotaUnavailable(false);
    setCopilotPrefilled(true);
  }, [searchParams]);

  const developmentMode =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_DEMO_TOOLS === "true";

  const previewLabel = useMemo(() => {
    if (generationMode === "demo") {
      return "Demo quiz";
    }

    if (generationMode === "ai") {
      return "AI-generated quiz";
    }

    return null;
  }, [generationMode]);

  function validateTopic(): boolean {
    if (!settings.topic.trim()) {
      toast.error("Please enter a quiz topic.");

      return false;
    }

    return true;
  }

  async function handleGenerate() {
    if (!validateTopic()) {
      return;
    }

    setGenerating(true);
    setQuiz(null);
    setSavedQuizId(null);
    setGenerationMode(null);
    setQuotaUnavailable(false);

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

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        if (response.status === 429 || data.errorCode === "quota_exceeded") {
          setQuotaUnavailable(true);

          toast.error(
            "The AI account currently has no available quota. You can generate a demo quiz instead.",
          );

          return;
        }

        throw new Error(data.error || "The quiz could not be generated.");
      }

      if (!data.quiz) {
        throw new Error("The server did not return a quiz.");
      }

      setQuiz(data.quiz);
      setGenerationMode("ai");

      toast.success("Quiz generated successfully.");
    } catch (error) {
      console.error("Quiz generation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "The quiz could not be generated.",
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleGenerateDemo() {
    if (!validateTopic()) {
      return;
    }

    setGenerating(false);
    setSavedQuizId(null);
    setQuotaUnavailable(false);

    const demoQuiz = createDemoQuiz(settings);

    setQuiz(demoQuiz);
    setGenerationMode("demo");

    toast.success("Demo quiz generated without using API credits.");
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

      toast.success(
        generationMode === "demo"
          ? "Demo quiz saved to your quiz library."
          : "Quiz saved successfully.",
      );
    } catch (error) {
      console.error("Save generated quiz error:", error);

      toast.error(
        error instanceof Error ? error.message : "The quiz could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  function resetGenerator() {
    setQuiz(null);
    setSavedQuizId(null);
    setGenerationMode(null);
    setQuotaUnavailable(false);
    setCopilotPrefilled(false);
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

            <h1 className="mt-3 text-4xl font-extrabold">AI Quiz Generator</h1>

            <p className="mt-3 max-w-2xl text-violet-100">
              Generate GCSE Computer Science quizzes using AI or use development
              mode to test the complete workflow without API credits.
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

      {copilotPrefilled && (
        <Card className="border border-teal-200 bg-teal-50">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

            <div>
              <p className="font-bold text-teal-950">
                Quiz settings loaded from CS Master Copilot
              </p>

              <p className="mt-1 text-sm leading-6 text-teal-800">
                Review the topic and settings below, then choose live AI
                generation or the no-cost demo generator.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Quiz Settings
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Generate a New Quiz
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Live generation uses the configured OpenAI API account. Demo
              generation creates testable content locally and does not make an
              API request.
            </p>
          </div>

          {developmentMode && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
              <Beaker className="h-4 w-4" />
              Development tools enabled
            </span>
          )}
        </div>

        <QuizGeneratorForm
          settings={settings}
          generating={generating}
          onChange={setSettings}
          onSubmit={handleGenerate}
        />

        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                  <Beaker className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-violet-950">
                    Test without API credits
                  </p>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-violet-800">
                    Create a local demo quiz, save it to Firestore, assign it to
                    a class and test student results and teacher markbooks.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateDemo}
                disabled={generating}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Beaker className="h-4 w-4" />
                Generate Demo Quiz
              </button>
            </div>
          </div>
        </div>
      </Card>

      {quotaUnavailable && (
        <Card className="border border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-amber-950">
                AI quota unavailable
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Live AI generation is temporarily unavailable. This does not
                prevent you from testing the quiz library, assignment wizard,
                student quiz player, result saving or teacher markbook.
              </p>

              <button
                type="button"
                onClick={handleGenerateDemo}
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
              >
                <Beaker className="h-4 w-4" />
                Generate Demo Quiz Now
              </button>
            </div>
          </div>
        </Card>
      )}

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
        <div className="space-y-4">
          {previewLabel && (
            <div
              className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                generationMode === "demo"
                  ? "border-violet-200 bg-violet-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {generationMode === "demo" ? (
                  <Beaker className="h-5 w-5 text-violet-700" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                )}

                <div>
                  <p
                    className={`font-bold ${
                      generationMode === "demo"
                        ? "text-violet-950"
                        : "text-emerald-950"
                    }`}
                  >
                    {previewLabel} ready
                  </p>

                  <p
                    className={`mt-0.5 text-sm ${
                      generationMode === "demo"
                        ? "text-violet-700"
                        : "text-emerald-700"
                    }`}
                  >
                    Review and edit the questions before saving.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (generationMode === "demo") {
                    handleGenerateDemo();
                  } else {
                    void handleGenerate();
                  }
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Regenerate
              </button>
            </div>
          )}

          <EditableQuizPreview
            quiz={quiz}
            saving={saving}
            savedQuizId={savedQuizId}
            onChange={(updatedQuiz) => setQuiz(updatedQuiz)}
            onSave={handleSave}
            onDiscard={resetGenerator}
          />
        </div>
      )}

      {!quiz && !generating && !quotaUnavailable && (
        <Card className="border border-slate-200 bg-slate-50">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-700">
              <Brain className="h-8 w-8" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Ready to create a quiz
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Enter a topic and choose either live AI generation or the no-cost
              demo generator.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Both options work with your existing quiz library
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
