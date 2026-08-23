"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Copy,
  FileQuestion,
  Filter,
  Loader2,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  deleteTeacherContent,
  duplicateTeacherContent,
  getTeacherContentLibrary,
  teacherContentKindLabel,
  updateTeacherContentLifecycle,
} from "@/services/teacherContentLibraryService";
import type {
  TeacherContentItem,
  TeacherContentKind,
  TeacherContentLifecycle,
} from "@/types/teacherContent";

type KindFilter = "all" | TeacherContentKind;
type LifecycleFilter = "all" | TeacherContentLifecycle;

function formatQualification(value: string): string {
  return value === "A_LEVEL" ? "A Level" : value || "Not set";
}

function formatDate(value: Date | null): string {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function lifecycleTone(value: TeacherContentLifecycle): string {
  if (value === "published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value === "archived") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function kindIcon(kind: TeacherContentKind): ReactNode {
  if (kind === "teaching-resource") return <BookOpen className="h-4 w-4" />;
  if (kind === "ai-quiz") return <Sparkles className="h-4 w-4" />;
  return <FileQuestion className="h-4 w-4" />;
}

export default function TeacherContentHubPage() {
  const { user, loading: authLoading, profileReady } = useAuth();
  const [items, setItems] = useState<TeacherContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleFilter>("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [examBoardFilter, setExamBoardFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState("");

  const load = useCallback(async () => {
    const teacherId = user?.uid;
    if (!teacherId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setItems(await getTeacherContentLibrary(teacherId));
    } catch (caughtError) {
      console.error("Unable to load teacher content library:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The Content Hub could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (authLoading || !profileReady) return;
    void load();
  }, [authLoading, profileReady, load]);

  const qualifications = useMemo(
    () => Array.from(new Set(items.map((item) => item.qualification).filter(Boolean))).sort(),
    [items],
  );
  const examBoards = useMemo(
    () => Array.from(new Set(items.map((item) => item.examBoard).filter(Boolean))).sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        [
          item.title,
          item.description,
          item.topic,
          item.examBoard,
          item.yearGroup,
          teacherContentKindLabel(item.kind),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);
      return (
        matchesSearch &&
        (kindFilter === "all" || item.kind === kindFilter) &&
        (lifecycleFilter === "all" || item.lifecycle === lifecycleFilter) &&
        (qualificationFilter === "all" || item.qualification === qualificationFilter) &&
        (examBoardFilter === "all" || item.examBoard === examBoardFilter)
      );
    });
  }, [items, searchTerm, kindFilter, lifecycleFilter, qualificationFilter, examBoardFilter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      draft: items.filter((item) => item.lifecycle === "draft").length,
      published: items.filter((item) => item.lifecycle === "published").length,
      archived: items.filter((item) => item.lifecycle === "archived").length,
    }),
    [items],
  );

  async function changeLifecycle(item: TeacherContentItem, lifecycle: TeacherContentLifecycle) {
    try {
      setUpdatingKey(item.key);
      await updateTeacherContentLifecycle(item, lifecycle);
      toast.success(
        lifecycle === "published"
          ? "Content published."
          : lifecycle === "archived"
            ? "Content archived."
            : "Content returned to draft.",
      );
      await load();
    } catch (caughtError) {
      toast.error(caughtError instanceof Error ? caughtError.message : "Content status could not be changed.");
    } finally {
      setUpdatingKey("");
    }
  }

  async function duplicate(item: TeacherContentItem) {
    const teacherId = user?.uid;
    if (!teacherId) return;
    try {
      setUpdatingKey(item.key);
      await duplicateTeacherContent(item, teacherId);
      toast.success("Draft copy created.");
      await load();
    } catch (caughtError) {
      toast.error(caughtError instanceof Error ? caughtError.message : "The content could not be duplicated.");
    } finally {
      setUpdatingKey("");
    }
  }

  async function remove(item: TeacherContentItem) {
    if (item.lifecycle !== "archived") {
      toast.error("Archive content before deleting it.");
      return;
    }
    if (!window.confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) return;
    try {
      setUpdatingKey(item.key);
      await deleteTeacherContent(item);
      toast.success("Archived content deleted.");
      await load();
    } catch (caughtError) {
      toast.error(caughtError instanceof Error ? caughtError.message : "The content could not be deleted.");
    } finally {
      setUpdatingKey("");
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setKindFilter("all");
    setLifecycleFilter("all");
    setQualificationFilter("all");
    setExamBoardFilter("all");
  }

  if (authLoading || !profileReady || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-52 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-800 via-violet-800 to-fuchsia-700 p-7 text-white shadow-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-100">T1F · Teacher Content</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Content Hub</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-violet-100">
              Manage teacher-created resources, AI quizzes and original exam question sets in one lifecycle-aware library.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/teacher/assistant" className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white">Create Resource</Link>
            <Link href="/teacher/quiz-generator" className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white">Generate Quiz</Link>
            <Link href="/teacher/exam-question-generator" className="rounded-xl bg-white px-4 py-3 text-sm font-black text-violet-800">Generate Exam Questions</Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary label="All content" value={counts.total} />
        <Summary label="Draft" value={counts.draft} />
        <Summary label="Published" value={counts.published} />
        <Summary label="Archived" value={counts.archived} />
      </div>

      <Card className="rounded-3xl border border-slate-200 p-6">
        <div className="grid gap-3 xl:grid-cols-[1.6fr_repeat(4,minmax(150px,auto))_auto]">
          <label className="relative">
            <span className="sr-only">Search teacher content</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search title, topic, board or description..." className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm" />
          </label>
          <FilterSelect value={kindFilter} onChange={(v) => setKindFilter(v as KindFilter)}>
            <option value="all">All types</option><option value="teaching-resource">Teaching resources</option><option value="ai-quiz">AI quizzes</option><option value="exam-paper">Exam question sets</option>
          </FilterSelect>
          <FilterSelect value={lifecycleFilter} onChange={(v) => setLifecycleFilter(v as LifecycleFilter)}>
            <option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
          </FilterSelect>
          <FilterSelect value={qualificationFilter} onChange={setQualificationFilter}>
            <option value="all">All qualifications</option>{qualifications.map((v) => <option key={v} value={v}>{formatQualification(v)}</option>)}
          </FilterSelect>
          <FilterSelect value={examBoardFilter} onChange={setExamBoardFilter}>
            <option value="all">All boards</option>{examBoards.map((v) => <option key={v} value={v}>{v}</option>)}
          </FilterSelect>
          <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700"><RefreshCcw className="h-4 w-4" />Clear</button>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Showing <span className="font-black text-slate-900">{filteredItems.length}</span> of <span className="font-black text-slate-900">{items.length}</span></p>
      </Card>

      {error ? (
        <Card className="border border-red-200 bg-red-50"><p className="font-black text-red-800">Content Hub unavailable</p><p className="mt-2 text-sm text-red-700">{error}</p></Card>
      ) : filteredItems.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 p-12 text-center"><BookOpen className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-black text-slate-950">No content matches</h2><p className="mt-2 text-sm text-slate-500">Create content or change the filters above.</p></Card>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {filteredItems.map((item) => {
            const busy = updatingKey === item.key;
            return (
              <article key={item.key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">{kindIcon(item.kind)}{teacherContentKindLabel(item.kind)}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${lifecycleTone(item.lifecycle)}`}>{item.lifecycle}</span>
                  {item.examBoard && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{item.examBoard}</span>}
                  {item.qualification && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{formatQualification(item.qualification)}</span>}
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm font-bold text-indigo-700">{item.topic || "Topic not tagged"}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniMetric label="Questions" value={item.questionCount ?? "—"} />
                  <MiniMetric label="Marks" value={item.totalMarks ?? "—"} />
                  <MiniMetric label="Difficulty" value={item.difficulty || "—"} />
                  <MiniMetric label="Updated" value={formatDate(item.updatedAt || item.createdAt)} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link href={item.openHref} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">Open</Link>
                  {item.assignHref && <Link href={item.assignHref} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white"><Send className="h-4 w-4" />Assign</Link>}
                  <button type="button" disabled={busy} onClick={() => void duplicate(item)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 disabled:opacity-50"><Copy className="h-4 w-4" />Duplicate</button>
                  {item.lifecycle === "draft" ? (
                    <button type="button" disabled={busy} onClick={() => void changeLifecycle(item, "published")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700 disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Publish</button>
                  ) : item.lifecycle === "published" ? (
                    <>
                      <button type="button" disabled={busy} onClick={() => void changeLifecycle(item, "draft")} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-black text-amber-700 disabled:opacity-50">Return to draft</button>
                      <button type="button" disabled={busy} onClick={() => void changeLifecycle(item, "archived")} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 disabled:opacity-50"><Archive className="h-4 w-4" />Archive</button>
                    </>
                  ) : (
                    <>
                      <button type="button" disabled={busy} onClick={() => void changeLifecycle(item, "draft")} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-black text-indigo-700 disabled:opacity-50">Restore draft</button>
                      <button type="button" disabled={busy} onClick={() => void remove(item)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}Delete</button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <Card className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
        <p className="font-black text-cyan-950">Built-in curriculum content</p>
        <p className="mt-2 text-sm leading-6 text-cyan-900">CS Master lessons and programming challenges remain platform content. They are assignable through the Assignment Wizard but are not archived or deleted from a teacher-owned library.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/teacher/assignment-wizard" className="rounded-xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">Assign built-in content</Link>
          <Link href="/teacher/resources" className="rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm font-black text-cyan-800">Resource Library</Link>
          <Link href="/teacher/quiz-library" className="rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm font-black text-cyan-800">Quiz Library</Link>
          <Link href="/teacher/question-bank" className="rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm font-black text-cyan-800">Question Bank</Link>
        </div>
      </Card>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <Card className="rounded-3xl border border-slate-200 p-5"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></Card>;
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-black capitalize text-slate-900">{value}</p></div>;
}

function FilterSelect({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="relative">
      <span className="sr-only">Content filter</span>
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm">{children}</select>
    </label>
  );
}
