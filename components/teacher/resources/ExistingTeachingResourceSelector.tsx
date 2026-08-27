"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";

import {
  getTeacherResources,
  type SavedTeacherResource,
} from "@/services/teacherResourceService";

import type {
  AssignmentWizardResource,
} from "@/types/assignmentWizard";

type Props = {
  selectedResource:
    AssignmentWizardResource | null;

  onSelect: (
    resource:
      AssignmentWizardResource,
  ) => void;
};

export default function ExistingTeachingResourceSelector({
  selectedResource,
  onSelect,
}: Props) {
  const {
    user,
    loading:
      authLoading,
  } = useAuth();

  const [
    resources,
    setResources,
  ] =
    useState<
      SavedTeacherResource[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  useEffect(() => {
    if (
      authLoading
    ) {
      return;
    }

    /*
     * Guard Firebase user first.
     *
     * Do not create teacherId with user?.uid before this check because
     * TypeScript would retain string | undefined inside the async closure.
     */
    if (!user?.uid) {
      void Promise.resolve().then(() => {
        setResources([]);
        setLoading(false);
      });

      return;
    }

    /*
     * From this point teacherId is guaranteed to be a string.
     * Capturing it here also keeps the nested async function type-safe.
     */
    const teacherId =
      user.uid;

    let cancelled =
      false;

    async function load() {
      try {
        await Promise.resolve();

        if (cancelled) {
          return;
        }

        setLoading(true);

        const loaded =
          await getTeacherResources(
            teacherId,
          );

        if (
          !cancelled
        ) {
          setResources(
            loaded.filter(
              (resource) =>
                resource.status ===
                "published",
            ),
          );
        }
      } catch (error) {
        console.error(
          "Unable to load published teacher resources:",
          error,
        );

        if (
          !cancelled
        ) {
          setResources([]);
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    user?.uid,
  ]);

  const filtered =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return resources;
      }

      return resources.filter(
        (resource) =>
          [
            resource.title,
            resource.topic,
            resource.examBoard,
            resource.yearGroup,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search),
      );
    }, [
      resources,
      searchTerm,
    ]);

  return (
    <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Teacher Resource Library
      </p>

      <h3 className="mt-2 text-xl font-bold text-slate-900">
        Choose a published teaching resource
      </h3>

      <input
        type="search"
        value={
          searchTerm
        }
        onChange={(
          event,
        ) =>
          setSearchTerm(
            event.target
              .value,
          )
        }
        placeholder="Search title, topic, board or year group..."
        className="mt-5 w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />

      {loading ? (
        <div className="mt-5 space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-white" />
          <div className="h-24 animate-pulse rounded-xl bg-white" />
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-5 rounded-xl bg-white p-6 text-center">
          <p className="font-bold text-slate-900">
            No published resources match
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Publish a teaching resource in the Content Hub before assigning it.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {filtered.map(
            (resource) => {
              const selected =
                selectedResource
                  ?.resourceType ===
                  "teaching-resource" &&
                selectedResource
                  .resourceId ===
                  resource.id;

              return (
                <button
                  key={
                    resource.id
                  }
                  type="button"
                  onClick={() =>
                    onSelect({
                      id:
                        resource.id,

                      title:
                        resource.title,

                      description:
                        resource.content
                          .overview ||
                        `Complete ${resource.title}.`,

                      resourceType:
                        "teaching-resource",

                      resourceId:
                        resource.id,

                      topicTitle:
                        resource.topic,

                      examBoard:
                        resource.examBoard,

                      qualification:
                        resource.yearGroup ===
                          "A Level" ||
                        resource.yearGroup ===
                          "Year 12" ||
                        resource.yearGroup ===
                          "Year 13"
                          ? "A_LEVEL"
                          : "GCSE",
                    })
                  }
                  className={`rounded-xl border bg-white p-4 text-left transition ${
                    selected
                      ? "border-indigo-500 ring-2 ring-indigo-100"
                      : "border-indigo-100 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-950">
                        {
                          resource.title
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {
                          resource.topic
                        }{" "}
                        ·{" "}
                        {
                          resource.examBoard
                        }{" "}
                        ·{" "}
                        {
                          resource.yearGroup
                        }
                      </p>
                    </div>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                        selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
