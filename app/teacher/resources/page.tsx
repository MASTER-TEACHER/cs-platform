"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  deleteTeacherResource,
  getTeacherResources,
  SavedTeacherResource,
} from "@/services/teacherResourceService";

type StatusFilter = "all" | "draft" | "published" | "archived";

function formatResourceType(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: Date | null): string {
  if (!value) {
    return "Recently saved";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function ResourceLibrarySkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="mt-5 h-7 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />

          <div className="mt-6 flex gap-2">
            <div className="h-7 w-20 rounded-full bg-slate-100" />
            <div className="h-7 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="mt-6 h-10 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyLibrary({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <BookOpen className="h-8 w-8" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-950">
        {hasFilters
          ? "No matching resources"
          : "Your resource library is empty"}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
        {hasFilters
          ? "Try changing your search term or clearing the selected filters."
          : "Generate or load a teaching resource in the AI Teacher Assistant, then save it to your library."}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Clear filters
          </button>
        )}

        <Link
          href="/teacher/assistant"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          <Sparkles className="h-4 w-4" />
          Open AI Assistant
        </Link>
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  deletingId,
  onDelete,
}: {
  resource: SavedTeacherResource;
  deletingId: string | null;
  onDelete: (resource: SavedTeacherResource) => void;
}) {
  const isDeleting = deletingId === resource.id;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-2 bg-gradient-to-r from-indigo-600 to-sky-500" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {formatResourceType(resource.resourceType)}
          </span>

          <span
            className={
              resource.status === "published"
                ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700"
                : "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold capitalize text-amber-700"
            }
          >
            {resource.status === "published" && (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}

            {resource.status}
          </span>
        </div>

        <div className="mt-5">
          <h2 className="line-clamp-2 text-xl font-bold text-slate-950">
            {resource.title}
          </h2>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {resource.content.overview}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {resource.yearGroup}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {resource.examBoard}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
            {resource.difficulty}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-400" />
            {resource.duration}
          </span>

          <span className="flex items-center justify-end gap-2 text-right">
            <FileText className="h-4 w-4 text-slate-400" />
            {resource.content.sections.length} sections
          </span>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Saved {formatDate(resource.createdAt)}
        </p>

        <div className="mt-auto flex gap-3 pt-6">
          <Link
            href={`/teacher/resources/${resource.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <BookOpen className="h-4 w-4" />
            Open resource
          </Link>

          <button
            type="button"
            onClick={() => onDelete(resource)}
            disabled={isDeleting || resource.status !== "archived"}
            title={resource.status === "archived" ? "Delete archived resource" : "Archive this resource in Content Hub before deleting it"}
            aria-label={`Delete ${resource.title}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TeacherResourcesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [resources, setResources] = useState<SavedTeacherResource[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");

  const [yearGroupFilter, setYearGroupFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadResources = useCallback(async () => {
    if (!currentUser) {
      setResources([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedResources = await getTeacherResources(currentUser.uid);

      setResources(savedResources);
    } catch (caughtError) {
      console.error("Failed to load teacher resources:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your resource library could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authLoading) {
      void loadResources();
    }
  }, [authLoading, loadResources]);

  const resourceTypes = useMemo(() => {
    return Array.from(
      new Set(resources.map((resource) => resource.resourceType)),
    ).sort();
  }, [resources]);

  const yearGroups = useMemo(() => {
    return Array.from(
      new Set(resources.map((resource) => resource.yearGroup)),
    ).sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !normalisedSearch ||
        resource.title.toLowerCase().includes(normalisedSearch) ||
        resource.topic.toLowerCase().includes(normalisedSearch) ||
        resource.content.overview.toLowerCase().includes(normalisedSearch);

      const matchesType =
        resourceTypeFilter === "all" ||
        resource.resourceType === resourceTypeFilter;

      const matchesYearGroup =
        yearGroupFilter === "all" || resource.yearGroup === yearGroupFilter;

      const matchesStatus =
        statusFilter === "all" || resource.status === statusFilter;

      return matchesSearch && matchesType && matchesYearGroup && matchesStatus;
    });
  }, [
    resources,
    searchTerm,
    resourceTypeFilter,
    yearGroupFilter,
    statusFilter,
  ]);

  const hasFilters =
    searchTerm.trim().length > 0 ||
    resourceTypeFilter !== "all" ||
    yearGroupFilter !== "all" ||
    statusFilter !== "all";

  function clearFilters() {
    setSearchTerm("");
    setResourceTypeFilter("all");
    setYearGroupFilter("all");
    setStatusFilter("all");
  }

  async function handleDelete(resource: SavedTeacherResource) {
    if (resource.status !== "archived") {
      setError("Archive a resource in Content Hub before deleting it permanently.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete archived resource "${resource.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(resource.id);
    setError(null);
    setSuccess(null);

    try {
      await deleteTeacherResource(resource.id);

      setResources((current) =>
        current.filter((item) => item.id !== resource.id),
      );

      setSuccess(`"${resource.title}" was deleted successfully.`);
    } catch (caughtError) {
      console.error("Failed to delete teacher resource:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The resource could not be deleted.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" />
              Teacher Resource Library
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your teaching resources
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-indigo-50">
              Find, organise and manage the classroom resources you created with
              the AI Teacher Assistant.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/content"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white"
            >
              Content Hub
            </Link>

            <Link
              href="/teacher/assistant"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              <Plus className="h-5 w-5" />
              Create resource
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-500">
            Total resources
          </p>

          <p className="mt-2 text-3xl font-extrabold text-slate-950">
            {resources.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-500">
            Draft resources
          </p>

          <p className="mt-2 text-3xl font-extrabold text-amber-600">
            {resources.filter((resource) => resource.status === "draft").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-500">
            Published resources
          </p>

          <p className="mt-2 text-3xl font-extrabold text-emerald-600">
            {
              resources.filter((resource) => resource.status === "published")
                .length
            }
          </p>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            <p className="font-bold">Resource library error</p>

            <p className="mt-1 text-sm leading-6">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadResources()}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(150px,auto))]">
          <div>
            <label htmlFor="resource-search" className="sr-only">
              Search resources
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="resource-search"
                type="search"
                value={searchTerm}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by title, topic or description..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              aria-label="Filter by resource type"
              value={resourceTypeFilter}
              onChange={(event) => setResourceTypeFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All resource types</option>

              {resourceTypes.map((resourceType) => (
                <option key={resourceType} value={resourceType}>
                  {formatResourceType(resourceType)}
                </option>
              ))}
            </select>
          </div>

          <select
            aria-label="Filter by year group"
            value={yearGroupFilter}
            onChange={(event) => setYearGroupFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All year groups</option>

            {yearGroups.map((yearGroup) => (
              <option key={yearGroup} value={yearGroup}>
                {yearGroup}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredResources.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">{resources.length}</span>{" "}
            resources
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {loading ? (
        <ResourceLibrarySkeleton />
      ) : filteredResources.length === 0 ? (
        <EmptyLibrary hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </main>
  );
}
