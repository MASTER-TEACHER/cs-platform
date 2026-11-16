"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  getTeacherLibraryQuestions,
  saveLibraryQuestion,
} from "@/lib/question-library/service";
import {
  validateLibraryQuestion,
  questionFingerprint,
} from "@/lib/question-library/validation";
import type {
  QuestionLibraryItem,
  QuestionDifficulty,
  QuestionReviewStatus,
} from "@/lib/question-library/types";
import type {
  AssessmentBlueprintItem,
  AssessmentQuestionType,
  ExamQuestionCommandWord,
  GeneratedExamQuestionSet,
} from "@/types/examQuestion";

type GeneratedResponse = {
  questionSet?: GeneratedExamQuestionSet;
  source?: string;
  warning?: string;
  error?: string;
};

const TOPICS = [
  "CPU architecture",
  "Memory and storage",
  "Computer networks",
  "Cybersecurity",
  "Systems software",
  "Ethical, legal and environmental impacts",
  "Algorithms",
  "Programming",
  "Boolean logic",
  "Binary representation and arithmetic",
  "Hexadecimal",
  "Image representation",
  "Sound representation",
  "Character representation",
  "Data compression",
  "Databases and SQL",
  "Software development and testing",
  "Programming languages and IDEs",
  "Defensive design",
  "Data representation",
];

const QUESTION_VARIANTS: Array<{
  type: AssessmentQuestionType;
  command: ExamQuestionCommandWord;
  marks: number;
}> = [
  { type: "multiple-choice", command: "identify", marks: 1 },
  { type: "definition", command: "define", marks: 2 },
  { type: "short-response", command: "describe", marks: 3 },
  { type: "explain", command: "explain", marks: 4 },
  { type: "compare", command: "compare", marks: 4 },
  { type: "scenario-application", command: "explain", marks: 4 },
  { type: "code-tracing", command: "trace", marks: 3 },
  { type: "debugging", command: "debug", marks: 4 },
  { type: "calculation", command: "calculate", marks: 3 },
  { type: "algorithm-design", command: "design", marks: 6 },
  { type: "extended-response", command: "evaluate", marks: 8 },
  { type: "state-identify", command: "state", marks: 2 },
  { type: "code-completion", command: "complete", marks: 3 },
  { type: "truth-table", command: "complete", marks: 4 },
  { type: "conversion", command: "calculate", marks: 3 },
  { type: "trace-table", command: "trace", marks: 4 },
  { type: "explain", command: "explain", marks: 3 },
  { type: "compare", command: "compare", marks: 6 },
  { type: "scenario-application", command: "explain", marks: 5 },
  { type: "extended-response", command: "discuss", marks: 6 },
];

function buildBlueprint(
  topic: string,
  difficulty: QuestionDifficulty,
  count: number,
): AssessmentBlueprintItem[] {
  return QUESTION_VARIANTS.slice(0, count).map((variant, index) => ({
    id: `library-${index + 1}`,
    questionNumber: index + 1,
    topicFocus: topic,
    difficulty,
    questionType: variant.type,
    commandWord: variant.command,
    marks: variant.marks,
    assessmentObjective:
      index % 3 === 0 ? "AO1" : index % 3 === 1 ? "AO2" : "AO3",
  }));
}

function toLibraryQuestion(
  question: GeneratedExamQuestionSet["questions"][number],
  teacherId: string,
  qualification: string,
  examBoard: string,
  source: string,
): QuestionLibraryItem {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    teacherId,
    qualification,
    examBoard,
    topic: question.topic,
    subtopic: question.topic,
    questionType: question.questionType,
    difficulty: question.difficulty,
    question: question.question,
    context: question.context,
    marks: question.marks,
    modelAnswer: question.modelAnswer,
    markScheme: question.markScheme.map(
      (point) => point.description,
    ),
    reviewStatus: "needs_review",
    source: source === "ai" ? "ai" : "import",
    createdAt: now,
    updatedAt: now,
  };
}

