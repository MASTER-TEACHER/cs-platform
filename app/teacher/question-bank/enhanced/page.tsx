
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

import {
  getTeacherExamQuestionSets,
  getTeacherPaperReview,
  saveExamQuestionSet,
  updateTeacherExamQuestionSet,
} from "@/services/examQuestionService";

import type {
  ExamPaperReview,
  SavedExamQuestionSet,
} from "@/services/examQuestionService";

import {
  composeQuestionSet,
  deduplicateQuestions,
  flattenQuestionSets,
} from "@/lib/question-bank/bankUtilities";

import type { BankQuestion } from "@/lib/question-bank/bankUtilities";
import { generatePrintableDocument } from "@/lib/question-bank/printDocuments";
import { catalogueQuestions } from "@/lib/question-bank/staticCatalogue";
import { stageTwoQuestions } from "@/lib/question-bank/staticCatalogueStage2";
import { expandedCatalogueQuestions } from "@/lib/question-bank/staticCatalogueExpanded";
import { largeBatchQuestions } from "@/lib/question-bank/staticCatalogueLargeBatch";
import { batch4Questions } from "@/lib/question-bank/staticCatalogueBatch4";
import { imediaCatalogueQuestions } from "@/lib/question-bank/imediaCatalogue";
import {
  canonicalBankTopic,
  isIMediaQualification,
} from "@/lib/question-bank/subjectTaxonomy";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm";

const canonicalTopic = canonicalBankTopic;

const isCreativeIMedia = (item: BankQuestion): boolean =>
  isIMediaQualification(item.qualification);
