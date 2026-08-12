"use client";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  Loader2,
  Tag,
  Target,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import type { SavedTeacherResource } from "@/services/teacherResourceService";

type FirestoreTeacherResource = Omit<
  SavedTeacherResource,
  "id" | "createdAt" | "updatedAt"
> & {
  createdAt?: {
    toDate?: () => Date;
  };
  updatedAt?: {
    toDate?: () => Date;
  };
};

function convertTimestamp(
  value:
    | FirestoreTeacherResource["createdAt"]
    | FirestoreTeacherResource["updatedAt"],
): Date | null {
  if (value && typeof value.toDate === "function") {
    return value.toDate();
  }

  return null;
}

function formatResourceType(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function BulletList({
  items,
  emptyMessage = "No information was provided.",
}: {
  items: string[];
  emptyMessage?: string;
}) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 text-sm leading-7 text-slate-700"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContentCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function ResourceSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />

      <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-60 animate-pulse rounded-3xl bg-white" />
        <div className="h-60 animate-pulse rounded-3xl bg-white" />
      </div>

      <div className="h-96 animate-pulse rounded-3xl bg-white" />
    </main>
  );
}

export default function StudentResourcePage() {
  const params = useParams<{
    resourceId: string;
  }>();

  const { user } = useAuth();

  const resourceId = params.resourceId;

  const [resource, setResource] = useState<SavedTeacherResource | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState(0);

  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  const loadResource = useCallback(async () => {
    if (!user?.uid || !resourceId) {
      setResource(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const resourceReference = doc(db, "teacherResources", resourceId);

      const snapshot = await getDoc(resourceReference);

      if (!snapshot.exists()) {
        setResource(null);
        setError("This teaching resource could not be found.");
        return;
      }

      const data = snapshot.data() as FirestoreTeacherResource;

      if (data.status !== "published") {
        setResource(null);
        setError("This resource is no longer available to students.");
        return;
      }

      setResource({
        id: snapshot.id,
        teacherId: data.teacherId,
        sourceResourceId: data.sourceResourceId,
        title: data.title,
        topic: data.topic,
        resourceType: data.resourceType,
        yearGroup: data.yearGroup,
        examBoard: data.examBoard,
        duration: data.duration,
        difficulty: data.difficulty,
        content: data.content,
        status: data.status,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      });
    } catch (caughtError) {
      console.error("Unable to load student resource:", caughtError);

      setResource(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The teaching resource could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [resourceId, user?.uid]);

  useEffect(() => {
    void loadResource();
  }, [loadResource]);

  const sectionCount = resource?.content.sections.length ?? 0;

  const currentSection = useMemo(() => {
    if (!resource || sectionCount === 0) {
      return null;
    }

    return resource.content.sections[activeSection];
  }, [activeSection, resource, sectionCount]);

  function goToPreviousSection() {
    setActiveSection((current) => Math.max(current - 1, 0));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToNextSection() {
    setActiveSection((current) => Math.min(current + 1, sectionCount - 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function toggleAnswer(index: number) {
    setShowAnswers((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  if (loading) {
    return <ResourceSkeleton />;
  }

  if (!resource || error) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assignments
        </Link>

        <section className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-red-950">
            Resource unavailable
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-red-800">
            {error || "This teaching resource could not be found."}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadResource();
            }}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const content = resource.content;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/assignments"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assignment
        </Link>

        {sectionCount > 0 && (
          <p className="text-sm font-semibold text-slate-500">
            Section {activeSection + 1} of {sectionCount}
          </p>
        )}
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-xl sm:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                {formatResourceType(resource.resourceType)}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                {resource.yearGroup}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                {resource.examBoard}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold capitalize backdrop-blur">
                {resource.difficulty}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              {resource.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">
              {content.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {resource.duration}
              </span>

              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {resource.topic}
              </span>

              <span className="inline-flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                {content.assessmentQuestions.length} assessment questions
              </span>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur xl:w-72">
            <p className="text-sm font-black">Lesson progress</p>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{
                  width:
                    sectionCount > 0
                      ? `${((activeSection + 1) / sectionCount) * 100}%`
                      : "100%",
                }}
              />
            </div>

            <p className="mt-3 text-sm text-blue-100">
              {sectionCount > 0
                ? `${Math.round(
                    ((activeSection + 1) / sectionCount) * 100,
                  )}% through the lesson`
                : "Lesson overview"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Learning objectives"
          description="What you should know or be able to do"
          icon={<Target className="h-5 w-5" />}
        >
          <BulletList items={content.learningObjectives} />
        </ContentCard>

        <ContentCard
          title="Success criteria"
          description="How you will know you have succeeded"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <BulletList items={content.successCriteria} />
        </ContentCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Prior knowledge"
          description="What you should already understand"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <BulletList
            items={content.priorKnowledge}
            emptyMessage="No specific prior knowledge is required."
          />
        </ContentCard>

        <ContentCard
          title="Key vocabulary"
          description="Important terms for this lesson"
          icon={<Tag className="h-5 w-5" />}
        >
          {content.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No key vocabulary was provided.
            </p>
          )}
        </ContentCard>
      </div>

      {currentSection && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-50 p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-black text-white">
                  {activeSection + 1}
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Lesson section
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {currentSection.title}
                  </h2>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
                <Clock3 className="h-4 w-4" />
                {currentSection.duration}
              </span>
            </div>
          </header>

          <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h3 className="text-lg font-black text-blue-950">Explanation</h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                {currentSection.teacherInstructions}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <h3 className="text-lg font-black text-emerald-950">Your task</h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                {currentSection.studentTask}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <h3 className="text-lg font-black text-violet-950">
                Check your understanding
              </h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                {currentSection.assessment}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <h3 className="text-lg font-black text-amber-950">
                Resources required
              </h3>

              <div className="mt-3">
                <BulletList
                  items={currentSection.resources}
                  emptyMessage="No additional resources are required."
                />
              </div>
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goToPreviousSection}
              disabled={activeSection === 0}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous section
            </button>

            {activeSection < sectionCount - 1 ? (
              <button
                type="button"
                onClick={goToNextSection}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Next section
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href="#assessment"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Go to assessment
                <ChevronDown className="h-4 w-4" />
              </a>
            )}
          </footer>
        </section>
      )}

      <ContentCard
        title="Common misconceptions"
        description="Errors to avoid during this lesson"
        icon={<AlertCircle className="h-5 w-5" />}
      >
        {content.misconceptions.length > 0 ? (
          <div className="space-y-4">
            {content.misconceptions.map((item, index) => (
              <article
                key={`${item.misconception}-${index}`}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <h3 className="font-black text-amber-950">
                  Watch out for this
                </h3>

                <p className="mt-2 text-sm leading-7 text-amber-900">
                  {item.misconception}
                </p>

                <h4 className="mt-4 font-black text-emerald-900">
                  Correct understanding
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {item.correction}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No common misconceptions were provided.
          </p>
        )}
      </ContentCard>

      <section
        id="assessment"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <FileQuestion className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Assessment questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Attempt each question before revealing the model answer.
            </p>
          </div>
        </div>

        {content.assessmentQuestions.length > 0 ? (
          <div className="mt-6 space-y-5">
            {content.assessmentQuestions.map((question, index) => {
              const answerVisible = Boolean(showAnswers[index]);

              return (
                <article
                  key={`${question.question}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-sm font-black text-white">
                          {index + 1}
                        </span>

                        <p className="text-sm font-bold leading-7 text-slate-950">
                          {question.question}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                        {question.marks}{" "}
                        {question.marks === 1 ? "mark" : "marks"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <button
                      type="button"
                      onClick={() => toggleAnswer(index)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
                    >
                      {answerVisible
                        ? "Hide model answer"
                        : "Reveal model answer"}
                    </button>

                    {answerVisible && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                          Model answer
                        </p>

                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                          {question.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No assessment questions were provided.
          </p>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Homework"
          description="Complete this after the lesson"
          icon={<GraduationCap className="h-5 w-5" />}
        >
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {content.homework || "No homework was provided."}
          </p>
        </ContentCard>

        <ContentCard
          title="Final reminder"
          description="Before returning to your assignment"
          icon={<Lightbulb className="h-5 w-5" />}
        >
          <p className="text-sm leading-7 text-slate-700">
            Check that you have completed each task and attempted the assessment
            questions. Return to the assignment page when you are ready to mark
            the work complete.
          </p>
        </ContentCard>
      </div>

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-blue-600" />

        <h2 className="mt-3 text-xl font-black text-blue-950">
          Finished the resource?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-blue-800">
          Return to your assignment and mark it as completed after finishing all
          required work.
        </p>

        <Link
          href="/assignments"
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Return to assignments
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
