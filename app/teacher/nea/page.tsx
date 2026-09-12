"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { NEA_STAGE_LABELS } from "@/lib/nea/constants";
import { NEA_STAGE_GUIDANCE } from "@/lib/nea/guidance";
import type { NeaProject } from "@/types/nea";

export default function TeacherNeaPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<NeaProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackByProject, setFeedbackByProject] = useState<
    Record<string, string>
  >({});
  const [savingId, setSavingId] = useState("");

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken(true);

      const response = await fetch(
        "/api/nea/projects",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result =
        (await response.json()) as {
          projects?: NeaProject[];
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          result.error ||
            "NEA projects could not be loaded.",
        );
      }

      setProjects(
        Array.isArray(result.projects)
          ? result.projects
          : [],
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "NEA projects could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(
      () => loadProjects(),
    );
  }, [loadProjects]);

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "active",
      ),
    [projects],
  );

  async function addFeedback(
    projectId: string,
  ) {
    if (!user) return;

    const message =
      feedbackByProject[
        projectId
      ]?.trim() || "";

    if (message.length < 5) {
      toast.error(
        "Enter a useful feedback comment.",
      );
      return;
    }

    try {
      setSavingId(projectId);

      const token =
        await user.getIdToken(true);

      const response =
        await fetch(
          `/api/nea/projects/${projectId}`,
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action:
                "add-feedback",
              message,
            }),
          },
        );

      const result =
        (await response.json()) as {
          success?: boolean;
          error?: string;
        };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Feedback could not be saved.",
        );
      }

      setFeedbackByProject(
        (current) => ({
          ...current,
          [projectId]: "",
        }),
      );

      toast.success(
        "NEA feedback recorded.",
      );

      await loadProjects();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Feedback could not be saved.",
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-900 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-200">
          Teacher NEA monitoring
        </p>

        <h1 className="mt-3 text-4xl font-black">
          NEA Project Journey
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-teal-100">
          Monitor project stages, milestones and evidence activity. Guide the student&apos;s thinking without writing assessed work for them.
        </p>
      </section>

      {loading ? (
        <div className="h-52 animate-pulse rounded-3xl bg-slate-200" />
      ) : activeProjects.length ===
        0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No active NEA projects yet
          </h2>

          <p className="mt-2 text-slate-600">
            A-level student projects from your school will appear here after students create them.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {activeProjects.map(
            (project) => {
              const guide =
                NEA_STAGE_GUIDANCE[
                  project.currentStage
                ];

              const milestones =
                project.milestones.filter(
                  (item) =>
                    item.stage ===
                    project.currentStage,
                );

              const completed =
                milestones.filter(
                  (item) =>
                    item.completed,
                ).length;

              return (
                <article
                  key={project.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-teal-700">
                        {project.examBoard}{" "}
                        A-level
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-slate-950">
                        {project.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {project.studentName}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-teal-50 px-4 py-3 text-right">
                      <p className="text-xs font-bold uppercase text-teal-700">
                        Overall
                      </p>

                      <p className="text-2xl font-black text-teal-950">
                        {project.overallProgress}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {Object.entries(
                      project.stageProgress,
                    ).map(
                      ([
                        stage,
                        progress,
                      ]) => (
                        <div
                          key={stage}
                          className="rounded-xl bg-slate-50 p-3"
                        >
                          <p className="truncate text-xs font-bold text-slate-500">
                            {
                              NEA_STAGE_LABELS[
                                stage as keyof typeof NEA_STAGE_LABELS
                              ]
                            }
                          </p>

                          <p className="mt-1 font-black text-slate-950">
                            {progress}%
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                    <p className="text-xs font-black uppercase text-teal-700">
                      Current stage:{" "}
                      {guide.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-teal-950">
                      {guide.purpose}
                    </p>

                    <p className="mt-3 text-sm font-bold text-teal-950">
                      Milestones:{" "}
                      {completed}/
                      {milestones.length}
                    </p>
                  </div>

                  {project.latestReflection ? (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase text-slate-500">
                        Latest student reflection
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {
                          project.latestReflection
                        }
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-5 flex gap-4 text-sm text-slate-600">
                    <span>
                      Evidence:{" "}
                      <strong>
                        {project.evidenceCount}
                      </strong>
                    </span>

                    <span>
                      Feedback:{" "}
                      <strong>
                        {
                          project.teacherFeedbackCount
                        }
                      </strong>
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-black uppercase text-amber-800">
                      Useful teacher prompts
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-950">
                      {guide.teacherPrompts.map(
                        (prompt) => (
                          <li key={prompt}>
                            {prompt}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
                    Teacher feedback
                    <textarea
                      value={
                        feedbackByProject[
                          project.id
                        ] || ""
                      }
                      onChange={(event) =>
                        setFeedbackByProject(
                          (current) => ({
                            ...current,
                            [project.id]:
                              event.target
                                .value,
                          }),
                        )
                      }
                      rows={4}
                      maxLength={2500}
                      placeholder="Ask questions, identify gaps, direct the student to revisit evidence or justify decisions. Do not write assessed content for them."
                      className="resize-y rounded-xl border border-slate-300 px-3 py-2 font-normal"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      void addFeedback(
                        project.id,
                      )
                    }
                    disabled={
                      savingId ===
                      project.id
                    }
                    className="mt-3 rounded-xl bg-teal-700 px-5 py-3 font-black text-white disabled:opacity-50"
                  >
                    {savingId ===
                    project.id
                      ? "Saving..."
                      : "Save feedback"}
                  </button>
                </article>
              );
            },
          )}
        </section>
      )}
    </main>
  );
}

