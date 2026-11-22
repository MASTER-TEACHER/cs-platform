"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PrintControls from "@/components/student-question-bank/PrintControls";

type Question = {
  id: string;
  subject: string;
  qualification: string;
  examBoard: string;
  topic: string;
  prompt: string;
  context: string;
  marks: number;
  difficulty: string;
};

type Feedback = {
  questionId: string;
  answer: string;
  modelAnswer: string;
  markingPoints: string[];
  guidance: string[];
  teacherReviewRequired: boolean;
  awardedMarks: number | null;
  maxMarks?: number | null;
  aiFeedback?: string;
  aiImprovement?: string;
  markingStatus?: string;
};

type Attempt = {
  id: string;
  questionCount: number;
  markingStatus: string;
  totalAwarded?: number | null;
  totalAvailable?: number | null;
  createdAt: string | null;
};

const PAGE_SIZE = 20;

export default function StudentQuestionBankPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState("COMPUTER_SCIENCE");
  const [qualification, setQualification] = useState("");
  const [board, setBoard] = useState("");
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [practising, setPractising] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && profile && profile.role !== "student") {
      router.replace("/teacher");
    }
  }, [loading, user, profile, router]);

  async function requestApi(path: string, options?: RequestInit) {
    if (!user) throw new Error("Please sign in.");
    const token = await user.getIdToken();

    const response = await fetch(path, {
      ...options,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options?.body ? { "Content-Type": "application/json" } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    return data;
  }

  useEffect(() => {
    if (!user || profile?.role !== "student") return;
    let cancelled = false;

    async function load() {
      try {
        const token = await user!.getIdToken();
        const [qResponse, hResponse] = await Promise.all([
          fetch("/api/student-question-bank/questions", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch("/api/student-question-bank/history", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        if (!qResponse.ok || !hResponse.ok) {
          throw new Error("Unable to load student practice.");
        }

        const q = await qResponse.json();
        const h = await hResponse.json();

        if (!cancelled) {
          setQuestions(q.questions || []);
          setHistory(h.attempts || []);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Load failed.");
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [user, profile]);

  const subjectQuestions = useMemo(
    () => questions.filter(q => q.subject === subject),
    [questions, subject]
  );

  const qualifications = [...new Set(
    subjectQuestions.map(q => q.qualification)
  )].sort();

  const qualificationQuestions = subjectQuestions.filter(
    q => !qualification || q.qualification === qualification
  );

  const boards = [...new Set(
    qualificationQuestions.map(q => q.examBoard)
  )].sort();

  const boardQuestions = qualificationQuestions.filter(
    q => !board || q.examBoard === board
  );

  const topics = [...new Set(
    boardQuestions.map(q => q.topic)
  )].sort();

  const filtered = boardQuestions.filter(q => {
    const matchesTopic = !topic || q.topic === topic;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      `${q.topic} ${q.prompt} ${q.context}`.toLowerCase().includes(term);

    return matchesTopic && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const active = selected
    .map(id => questions.find(q => q.id === id))
    .filter((q): q is Question => Boolean(q));

  const totalMarks = active.reduce((sum, q) => sum + q.marks, 0);

  function resetSelection() {
    setSelected([]);
    setAnswers({});
    setFeedback([]);
    setPractising(false);
    setMessage("");
  }

  function changeFilters() {
    setPage(1);
    resetSelection();
  }

  function toggleQuestion(id: string, checked: boolean) {
    if (checked && selected.length >= 10) {
      setMessage("Maximum 10 questions per practice session.");
      return;
    }

    setMessage("");
    setSelected(previous => checked
      ? [...previous, id]
      : previous.filter(item => item !== id)
    );
  }

  async function submit() {
    if (!active.length || busy || feedback.length > 0) return;

    setBusy(true);
    setMessage("");

    try {
      const result = await requestApi(
        "/api/student-question-bank/submit",
        {
          method: "POST",
          body: JSON.stringify({
            answers: active.map(q => ({
              questionId: q.id,
              answer: answers[q.id] || "",
            })),
          }),
        }
      );

      setFeedback(result.feedback || []);
      setMessage(result.message || "Submission saved.");

      try {
        const h = await requestApi("/api/student-question-bank/history");
        setHistory(h.attempts || []);
      } catch {
        setMessage("Answers saved. Practice history could not be refreshed.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !profile || !user) {
    return <main className="p-8">Loading student practice...</main>;
  }

  if (profile.role !== "student") return null;

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header>
        <Link href="/dashboard" className="text-sm underline">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Student Question Bank</h1>
        <p className="mt-2 text-sm text-gray-500">
          Build a practice paper, answer questions and review feedback.
          Answers get an instant AI practice mark with feedback. Practice marks are not official examination results.
        </p>
      </header>

      {message && (
        <p role="status" className="rounded-lg border p-3">
          {message}
        </p>
      )}

      {!practising ? (
        <>
          <section className="grid gap-3 rounded-xl border p-4 md:grid-cols-5">
            <label className="space-y-1">
              <span className="text-sm">Subject</span>
              <select
                className="w-full rounded border p-2 text-black"
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  setQualification("");
                  setBoard("");
                  setTopic("");
                  changeFilters();
                }}
              >
                <option value="COMPUTER_SCIENCE">Computer Science</option>
                <option value="CREATIVE_IMEDIA">Creative iMedia</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm">Qualification</span>
              <select
                className="w-full rounded border p-2 text-black"
                value={qualification}
                onChange={e => {
                  setQualification(e.target.value);
                  setBoard("");
                  setTopic("");
                  changeFilters();
                }}
              >
                <option value="">All qualifications</option>
                {qualifications.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm">Exam board</span>
              <select
                className="w-full rounded border p-2 text-black"
                value={board}
                onChange={e => {
                  setBoard(e.target.value);
                  setTopic("");
                  changeFilters();
                }}
              >
                <option value="">All boards</option>
                {boards.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm">Topic</span>
              <select
                className="w-full rounded border p-2 text-black"
                value={topic}
                onChange={e => {
                  setTopic(e.target.value);
                  changeFilters();
                }}
              >
                <option value="">All topics</option>
                {topics.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm">Search</span>
              <input
                className="w-full rounded border p-2 text-black"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Question or keyword"
              />
            </label>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <section className="min-w-0 space-y-3">
              <h2 className="text-xl font-semibold">
                Available questions ({filtered.length})
              </h2>

              {visible.map(q => (
                <label key={q.id} className="flex gap-3 rounded-lg border p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(q.id)}
                    onChange={e => toggleQuestion(q.id, e.target.checked)}
                  />
                  <span className="min-w-0">
                    <strong>{q.topic}</strong>
                    <span className="ml-2 text-sm text-gray-500">
                      {q.marks} marks | {q.difficulty}
                    </span>
                    <span className="mt-1 block whitespace-pre-wrap">
                      {q.prompt}
                    </span>
                  </span>
                </label>
              ))}

              {filtered.length === 0 && (
                <p className="rounded-lg border p-4">No matching questions.</p>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded border px-4 py-2 disabled:opacity-40"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="rounded border px-4 py-2 disabled:opacity-40"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </section>

            <aside className="space-y-4 rounded-xl border p-4 lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold">Your Practice Paper</h2>
              <p className="text-sm">
                {active.length} / 10 questions | {totalMarks} marks
              </p>

              {active.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Select questions to build your practice paper.
                </p>
              ) : (
                <ol className="space-y-2">
                  {active.map((q, index) => (
                    <li key={q.id} className="flex items-start justify-between gap-2 rounded border p-2">
                      <span className="text-sm">
                        {index + 1}. {q.topic} ({q.marks} marks)
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove question ${index + 1}`}
                        onClick={() => toggleQuestion(q.id, false)}
                        className="text-sm underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <button
                type="button"
                disabled={active.length === 0}
                onClick={() => {
                  setPractising(true);
                  setMessage("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full rounded bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-40"
              >
                Start Practice
              </button>

              <PrintControls questions={active} feedback={[]} />

              {active.length > 0 && (
                <button
                  type="button"
                  onClick={resetSelection}
                  className="text-sm underline"
                >
                  Clear paper
                </button>
              )}
            </aside>
          </div>
        </>
      ) : (
        <section className="space-y-5 rounded-xl border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Practice Session
              </h2>
              <p className="text-sm text-gray-500">
                {active.length} questions | {totalMarks} marks
              </p>
            </div>

            {feedback.length === 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setPractising(false)}
                className="rounded border px-4 py-2 disabled:opacity-40"
              >
                Back to paper builder
              </button>
            )}
          </div>

          <PrintControls questions={active} feedback={feedback} />

          {active.map((q, index) => {
            const review = feedback.find(f => f.questionId === q.id);

            return (
              <article key={q.id} className="space-y-3 border-b pb-5">
                <h3 className="font-semibold">
                  Question {index + 1} - {q.topic} ({q.marks} marks)
                </h3>
                {q.context && (
                  <p className="whitespace-pre-wrap text-sm">{q.context}</p>
                )}
                <p className="whitespace-pre-wrap">{q.prompt}</p>
                <textarea
                  className="min-h-32 w-full rounded border p-3 text-black"
                  aria-label={`Answer for question ${index + 1}`}
                  placeholder="Write your answer..."
                  value={answers[q.id] || ""}
                  disabled={feedback.length > 0 || busy}
                  onChange={e => setAnswers(previous => ({
                    ...previous,
                    [q.id]: e.target.value,
                  }))}
                />

                {review && review.awardedMarks !== null && (
                  <div className="space-y-2 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                    <h4 className="font-semibold">
                      Practice mark: {review.awardedMarks}/{review.maxMarks ?? q.marks}
                    </h4>
                    {review.aiFeedback && <p className="whitespace-pre-wrap text-sm">{review.aiFeedback}</p>}
                    {review.aiImprovement && <p className="whitespace-pre-wrap text-sm"><strong>Next time:</strong> {review.aiImprovement}</p>}
                    <p className="text-xs text-slate-600">Instant AI practice mark. Check it against the mark scheme below; your teacher&apos;s marks are the ones that count.</p>
                  </div>
                )}

                {review && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <h4 className="font-semibold">{review.awardedMarks !== null ? "Mark scheme" : "Self-review guidance"}</h4>
                    {review.modelAnswer && (
                      <p className="whitespace-pre-wrap">
                        Model answer: {review.modelAnswer}
                      </p>
                    )}
                    {review.markingPoints.length > 0 && (
                      <ul className="list-disc pl-5">
                        {review.markingPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {review.guidance.length > 0 && (
                      <ul className="list-disc pl-5">
                        {review.guidance.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {review.teacherReviewRequired && (
                      <p className="text-sm">
                        Teacher review is required for formal assessment.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {feedback.length === 0 ? (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={busy}
              className="rounded bg-blue-700 px-5 py-3 text-white disabled:opacity-50"
            >
              {busy ? "Submitting..." : "Submit answers"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                resetSelection();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded bg-blue-700 px-5 py-3 text-white"
            >
              Build another paper
            </button>
          )}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent practice history</h2>
        {history.length === 0 && <p>No attempts yet.</p>}
        {history.map(item => (
          <div key={item.id} className="rounded-lg border p-3">
            <strong>{item.questionCount} questions</strong>
            <span className="ml-3 text-sm">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "Recently submitted"}
            </span>
            <p className="text-sm">
              {item.markingStatus !== "self-review" && typeof item.totalAwarded === "number" && item.totalAvailable
                ? `Practice mark: ${item.totalAwarded}/${item.totalAvailable}${item.markingStatus === "partly-ai-marked" ? " (some answers self-reviewed)" : ""}`
                : "Self-review completed"}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}