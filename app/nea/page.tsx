"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import {
  NEA_INTEGRITY_NOTICE,
  NEA_STAGE_LABELS,
  NEA_STAGE_ORDER,
} from "@/lib/nea/constants";
import { NEA_STAGE_GUIDANCE } from "@/lib/nea/guidance";
import type {
  NeaEvidence,
  NeaFeedback,
  NeaProject,
  NeaStageId,
} from "@/types/nea";

type TokenUser = {
  getIdToken: (
    forceRefresh?: boolean,
  ) => Promise<string>;
};

type ProjectListResponse = {
  projects?: NeaProject[];
  projectId?: string;
  success?: boolean;
  error?: string;
};

type DetailResponse = {
  project?: NeaProject;
  evidence?: NeaEvidence[];
  feedback?: NeaFeedback[];
  error?: string;
};

export default function NeaProjectPage() {
  const {
    user,
    profile,
  } = useAuth();

  const [
    projects,
    setProjects,
  ] = useState<
    NeaProject[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    projectBrief,
    setProjectBrief,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const loadProjects =
    useCallback(
      async () => {
        if (!user) {
          setProjects([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const token =
            await user.getIdToken(
              true,
            );

          const response =
            await fetch(
              "/api/nea/projects",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
                cache:
                  "no-store",
              },
            );

          const result =
            (await response.json()) as
              ProjectListResponse;

          if (!response.ok) {
            throw new Error(
              result.error ||
                "NEA projects could not be loaded.",
            );
          }

          setProjects(
            Array.isArray(
              result.projects,
            )
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
      },
      [
        user,
      ],
    );

  useEffect(() => {
    void Promise.resolve().then(
      () => loadProjects(),
    );
  }, [
    loadProjects,
  ]);

  const activeProject =
    useMemo(
      () =>
        projects.find(
          (project) =>
            project.status ===
            "active",
        ) || null,
      [
        projects,
      ],
    );

  async function createProject() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);

      const token =
        await user.getIdToken(
          true,
        );

      const response =
        await fetch(
          "/api/nea/projects",
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                title,
                projectBrief,
              }),
          },
        );

      const result =
        (await response.json()) as
          ProjectListResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "The NEA project could not be created.",
        );
      }

      toast.success(
        "NEA project created.",
      );

      setTitle("");
      setProjectBrief("");

      await loadProjects();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The NEA project could not be created.",
      );
    } finally {
      setSaving(false);
    }
  }

  const qualification =
    (
      profile as {
        qualification?: string;
      } | null
    )?.qualification;

  if (
    qualification !==
    "A_LEVEL"
  ) {
    return (
      <main className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-200">
            V1.2 NEA
          </p>

          <h1 className="mt-3 text-4xl font-black">
            NEA Assistance & Guidance
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-indigo-100">
            The NEA project journey is currently designed for A-level Computer Science students.
          </p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
      </main>
    );
  }

  if (!activeProject) {
    return (
      <main className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
            A-level Computer Science
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Start your NEA project journey
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-blue-100">
            Plan, evidence and reflect on your own project through Analysis, Design, Development, Testing and Evaluation.
          </p>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="font-black">
            Academic integrity
          </h2>

          <p className="mt-2 leading-7">
            {NEA_INTEGRITY_NOTICE}
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <label className="grid gap-2 font-bold text-slate-800">
            Project title
            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={160}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="e.g. Revision planner with adaptive scheduling"
            />
          </label>

          <label className="mt-5 grid gap-2 font-bold text-slate-800">
            Short project brief
            <textarea
              value={projectBrief}
              onChange={(event) =>
                setProjectBrief(
                  event.target.value,
                )
              }
              rows={7}
              maxLength={1500}
              className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Describe the real problem, intended users and what you want to investigate or build. Use your own words."
            />
          </label>

          <button
            type="button"
            disabled={
              saving ||
              title.trim().length <
                3 ||
              projectBrief.trim()
                .length < 20
            }
            onClick={() =>
              void createProject()
            }
            className="mt-5 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create NEA project"}
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ActiveNeaWorkspace
      key={activeProject.id}
      initialProject={
        activeProject
      }
      user={user}
      onReloadProjects={
        loadProjects
      }
    />
  );
}