function qualityWarnings(item: QuestionLibraryItem): string[] {
  const result = validateLibraryQuestion(item);
  const warnings = [...result.errors];

  if (
    /teacher may edit|teacher should|final published version|insert or edit|create an original|suitable values|original scenario provided|the model answer should|a complete answer should/i.test(
      [item.question, item.context, item.modelAnswer].join(" "),
    )
  ) {
    warnings.push("Generic or incomplete assessment content.");
  }

  if (
    /calculation|conversion|truth-table|trace-table|code-tracing|debugging|code-completion/.test(
      item.questionType,
    ) &&
    !/\d|[=<>]|```|\b(?:INPUT|OUTPUT|PRINT|FOR|WHILE|IF)\b/i.test(
      item.question + "\n" + item.context,
    )
  ) {
    warnings.push("Check that required values, code or tables are supplied.");
  }

  if (
    item.marks >= 6 &&
    item.markScheme.length < 3
  ) {
    warnings.push("Extended-response marking guidance may be incomplete.");
  }

  return [...new Set(warnings)];
}

export default function IndependentQuestionLibraryPage() {
  const { user } = useAuth();

  const [topic, setTopic] = useState(TOPICS[0]);
  const [board, setBoard] = useState("AQA");
  const [difficulty, setDifficulty] =
    useState<QuestionDifficulty>("standard");
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<QuestionLibraryItem[]>([]);
  const [drafts, setDrafts] = useState<QuestionLibraryItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function refresh() {
    if (!user) return;

    const data = await getTeacherLibraryQuestions(db, user.uid);
    setItems(data);
  }

  useEffect(() => {
    if (!user) return;

    let active = true;

    getTeacherLibraryQuestions(db, user.uid)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Unable to load library.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return items.filter((item) => {
      if (
        statusFilter !== "all" &&
        item.reviewStatus !== statusFilter
      ) {
        return false;
      }

      return (
        !term ||
        [item.topic, item.question, item.context]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [items, search, statusFilter]);

  const approved = items.filter(
    (item) => item.reviewStatus === "approved",
  ).length;

  async function generate() {
    if (!user || busy) return;

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/ai/generate-exam-questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            qualification: "GCSE",
            examBoard: board,
            difficulty,
            generationMode: "manual",
            blueprint: buildBlueprint(topic, difficulty, count),
            useDemo: false,
          }),
        },
      );

      const data = (await response.json()) as GeneratedResponse;

      if (!response.ok || !data.questionSet) {
        throw new Error(data.error || "Generation failed.");
      }

      const converted = data.questionSet.questions.map((question) =>
        toLibraryQuestion(
          question,
          user.uid,
          "GCSE",
          board,
          data.source || "unknown",
        ),
      );

      const existing = new Set(
        [...items, ...drafts].map(questionFingerprint),
      );

      const unique = converted.filter((item) => {
        const fingerprint = questionFingerprint(item);

        if (existing.has(fingerprint)) return false;

        existing.add(fingerprint);
        return true;
      });

      setDrafts((current) => [...current, ...unique]);

      setMessage(
        `${unique.length} new questions generated for review. ` +
          `${converted.length - unique.length} duplicates skipped. ` +
          (data.source !== "ai"
            ? "Warning: the generator returned offline/demo content. Review carefully."
            : "AI content must be reviewed before approval."),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Generation failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  function editDraft(
    id: string,
    changes: Partial<QuestionLibraryItem>,
  ) {
    setDrafts((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, ...changes, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  async function saveDraft(
    item: QuestionLibraryItem,
    status: QuestionReviewStatus,
  ) {
    if (!user || savingId) return;

    if (item.teacherId !== user.uid) {
      setMessage("Teacher ownership mismatch.");
      return;
    }

    const next = {
      ...item,
      reviewStatus: status,
      updatedAt: new Date().toISOString(),
    };

    const warnings = qualityWarnings(next);

    if (status === "approved" && warnings.length > 0) {
      setMessage(
        "Approval blocked: " + warnings.join(" "),
      );
      return;
    }

    setSavingId(item.id);
    setMessage("");

    try {
      await saveLibraryQuestion(db, next);
      await refresh();

      setDrafts((current) =>
        current.filter((entry) => entry.id !== item.id),
      );

      setMessage(
        status === "approved"
          ? "Question approved and saved."
          : "Question saved for further review.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Save failed.",
      );
    } finally {
      setSavingId(null);
    }
  }

  async function updateStatus(
    item: QuestionLibraryItem,
    status: QuestionReviewStatus,
  ) {
    await saveDraft(item, status);
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header className="rounded-2xl bg-slate-950 p-6 text-white">
        <p className="text-sm font-semibold text-indigo-200">
          CS Master · Independent Question Library
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Generate, review and approve questions
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          GCSE Computer Science · AQA, OCR and Edexcel.
          Generated questions are never automatically approved.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/teacher/question-bank/enhanced"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950"
          >
            Enhanced Question Bank
          </Link>
          <Link
            href="/teacher/exam-question-generator"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-bold"
          >
            Existing Paper Generator
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Saved library questions</p>
          <p className="text-3xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Approved questions</p>
          <p className="text-3xl font-bold">{approved}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Unsaved review queue</p>
          <p className="text-3xl font-bold">{drafts.length}</p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-5">
        <h2 className="text-xl font-bold">Generate a batch</h2>

        <div className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1 text-sm">
            <span>Topic</span>
            <select
              className="w-full rounded-lg border p-2 text-slate-900"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              {TOPICS.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Exam board</span>
            <select
              className="w-full rounded-lg border p-2 text-slate-900"
              value={board}
              onChange={(event) => setBoard(event.target.value)}
            >
              {["AQA", "OCR", "EDEXCEL"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Difficulty</span>
            <select
              className="w-full rounded-lg border p-2 text-slate-900"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as QuestionDifficulty)
              }
            >
              <option value="foundation">Foundation</option>
              <option value="standard">Standard</option>
              <option value="higher">Higher</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Questions per batch</span>
            <select
              className="w-full rounded-lg border p-2 text-slate-900"
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            >
              {[5, 10, 15, 20].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!user || busy}
          className="rounded-lg bg-indigo-700 px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          {busy ? "Generating questions..." : "Generate AI questions"}
        </button>

        <p className="text-xs text-slate-500">
          The generator supports a maximum of 20 questions per request.
          Requests may incur API usage costs. No automatic bulk loop is started.
        </p>
      </section>

      {message && (
        <div
          role="status"
          className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-950"
        >
          {message}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Generated questions awaiting review ({drafts.length})
        </h2>

        {drafts.map((item, index) => {
          const warnings = qualityWarnings(item);

          return (
            <article
              key={item.id}
              className="space-y-3 rounded-xl border p-5"
            >
              <p className="text-sm font-bold text-indigo-700">
                Question {index + 1} · {item.topic} · {item.marks} marks
              </p>

              <label className="block space-y-1 text-sm">
                <span className="font-semibold">Question</span>
                <textarea
                  className="w-full rounded-lg border p-3 text-slate-900"
                  rows={4}
                  value={item.question}
                  onChange={(event) =>
                    editDraft(item.id, { question: event.target.value })
                  }
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-semibold">Context / supporting material</span>
                <textarea
                  className="w-full rounded-lg border p-3 text-slate-900"
                  rows={3}
                  value={item.context}
                  onChange={(event) =>
                    editDraft(item.id, { context: event.target.value })
                  }
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-semibold">Model answer</span>
                <textarea
                  className="w-full rounded-lg border p-3 text-slate-900"
                  rows={4}
                  value={item.modelAnswer}
                  onChange={(event) =>
                    editDraft(item.id, { modelAnswer: event.target.value })
                  }
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-semibold">
                  Mark scheme (one marking point per line)
                </span>
                <textarea
                  className="w-full rounded-lg border p-3 text-slate-900"
                  rows={4}
                  value={item.markScheme.join("\n")}
                  onChange={(event) =>
                    editDraft(item.id, {
                      markScheme: event.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>

              {warnings.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
                  <strong>Review required:</strong>
                  <ul className="mt-1 list-disc pl-5">
                    {warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={savingId !== null}
                  onClick={() => saveDraft(item, "needs_review")}
                  className="rounded-lg border px-4 py-2 text-sm font-bold disabled:opacity-50"
                >
                  Save for review
                </button>

                <button
                  type="button"
                  disabled={savingId !== null || warnings.length > 0}
                  onClick={() => saveDraft(item, "approved")}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  Approve and save
                </button>

                <button
                  type="button"
                  disabled={savingId !== null}
                  onClick={() =>
                    setDrafts((current) =>
                      current.filter((entry) => entry.id !== item.id),
                    )
                  }
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
                >
                  Discard
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            Saved Question Library ({filtered.length})
          </h2>

          <div className="flex flex-wrap gap-2">
            <input
              aria-label="Search saved questions"
              placeholder="Search questions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-lg border p-2 text-sm"
            />

            <select
              aria-label="Filter review status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border p-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="needs_review">Needs review</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="rounded-xl border p-5 text-sm text-slate-500">
            No saved library questions match the current filters.
          </p>
        )}

        {filtered.map((item) => (
          <article
            key={item.id}
            className="space-y-3 rounded-xl border p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold">{item.topic}</span>
              <span>· {item.examBoard}</span>
              <span>· {item.marks} marks</span>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
                {item.reviewStatus.replace("_", " ")}
              </span>
            </div>

            <p className="whitespace-pre-wrap text-sm">{item.question}</p>

            <details className="text-sm">
              <summary className="cursor-pointer font-semibold">
                View answer and mark scheme
              </summary>
              <p className="mt-2 whitespace-pre-wrap">{item.modelAnswer}</p>
              <ul className="mt-2 list-disc pl-5">
                {item.markScheme.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </details>

            <div className="flex flex-wrap gap-2">
              {item.reviewStatus !== "approved" &&
                qualityWarnings(item).length === 0 && (
                  <button
                    type="button"
                    disabled={savingId !== null}
                    onClick={() => updateStatus(item, "approved")}
                    className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}

              {item.reviewStatus === "approved" && (
                <button
                  type="button"
                  disabled={savingId !== null}
                  onClick={() => updateStatus(item, "needs_review")}
                  className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50"
                >
                  Return to review
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}