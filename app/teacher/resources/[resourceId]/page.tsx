"use client";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  Loader2,
  Pencil,
  RefreshCcw,
  Send,
  Tag,
  Target,
  Users,
} from "lucide-react";

import { onAuthStateChanged, User } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";

import { SavedTeacherResource } from "@/services/teacherResourceService";
import ResourcePublishControls from "@/components/teacher/resources/ResourcePublishControls";
import ExportMenu from "@/components/teacher/resources/ExportMenu";
import AssignResourceModal from "@/components/teacher/resources/AssignResourceModal";

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
  value: FirestoreTeacherResource["createdAt"],
): Date | null {
  if (value && typeof value.toDate === "function") {
    return value.toDate();
  }

  return null;
}

function formatDate(value: Date | null): string {
  if (!value) {
    return "Recently saved";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
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
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
          />

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function ResourceViewerSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />

      <div className="animate-pulse rounded-3xl bg-slate-200 p-8">
        <div className="h-6 w-48 rounded bg-slate-300" />
        <div className="mt-6 h-10 w-2/3 rounded bg-slate-300" />
        <div className="mt-5 h-5 w-full max-w-3xl rounded bg-slate-300" />
        <div className="mt-3 h-5 w-3/4 rounded bg-slate-300" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="mt-6 space-y-3">
              <div className="h-4 rounded bg-slate-100" />
              <div className="h-4 rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function TeacherResourceViewerPage() {
  const params = useParams<{
    resourceId: string;
  }>();

  const router = useRouter();

  const resourceId = params.resourceId;

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [resource, setResource] = useState<SavedTeacherResource | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadResource = useCallback(async () => {
    if (!currentUser || !resourceId) {
      setResource(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resourceReference = doc(db, "teacherResources", resourceId);

      const resourceSnapshot = await getDoc(resourceReference);

      if (!resourceSnapshot.exists()) {
        setResource(null);
        setError("This teaching resource could not be found.");
        return;
      }

      const data = resourceSnapshot.data() as FirestoreTeacherResource;

      if (data.teacherId !== currentUser.uid) {
        setResource(null);
        setError("You do not have permission to view this resource.");
        return;
      }

      setResource({
        id: resourceSnapshot.id,
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
      console.error("Failed to load teacher resource:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The teaching resource could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, resourceId]);

  useEffect(() => {
    if (!authLoading) {
      void loadResource();
    }
  }, [authLoading, loadResource]);

  if (authLoading || loading) {
    return <ResourceViewerSkeleton />;
  }

  if (error || !resource || !currentUser) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/teacher/resources"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resource Library
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-red-950">
            Resource unavailable
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-red-800">
            {error || "This teaching resource could not be found."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadResource()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </button>

            <button
              type="button"
              onClick={() => router.push("/teacher/resources")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <BookOpen className="h-4 w-4" />
              Resource Library
            </button>
          </div>
        </div>
      </main>
    );
  }

  const content = resource.content;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/teacher/resources"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resource Library
        </Link>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <button
            type="button"
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            disabled={resource.status !== "published"}
            title={
              resource.status === "published"
                ? "Assign this resource to a class"
                : "Publish this resource before assigning it"
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            <Send className="h-4 w-4" />
            Assign to class
          </button>

          <Link
            href={`/teacher/resources/${resource.id}/edit`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Pencil className="h-4 w-4" />
            Edit resource
          </Link>

          <ExportMenu resource={resource} />

          <ResourcePublishControls
            resourceId={resource.id}
            status={resource.status}
            content={resource.content}
            onStatusChange={(newStatus) => {
              setResource((current) => {
                if (!current) {
                  return current;
                }

                return {
                  ...current,
                  status: newStatus,
                  updatedAt: new Date(),
                };
              });
            }}
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
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

              <span
                className={
                  resource.status === "published"
                    ? "rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold capitalize text-emerald-50 backdrop-blur"
                    : "rounded-full bg-amber-300/20 px-3 py-1 text-xs font-bold capitalize text-amber-50 backdrop-blur"
                }
              >
                {resource.status}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {resource.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-indigo-50 sm:text-base">
              {content.overview}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-indigo-50">
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

          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
            <p className="font-bold text-white">Resource details</p>

            <dl className="mt-3 space-y-2 text-indigo-50">
              <div className="flex justify-between gap-8">
                <dt>Sections</dt>
                <dd className="font-bold text-white">
                  {content.sections.length}
                </dd>
              </div>

              <div className="flex justify-between gap-8">
                <dt>Saved</dt>
                <dd className="font-bold text-white">
                  {formatDate(resource.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Learning objectives"
          description="What students should know or be able to do"
          icon={<Target className="h-5 w-5" />}
        >
          <BulletList items={content.learningObjectives} />
        </ContentCard>

        <ContentCard
          title="Success criteria"
          description="How successful learning will be demonstrated"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <BulletList items={content.successCriteria} />
        </ContentCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Prior knowledge"
          description="Knowledge students should already possess"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <BulletList
            items={content.priorKnowledge}
            emptyMessage="No specific prior knowledge is required."
          />
        </ContentCard>

        <ContentCard
          title="Key vocabulary"
          description="Important terminology for this resource"
          icon={<Tag className="h-5 w-5" />}
        >
          {content.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Resource sequence
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete teaching sequence, student tasks and assessment
              opportunities
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <article
              key={`${section.title}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <header className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <h3 className="font-bold text-slate-950">{section.title}</h3>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {section.duration}
                </span>
              </header>

              <div className="grid gap-6 p-5 lg:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-bold text-slate-950">
                    Teacher instructions
                  </h4>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.teacherInstructions}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-bold text-slate-950">
                    Student task
                  </h4>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.studentTask}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-bold text-slate-950">
                    Assessment opportunity
                  </h4>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.assessment}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-bold text-slate-950">
                    Resources required
                  </h4>

                  <BulletList
                    items={section.resources}
                    emptyMessage="No additional resources are required."
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ContentCard
        title="Differentiation"
        description="Support and challenge for different learner needs"
        icon={<Users className="h-5 w-5" />}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <h3 className="mb-3 font-bold text-sky-950">Support</h3>

            <BulletList items={content.differentiation.support} />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="mb-3 font-bold text-emerald-950">Core</h3>

            <BulletList items={content.differentiation.core} />
          </div>

          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <h3 className="mb-3 font-bold text-violet-950">Stretch</h3>

            <BulletList items={content.differentiation.stretch} />
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Common misconceptions"
        description="Likely errors and how to correct them"
        icon={<AlertCircle className="h-5 w-5" />}
      >
        {content.misconceptions.length > 0 ? (
          <div className="space-y-4">
            {content.misconceptions.map((item, index) => (
              <article
                key={`${item.misconception}-${index}`}
                className="rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <h3 className="text-sm font-bold text-amber-950">
                  Misconception
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-900">
                  {item.misconception}
                </p>

                <h4 className="mt-4 text-sm font-bold text-emerald-900">
                  Correction
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {item.correction}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No misconceptions were provided.
          </p>
        )}
      </ContentCard>

      <ContentCard
        title="Assessment questions"
        description="Questions, answers and mark allocations"
        icon={<FileQuestion className="h-5 w-5" />}
      >
        <div className="space-y-4">
          {content.assessmentQuestions.map((question, index) => (
            <details
              key={`${question.question}-${index}`}
              className="group overflow-hidden rounded-xl border border-slate-200"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 bg-slate-50 px-4 py-4 transition hover:bg-slate-100">
                <span className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>

                  <span className="text-sm font-semibold leading-6 text-slate-950">
                    {question.question}
                  </span>
                </span>

                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
                  {question.marks} {question.marks === 1 ? "mark" : "marks"}
                </span>
              </summary>

              <div className="border-t border-slate-200 bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Model answer
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {question.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </ContentCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard
          title="Homework"
          icon={<GraduationCap className="h-5 w-5" />}
        >
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {content.homework}
          </p>
        </ContentCard>

        <ContentCard
          title="Teacher notes"
          icon={<Lightbulb className="h-5 w-5" />}
        >
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {content.teacherNotes}
          </p>
        </ContentCard>
      </div>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
        <p className="font-bold text-slate-800">Resource viewer complete</p>

        <p className="mt-1 text-sm text-slate-500">
          This resource can be edited, published, exported and assigned to
          enrolled classes.
        </p>
      </section>
      <AssignResourceModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        resource={{
          id: resource.id,
          title: resource.title,
          topic: resource.topic,
          resourceType: resource.resourceType,
          status: resource.status,
        }}
        teacherId={currentUser.uid}
        teacherName={currentUser.displayName || currentUser.email || "Teacher"}
        onAssignmentCreated={() => {
          setIsAssignModalOpen(false);
        }}
      />
    </main>
  );
}