function ActiveNeaWorkspace({
  initialProject,
  user,
  onReloadProjects,
}: {
  initialProject: NeaProject;
  user: TokenUser;
  onReloadProjects:
    () => Promise<void>;
}) {
  const [
    project,
    setProject,
  ] = useState(
    initialProject,
  );

  const [
    evidence,
    setEvidence,
  ] = useState<
    NeaEvidence[]
  >([]);

  const [
    feedback,
    setFeedback,
  ] = useState<
    NeaFeedback[]
  >([]);

  const [
    selectedStage,
    setSelectedStage,
  ] =
    useState<NeaStageId>(
      initialProject.currentStage ||
        "analysis",
    );

  const [
    stageProgress,
    setStageProgress,
  ] = useState(
    initialProject.stageProgress[
      initialProject.currentStage ||
        "analysis"
    ] || 0,
  );

  const [
    reflection,
    setReflection,
  ] = useState(
    initialProject.latestReflection ||
      "",
  );

  const [
    evidenceTitle,
    setEvidenceTitle,
  ] = useState("");

  const [
    evidenceDescription,
    setEvidenceDescription,
  ] = useState("");

  const [
    coachMessage,
    setCoachMessage,
  ] = useState("");

  const [
    coachReply,
    setCoachReply,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    coachLoading,
    setCoachLoading,
  ] = useState(false);

  const loadDetail =
    useCallback(
      async () => {
        const token =
          await user.getIdToken(
            true,
          );

        const response =
          await fetch(
            `/api/nea/projects/${initialProject.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              cache:
                "no-store",
            },
          );

        const result =
          (await response.json()) as
            DetailResponse;

        if (
          !response.ok ||
          !result.project
        ) {
          throw new Error(
            result.error ||
              "NEA project detail could not be loaded.",
          );
        }

        setProject(
          result.project,
        );

        setEvidence(
          Array.isArray(
            result.evidence,
          )
            ? result.evidence
            : [],
        );

        setFeedback(
          Array.isArray(
            result.feedback,
          )
            ? result.feedback
            : [],
        );
      },
      [
        initialProject.id,
        user,
      ],
    );

  useEffect(() => {
    void Promise.resolve()
      .then(
        () => loadDetail(),
      )
      .catch(
        (error) =>
          toast.error(
            error instanceof Error
              ? error.message
              : "NEA project detail could not be loaded.",
          ),
      );
  }, [
    loadDetail,
  ]);

  const guide =
    NEA_STAGE_GUIDANCE[
      selectedStage
    ];

  const stageMilestones =
    project.milestones.filter(
      (item) =>
        item.stage ===
        selectedStage,
    );

  async function patch(
    body: Record<
      string,
      unknown
    >,
  ) {
    const token =
      await user.getIdToken(
        true,
      );

    const response =
      await fetch(
        `/api/nea/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify(
              body,
            ),
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
          "The NEA project could not be updated.",
      );
    }
  }

  async function refreshAfterUpdate() {
    await Promise.all([
      loadDetail(),
      onReloadProjects(),
    ]);
  }

  async function updateProgress() {
    try {
      setSaving(true);

      await patch({
        action:
          "update-progress",
        stage:
          selectedStage,
        progress:
          stageProgress,
        reflection,
      });

      toast.success(
        "NEA progress saved.",
      );

      await refreshAfterUpdate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Progress could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleMilestone(
    milestoneId: string,
    completed: boolean,
  ) {
    try {
      await patch({
        action:
          "toggle-milestone",
        milestoneId,
        completed,
      });

      await loadDetail();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Milestone could not be updated.",
      );
    }
  }

  async function addEvidence() {
    try {
      setSaving(true);

      await patch({
        action:
          "add-evidence",
        stage:
          selectedStage,
        title:
          evidenceTitle,
        description:
          evidenceDescription,
      });

      setEvidenceTitle("");
      setEvidenceDescription("");

      toast.success(
        "Evidence recorded.",
      );

      await refreshAfterUpdate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Evidence could not be recorded.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function askCoach() {
    if (
      coachMessage.trim()
        .length < 4
    ) {
      toast.error(
        "Enter a question for the NEA Coach.",
      );
      return;
    }

    try {
      setCoachLoading(
        true,
      );

      const token =
        await user.getIdToken(
          true,
        );

      const response =
        await fetch(
          "/api/ai/nea-coach",
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                projectId:
                  project.id,
                stage:
                  selectedStage,
                message:
                  coachMessage,
              }),
          },
        );

      const result =
        (await response.json()) as {
          success?: boolean;
          reply?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !result.success ||
        !result.reply
      ) {
        throw new Error(
          result.error ||
            "The NEA Coach could not respond.",
        );
      }

      setCoachReply(
        result.reply,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The NEA Coach could not respond.",
      );
    } finally {
      setCoachLoading(
        false,
      );
    }
  }

  function selectStage(
    stage: NeaStageId,
  ) {
    setSelectedStage(
      stage,
    );

    setStageProgress(
      project.stageProgress[
        stage
      ] || 0,
    );

    setCoachReply("");
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
          NEA Project Journey
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {project.title}
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-blue-100">
          {project.projectBrief}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric
            label="Overall progress"
            value={`${project.overallProgress}%`}
          />
          <Metric
            label="Evidence recorded"
            value={String(
              project.evidenceCount,
            )}
          />
          <Metric
            label="Teacher feedback"
            value={String(
              project.teacherFeedbackCount,
            )}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>
          Academic integrity:
        </strong>{" "}
        {NEA_INTEGRITY_NOTICE}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {NEA_STAGE_ORDER.map(
          (stage) => (
            <button
              key={stage}
              type="button"
              onClick={() =>
                selectStage(stage)
              }
              className={`rounded-2xl border p-5 text-left ${
                stage === selectedStage
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-black text-slate-950">
                {NEA_STAGE_LABELS[stage]}
              </p>

              <p className="mt-2 text-2xl font-black text-indigo-700">
                {project.stageProgress[stage]}%
              </p>
            </button>
          ),
        )}
      </section>

      <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-700">
          Stage guidance
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          {guide.title}
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-700">
          {guide.purpose}
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <GuidanceList
            title="Questions to ask yourself"
            items={guide.studentQuestions}
          />
          <GuidanceList
            title="Evidence you might record"
            items={guide.evidenceIdeas}
          />
        </div>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-950">
          {guide.integrityBoundary}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Milestones and progress
            </h2>

            <div className="mt-5 space-y-3">
              {stageMilestones.map(
                (milestone) => (
                  <label
                    key={milestone.id}
                    className="flex gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={(event) =>
                        void toggleMilestone(
                          milestone.id,
                          event.target.checked,
                        )
                      }
                      className="mt-1 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800">
                      {milestone.title}
                    </span>
                  </label>
                ),
              )}
            </div>

            <label className="mt-6 block font-bold text-slate-800">
              Stage progress: {stageProgress}%
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={stageProgress}
                onChange={(event) =>
                  setStageProgress(
                    Number(event.target.value),
                  )
                }
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-6 grid gap-2 font-bold text-slate-800">
              Reflection
              <textarea
                value={reflection}
                onChange={(event) =>
                  setReflection(event.target.value)
                }
                rows={7}
                maxLength={2500}
                className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal"
                placeholder="Record what you did, decisions you made, what changed and what you need to do next. Use your own words."
              />
            </label>

            <button
              type="button"
              onClick={() =>
                void updateProgress()
              }
              disabled={saving}
              className="mt-5 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white disabled:opacity-50"
            >
              Save stage progress
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Evidence log
            </h2>

            <input
              value={evidenceTitle}
              onChange={(event) =>
                setEvidenceTitle(event.target.value)
              }
              maxLength={180}
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Evidence title"
            />

            <textarea
              value={evidenceDescription}
              onChange={(event) =>
                setEvidenceDescription(event.target.value)
              }
              rows={6}
              maxLength={2500}
              className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3"
              placeholder="What does this evidence show about your own work and decision-making?"
            />

            <button
              type="button"
              onClick={() =>
                void addEvidence()
              }
              disabled={
                saving ||
                evidenceTitle.trim().length < 3 ||
                evidenceDescription.trim().length < 10
              }
              className="mt-4 rounded-xl bg-emerald-700 px-6 py-3 font-black text-white disabled:opacity-50"
            >
              Record evidence
            </button>

            <div className="mt-6 space-y-3">
              {evidence.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No evidence recorded yet.
                </p>
              ) : (
                evidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <p className="text-xs font-black uppercase text-emerald-700">
                      {NEA_STAGE_LABELS[item.stage]}
                    </p>
                    <p className="mt-1 font-black text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-7">
            <p className="text-sm font-black uppercase tracking-widest text-violet-700">
              Socratic assistance
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Ask the NEA Coach
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-700">
              Ask for explanation, questions, planning help or feedback on your reasoning. The coach is deliberately prevented from writing assessed work for you.
            </p>

            <textarea
              value={coachMessage}
              onChange={(event) =>
                setCoachMessage(event.target.value)
              }
              rows={6}
              maxLength={2000}
              className="mt-5 w-full resize-y rounded-xl border border-violet-200 bg-white px-4 py-3"
              placeholder="Example: My success criteria feel vague. What questions should I ask myself to make them measurable?"
            />

            <button
              type="button"
              onClick={() =>
                void askCoach()
              }
              disabled={coachLoading}
              className="mt-4 rounded-xl bg-violet-700 px-6 py-3 font-black text-white disabled:opacity-50"
            >
              {coachLoading
                ? "Thinking..."
                : "Ask NEA Coach"}
            </button>

            {coachReply ? (
              <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-white p-5 text-sm leading-7 text-slate-800">
                {coachReply}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Teacher feedback history
            </h2>

            <div className="mt-5 space-y-3">
              {feedback.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No teacher feedback yet.
                </p>
              ) : (
                feedback.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <p className="font-black text-slate-950">
                      {item.teacherName}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {item.message}
                    </p>
                    {item.createdAt ? (
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(
                          item.createdAt,
                        ).toLocaleString("en-GB")}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm text-blue-100">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

function GuidanceList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