export default function EnhancedQuestionBankPage() {
 const { user } = useAuth();
const teacherId = user?.uid ?? "";

  const [sets, setSets] = useState<SavedExamQuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("computer-science");
  const [qualification, setQualification] = useState("all");
  const [board, setBoard] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<BankQuestion[]>([]);
  const [title, setTitle] = useState("Custom examination paper");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [review, setReview] = useState<ExamPaperReview>({});
  const [dirty, setDirty] = useState(false);

  const loadSets = useCallback(async () => {
  if (!teacherId) return;

  const data = await getTeacherExamQuestionSets(teacherId);
  setSets(data.filter((item) => item.status !== "archived"));
}, [teacherId]);

  useEffect(() => {
    if (!teacherId) return;

    let active = true;

    getTeacherExamQuestionSets(teacherId)
      .then((data) => {
        if (active) {
          setSets(data.filter((item) => item.status !== "archived"));
        }
      })
      .catch(() => {
        if (active) setMessage("Could not load saved question sets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

   return () => {
  active = false;
};
}, [teacherId]);

  const allQuestions = useMemo(
    () => deduplicateQuestions([...catalogueQuestions, ...stageTwoQuestions, ...expandedCatalogueQuestions, ...largeBatchQuestions, ...batch4Questions, ...imediaCatalogueQuestions, ...flattenQuestionSets(sets)]),
    [sets],
  );


const normaliseFilter = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toLowerCase();


  const subjectQuestions = useMemo(
    () =>
      allQuestions.filter((item) =>
        subject === "creative-imedia"
          ? isCreativeIMedia(item)
          : !isCreativeIMedia(item)
      ),
    [allQuestions, subject],
  );

  const availableTopics = useMemo(() => {
    const matching = subjectQuestions.filter((item) => {
      return (
        (qualification === "all" ||
          normaliseFilter(item.qualification) === normaliseFilter(qualification)) &&
        (board === "all" ||
          normaliseFilter(item.examBoard) === normaliseFilter(board))
      );
    });

    return [...new Set(matching.map((item) => canonicalTopic(item.question.topic)))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [subjectQuestions, qualification, board]);

  const visible = useMemo(() => {
  const term = normaliseFilter(search);

  return subjectQuestions.filter((item) => {
    const question = item.question;

    const matchesQualification =
      qualification === "all" ||
      normaliseFilter(item.qualification) ===
        normaliseFilter(qualification);

    const matchesBoard =
      board === "all" ||
      normaliseFilter(item.examBoard) === normaliseFilter(board);

    const matchesTopic =
      topic === "all" ||
      normaliseFilter(canonicalTopic(question.topic)) === normaliseFilter(topic);

    const matchesDifficulty =
      difficulty === "all" ||
      normaliseFilter(question.difficulty) ===
        normaliseFilter(difficulty);

    const searchableText = normaliseFilter(
      [
        question.question,
        question.topic,
        question.commandWord,
        question.context,
        // Source paper title excluded from question search.
        item.qualification,
        item.examBoard,
      ].join(" "),
    );

    const matchesSearch =
      !term || searchableText.includes(term);

    return (

      matchesQualification &&
      matchesBoard &&
      matchesTopic &&
      matchesDifficulty &&
      matchesSearch
    );
  });
}, [subjectQuestions, search, qualification, board, difficulty, topic]);



  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageQuestions = useMemo(
    () =>
      visible.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [visible, currentPage, pageSize],
  );
  function getQuestionQualityWarnings(item: BankQuestion): string[] {
    const question = item.question;
    const warnings: string[] = [];

    const topicText = question.topic.toLowerCase();
    const questionText = [
      question.question,
      question.context,
    ].join(" ").toLowerCase();

    if (
      topicText.includes("floating point") &&
      /\b(boolean|logic gate|truth table|and gate|or gate|not gate)\b/.test(questionText) &&
      !/\b(mantissa|exponent|normalis|floating.point)\b/.test(questionText)
    ) {
      warnings.push(
        "Possible topic mismatch: floating-point classification with Boolean-logic content."
      );
    }

    if (
      !Number.isFinite(question.marks) ||
      !Number.isInteger(question.marks) ||
      question.marks <= 0
    ) {
      warnings.push("Invalid question mark allocation.");
    }

    const markingPoints = question.markScheme ?? [];
    const pointTotal = markingPoints.reduce(
      (sum, point) => sum + point.marks,
      0
    );

    if (markingPoints.length === 0) {
      warnings.push(
        "No mark-by-mark marking points supplied. Teacher review required before formal assessment."
      );
    } else if (pointTotal !== question.marks) {
      warnings.push(
        `Marking points total ${pointTotal}, but the question is worth ${question.marks} marks.`
      );
    }

    const hasDescriptors =
      (question.levelDescriptors ?? []).length > 0;

    if (
      question.marks >= 6 &&
      !hasDescriptors &&
      markingPoints.length === 0
    ) {
      warnings.push(
        "Extended-response question has neither level descriptors nor mark-by-mark criteria."
      );
    }

    if (
      !question.modelAnswer?.trim() &&
      markingPoints.length === 0
    ) {
      warnings.push(
        "No model answer supplied; guidance alone must not be treated as a complete mark scheme."
      );
    }

    if (isCreativeIMedia(item)) {
      warnings.push(
        "Creative iMedia formative adaptation: verify specification alignment and marking criteria before formal assessment."
      );
    }

    return warnings;
  }
  const marks = selected.reduce(
    (sum, item) => sum + item.question.marks,
    0,
  );

  const reviewedCount = selected.filter(
    (item) => review[item.key]?.status === "reviewed",
  ).length;

  function addOrRemove(item: BankQuestion) {
    const exists = selected.some((entry) => entry.key === item.key);

    if (!exists && selected.length > 0) {
      const first = selected[0];

      if (
        first.qualification !== item.qualification ||
        first.examBoard !== item.examBoard
      ) {
        setMessage(
          "A paper must use one qualification and exam board. Remove the current questions before switching.",
        );
        return;
      }
    }

    setSelected((current) =>
      exists
        ? current.filter((entry) => entry.key !== item.key)
        : [...current, item],
    );

    setDirty(true);
    setMessage("");
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const destination = index + direction;

    if (destination < 0 || destination >= selected.length) return;

    setSelected((current) => {
      const reordered = [...current];

      [reordered[index], reordered[destination]] = [
        reordered[destination],
        reordered[index],
      ];

      return reordered;
    });

    setDirty(true);
  }

  function updateReview(
    key: string,
    status: "pending" | "reviewed" | "needs-changes",
  ) {
    setReview((current) => ({
      ...current,
      [key]: {
        status,
        reviewedAt:
          status === "reviewed" ? new Date().toISOString() : null,
      },
    }));

    setDirty(true);
  }

  function newPaper() {
    if (
      dirty &&
      !window.confirm(
        "Discard unsaved changes and start a new paper?",
      )
    ) {
      return;
    }

    setEditingId(null);
    setSelected([]);
    setReview({});
    setTitle("Custom examination paper");
    setDirty(false);
    setMessage("New paper started.");
  }

  async function openPaper(set: SavedExamQuestionSet) {
    if (!user?.uid) return;

    if (dirty && !window.confirm("Discard unsaved changes?")) {
      return;
    }

    try {
      setMessage("");

      const restored = set.content.questions.map((question, index) => ({
        key: `saved:${set.id}:${index}`,
        sourceId: set.id,
        sourceTitle: set.title,
        qualification: set.qualification,
        examBoard: set.examBoard,
        question,
      }));

      const savedReview = await getTeacherPaperReview(
        user.uid,
        set.id,
      );

      setSelected(restored);
      setReview(savedReview);
      setTitle(set.title);
      setEditingId(set.status === "draft" ? set.id : null);
      setDirty(false);

      setMessage(
        set.status === "draft"
          ? "Draft opened. You can edit and save it."
          : "Published paper opened as a new editable copy.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not open paper.",
      );
    }
  }

  async function savePaper() {
    if (!user?.uid || selected.length === 0) return;

    setSaving(true);
    setMessage("");

    try {
      const paper = composeQuestionSet(title, selected);

      if (editingId) {
        await updateTeacherExamQuestionSet(
          user.uid,
          editingId,
          paper,
          review,
        );

        setMessage("Draft updated successfully.");
      } else {
        const id = await saveExamQuestionSet(user.uid, paper);

        // The existing save service creates a draft.
        // Reopen it for subsequent editing.
        setEditingId(id);

        // Persist review metadata if present.
        if (Object.keys(review).length > 0) {
          try {
            await updateTeacherExamQuestionSet(
              user.uid,
              id,
              paper,
              review,
            );
          } catch {
            setMessage(
              "Paper saved, but review metadata could not be saved. Please save again.",
            );
            await loadSets();
            return;
          }
        }

        setMessage(`Paper saved successfully. Reference: ${id}`);
      }

      setDirty(false);
      await loadSets();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Save failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  function printPaper(includeAnswers: boolean) {
    if (selected.length === 0) return;

    try {
      const paper = composeQuestionSet(title, selected);
      const html = generatePrintableDocument(paper, includeAnswers);

      const blob = new Blob([html], {
        type: "text/html;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const popup = window.open(url, "_blank");

      if (!popup) {
        URL.revokeObjectURL(url);
        setMessage("Allow pop-ups to open the printable document.");
        return;
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 60000);

      setMessage(
        "Printable document opened. Review it, then use Save as PDF.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Printing failed.",
      );
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header className="rounded-3xl bg-indigo-950 p-7 text-white">
        <p className="text-sm font-bold text-indigo-200">
          CS Master Assessment Tools
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Enhanced Question Bank
        </h1>

        <p className="mt-3 text-indigo-100">
          Build, review, save and print examination papers.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/teacher/question-bank"
            className="rounded-xl bg-white px-4 py-2 font-bold text-indigo-900"
          >
            Original Question Bank
          </Link>

          <Link
            href="/teacher/exam-question-generator"
            className="rounded-xl border border-white/30 px-4 py-2 font-bold"
          >
            Generate Questions
          </Link>
        </div>
      </header>

      {message && (
        <p role="status" className="rounded-xl bg-slate-100 p-4">
          {message}
        </p>
      )}

      <section className="rounded-2xl border bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black">Saved Papers</h2>

          <button
            type="button"
            onClick={newPaper}
            className="rounded-xl bg-indigo-700 px-4 py-2 font-bold text-white"
          >
            Create New Paper
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sets.map((set) => (
            <div key={set.id} className="rounded-xl border p-4">
              <h3 className="font-bold">{set.title}</h3>

              <p className="mt-1 text-xs text-slate-500">
                {set.qualification} | {set.examBoard}
              </p>

              <p className="mt-2 text-sm">
                {set.questionCount} questions | {set.totalMarks} marks
              </p>

              <p className="mt-1 text-xs capitalize text-slate-500">
                {set.status}
              </p>

              <button
                type="button"
                onClick={() => void openPaper(set)}
                className="mt-3 rounded-lg border px-3 py-2 text-sm font-bold"
              >
                {set.status === "draft"
                  ? "Open / Edit"
                  : "Open as Copy"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5">
        <label className="block max-w-sm">
          <span className="mb-2 block text-sm font-bold">
            Subject
          </span>
          <select
            className={inputClass}
            value={subject}
            onChange={(event) => {
              setSelected([]);
              setEditingId(null);
              setReview({});
              setDirty(false);
              setSubject(event.target.value);
              setQualification("all");
              setBoard("all");
              setTopic("all");
              setPage(1);
            }}
          >
            <option value="computer-science">
              Computer Science
            </option>
            <option value="creative-imedia">
              Creative iMedia
            </option>
          </select>
        </label>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-4">
        <label>
          <span className="mb-2 block text-sm font-bold">Search</span>
          <input
            className={inputClass}
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Question, topic or command word"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">
            Qualification
          </span>
          <select
            className={inputClass}
            value={qualification}
            onChange={(event) => { setQualification(event.target.value); setBoard("all"); setTopic("all"); setPage(1); }}
          >
            <option value="all">All</option>
            {[...new Set(subjectQuestions.map((q) => q.qualification))]
              .sort()
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Exam board</span>
          <select
            className={inputClass}
            value={board}
            onChange={(event) => { setBoard(event.target.value); setTopic("all"); setPage(1); }}
          >
            <option value="all">All</option>
            {[...new Set(subjectQuestions
                .filter(
                  (q) =>
                    qualification === "all" ||
                    normaliseFilter(q.qualification) ===
                      normaliseFilter(qualification)
                )
                .map((q) => q.examBoard))]
              .sort()
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Difficulty</span>
          <select
            className={inputClass}
            value={difficulty}
            onChange={(event) => { setDifficulty(event.target.value); setPage(1); }}
          >
            <option value="all">All</option>
            <option value="foundation">Foundation</option>
            <option value="standard">Standard</option>
            <option value="higher">Higher</option>
          </select>
        </label>
      </section>

            <section className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold">Topic</span>
          <select
            className={inputClass}
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All topics</option>
            {availableTopics.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">
            Questions per page
          </span>
          <select
            className={inputClass}
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </section>
<div className="flex justify-end">
  <button
    type="button"
    onClick={() => {
      setSearch("");
      setQualification("all");
      setBoard("all");
      setDifficulty("all");
      setTopic("all");
      setPage(1);
      setMessage("Question filters cleared.");
    }}
    className="inline-flex h-10 w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
  >
    Reset Filters
  </button>
</div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-3">
          <h2 className="text-xl font-black">
            Questions ({visible.length})
          </h2>

          {loading && <p>Loading questions...</p>}

          {!loading && visible.length === 0 && (
            <p className="rounded-xl border bg-white p-6">
              No matching saved questions.
            </p>
          )}

          {pageQuestions.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer gap-4 rounded-2xl border bg-white p-5"
            >
              <input
                type="checkbox"
                checked={selected.some((q) => q.key === item.key)}
                onChange={() => addOrRemove(item)}
                className="mt-1"
              />

              <span className="min-w-0">
                <span className="block text-xs font-bold text-indigo-700">
                  {item.qualification} | {item.examBoard} |{" "}
                  {canonicalTopic(item.question.topic)} | {item.question.marks} marks
                </span>

                <span className="mt-2 block whitespace-pre-wrap text-sm">
                  {item.question.question}
                </span>

                {getQuestionQualityWarnings(item).map((warning) => (
                  <span
                    key={warning}
                    className="mt-2 block rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900"
                  >
                    Teacher review recommended: {warning}
                  </span>
                ))}
                <span className="mt-3 block text-xs text-slate-500">
                  {item.sourceTitle}
                </span>
              </span>
            </label>
          ))}
          {visible.length > 0 && (
            <nav
              aria-label="Question pages"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
            >
              <p className="text-sm text-slate-600">
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, visible.length)} of{" "}
                {visible.length} questions
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </section>



        <aside className="h-fit space-y-4 rounded-2xl border bg-white p-5 lg:sticky lg:top-6">
          <h2 className="text-xl font-black">Your Paper</h2>

          <p className="font-bold">
            {selected.length} questions | {marks} marks
          </p>

          <p className="text-sm text-slate-600">
            Reviewed: {reviewedCount}/{selected.length}
          </p>

          {editingId && (
            <p className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">
              Editing saved draft: {editingId}
            </p>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-bold">
              Paper title
            </span>

            <input
              className={inputClass}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setDirty(true);
              }}
            />
          </label>

          <div className="max-h-96 space-y-3 overflow-auto">
            {selected.map((item, index) => (
              <div key={item.key} className="border-b pb-3 text-sm">
                <p className="font-bold">
                  {index + 1}. {canonicalTopic(item.question.topic)} (
                  {item.question.marks} marks)
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveQuestion(index, -1)}
                    className="rounded border px-2 py-1 disabled:opacity-40"
                  >
                    Up
                  </button>

                  <button
                    type="button"
                    disabled={index === selected.length - 1}
                    onClick={() => moveQuestion(index, 1)}
                    className="rounded border px-2 py-1 disabled:opacity-40"
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => addOrRemove(item)}
                    className="rounded border px-2 py-1 text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <label className="mt-2 block">
                  <span className="mb-1 block text-xs">
                    Teacher review
                  </span>

                  <select
                    className={inputClass}
                    value={review[item.key]?.status ?? "pending"}
                    onChange={(event) =>
                      updateReview(
                        item.key,
                        event.target.value as
                          | "pending"
                          | "reviewed"
                          | "needs-changes",
                      )
                    }
                  >
                    <option value="pending">Pending review</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="needs-changes">Needs changes</option>
                  </select>
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={!selected.length || saving || !user}
            onClick={() => void savePaper()}
            className="w-full rounded-xl bg-indigo-700 p-3 font-bold text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Draft"
                : "Save Paper"}
          </button>

          <button
            type="button"
            disabled={!selected.length}
            onClick={() => printPaper(false)}
            className="w-full rounded-xl border p-3 font-bold disabled:opacity-50"
          >
            Print Question Paper
          </button>

          <button
            type="button"
            disabled={!selected.length}
            onClick={() => printPaper(true)}
            className="w-full rounded-xl border p-3 font-bold disabled:opacity-50"
          >
            Print Mark Scheme
          </button>

          <p className="text-xs text-slate-500">
            Review all questions and mark schemes before distribution.
            Printing uses your browser&apos;s Save as PDF option.
          </p>
        </aside>
      </div>
    </main>
  );
}
