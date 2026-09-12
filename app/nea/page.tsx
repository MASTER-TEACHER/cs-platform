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
import {
  NEA_STAGE_GUIDANCE,
} from "@/lib/nea/guidance";
import type {
  NeaEvidence,
  NeaEvidenceReferenceType,
  NeaFeedback,
  NeaMilestoneStatus,
  NeaProject,
  NeaStageId,
} from "@/types/nea";

type ProjectResponse = {
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
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<NeaProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [projectBrief, setProjectBrief] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken(true);
      const response = await fetch("/api/nea/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = (await response.json()) as ProjectResponse;

      if (!response.ok) {
        throw new Error(
          result.error || "NEA projects could not be loaded.",
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
    void Promise.resolve().then(() => loadProjects());
  }, [loadProjects]);

  const currentProject = useMemo(
    () =>
      projects.find(
        (project) =>
          project.status === "active" ||
          project.status === "submitted",
      ) ||
      projects.find(
        (project) => project.status === "completed",
      ) ||
      null,
    [projects],
  );

  async function createProject() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      const token = await user.getIdToken(true);

      const response = await fetch("/api/nea/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          projectBrief,
        }),
      });

      const result = (await response.json()) as ProjectResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "The NEA project could not be created.",
        );
      }

      toast.success("NEA project created.");
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

  if (qualification !== "A_LEVEL") {
    return (
      <main className="mx-auto max-w-5xl">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-200">
            V1.2 NEA
          </p>
          <h1 className="mt-3 text-4xl font-black">
            NEA Assistance & Guidance
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-indigo-100">
            The NEA project journey is designed for A-level
            Computer Science students.
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

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Sign in to continue
          </h1>
          <p className="mt-3 text-slate-600">
            Your NEA workspace requires an authenticated student account.
          </p>
        </section>
      </main>
    );
  }

  if (!currentProject) {
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
            Plan, evidence and reflect on your own project through
            Analysis, Design, Development, Testing and Evaluation.
          </p>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="font-black">Guidance only</h2>
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
                setTitle(event.target.value)
              }
              maxLength={160}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
            />
          </label>

          <label className="mt-5 grid gap-2 font-bold text-slate-800">
            Short project brief
            <textarea
              value={projectBrief}
              onChange={(event) =>
                setProjectBrief(event.target.value)
              }
              rows={7}
              maxLength={1500}
              className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal"
            />
          </label>

          <button
            type="button"
            disabled={
              saving ||
              title.trim().length < 3 ||
              projectBrief.trim().length < 20
            }
            onClick={() => void createProject()}
            className="mt-5 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create NEA project"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <ActiveNeaWorkspace
      key={currentProject.id}
      initialProject={currentProject}
      user={user}
      onReloadProjects={loadProjects}
    />
  );
}

function ActiveNeaWorkspace({
  initialProject,
  user,
  onReloadProjects,
}: {
  initialProject: NeaProject;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  onReloadProjects: () => Promise<void>;
}) {
  const [project, setProject] = useState(initialProject);
  const [evidence, setEvidence] = useState<NeaEvidence[]>([]);
  const [feedback, setFeedback] = useState<NeaFeedback[]>([]);
  const [selectedStage, setSelectedStage] =
    useState<NeaStageId>(
      initialProject.currentStage || "analysis",
    );
  const [stageProgress, setStageProgress] = useState(
    initialProject.stageProgress[
      initialProject.currentStage || "analysis"
    ] || 0,
  );
  const [reflection, setReflection] = useState(
    initialProject.latestReflection || "",
  );
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDescription, setEvidenceDescription] =
    useState("");
  const [referenceType, setReferenceType] =
    useState<NeaEvidenceReferenceType>("none");
  const [referenceLabel, setReferenceLabel] = useState("");
  const [referenceValue, setReferenceValue] = useState("");
  const [editingEvidenceId, setEditingEvidenceId] =
    useState("");
  const [coachMessage, setCoachMessage] = useState("");
  const [coachReply, setCoachReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTodayDate(
        new Date().toISOString().slice(0, 10),
      );
    });
  }, []);

  const loadDetail = useCallback(async () => {
    const token = await user.getIdToken(true);

    const response = await fetch(
      `/api/nea/projects/${initialProject.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const result = (await response.json()) as DetailResponse;

    if (!response.ok || !result.project) {
      throw new Error(
        result.error ||
          "NEA project detail could not be loaded.",
      );
    }

    setProject(result.project);
    setEvidence(
      Array.isArray(result.evidence) ? result.evidence : [],
    );
    setFeedback(
      Array.isArray(result.feedback) ? result.feedback : [],
    );
  }, [initialProject.id, user]);

  useEffect(() => {
    void Promise.resolve()
      .then(() => loadDetail())
      .catch((error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "NEA project detail could not be loaded.",
        ),
      );
  }, [loadDetail]);

  const guide = NEA_STAGE_GUIDANCE[selectedStage];
  const stageMilestones = project.milestones.filter(
    (item) => item.stage === selectedStage,
  );
  const stageReady =
    stageMilestones.length > 0 &&
    stageMilestones.every(
      (item) => item.status === "complete",
    );
  const canEdit = project.status === "active";
  const allStagesComplete = NEA_STAGE_ORDER.every(
    (stage) => project.stageProgress[stage] === 100,
  );

  async function patch(
    body: Record<string, unknown>,
  ) {
    const token = await user.getIdToken(true);

    const response = await fetch(
      `/api/nea/projects/${project.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const result = (await response.json()) as {
      success?: boolean;
      error?: string;
      nextStage?: NeaStageId | null;
    };

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ||
          "The NEA project could not be updated.",
      );
    }

    return result;
  }

  async function updateProgress() {
    try {
      setSaving(true);
      await patch({
        action: "update-progress",
        stage: selectedStage,
        progress: stageProgress,
        reflection,
      });
      toast.success("NEA progress saved.");
      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);
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

  async function updateMilestone(
    milestoneId: string,
    status: NeaMilestoneStatus,
    dueDate: string | null,
  ) {
    try {
      await patch({
        action: "update-milestone",
        milestoneId,
        status,
        dueDate,
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

  async function completeStage() {
    if (
      !window.confirm(
        `Mark ${NEA_STAGE_LABELS[selectedStage]} complete and move to the next stage?`,
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      const result = await patch({
        action: "complete-stage",
        stage: selectedStage,
        reflection,
      });

      toast.success(
        `${NEA_STAGE_LABELS[selectedStage]} marked complete.`,
      );

      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);

      if (result.nextStage) {
        setSelectedStage(result.nextStage);
        setStageProgress(0);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Stage could not be completed.",
      );
    } finally {
      setSaving(false);
    }
  }

  function resetEvidenceForm() {
    setEditingEvidenceId("");
    setEvidenceTitle("");
    setEvidenceDescription("");
    setReferenceType("none");
    setReferenceLabel("");
    setReferenceValue("");
  }

  function beginEditEvidence(item: NeaEvidence) {
    setEditingEvidenceId(item.id);
    setSelectedStage(item.stage);
    setEvidenceTitle(item.title);
    setEvidenceDescription(item.description);
    setReferenceType(item.referenceType || "none");
    setReferenceLabel(item.referenceLabel || "");
    setReferenceValue(item.referenceValue || "");
  }

  async function saveEvidence() {
    try {
      setSaving(true);
      const wasEditing = Boolean(editingEvidenceId);

      await patch({
        action: wasEditing
          ? "update-evidence"
          : "add-evidence",
        evidenceId:
          editingEvidenceId || undefined,
        stage: selectedStage,
        title: evidenceTitle,
        description: evidenceDescription,
        referenceType,
        referenceLabel,
        referenceValue,
      });

      resetEvidenceForm();
      toast.success(
        wasEditing
          ? "Evidence updated."
          : "Evidence recorded.",
      );

      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Evidence could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvidence(item: NeaEvidence) {
    if (
      !window.confirm(
        `Delete the evidence record "${item.title}"?`,
      )
    ) {
      return;
    }

    try {
      await patch({
        action: "delete-evidence",
        evidenceId: item.id,
      });

      if (editingEvidenceId === item.id) {
        resetEvidenceForm();
      }

      toast.success("Evidence deleted.");
      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Evidence could not be deleted.",
      );
    }
  }

  async function askCoach() {
    if (coachMessage.trim().length < 4) {
      toast.error("Enter a question for the NEA Coach.");
      return;
    }

    try {
      setCoachLoading(true);
      const token = await user.getIdToken(true);

      const response = await fetch("/api/ai/nea-coach", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          stage: selectedStage,
          message: coachMessage,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        reply?: string;
        error?: string;
      };

      if (!response.ok || !result.success || !result.reply) {
        throw new Error(
          result.error ||
            "The NEA Coach could not respond.",
        );
      }

      setCoachReply(result.reply);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The NEA Coach could not respond.",
      );
    } finally {
      setCoachLoading(false);
    }
  }

  async function submitProject() {
    if (
      !window.confirm(
        "Submit this project for teacher review? Editing will pause until the project is returned to active work.",
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await patch({ action: "submit-project" });
      toast.success("Project submitted for review.");
      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Project could not be submitted.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function returnToActive() {
    try {
      setSaving(true);
      await patch({ action: "return-to-active" });
      toast.success("Project returned to active work.");
      await Promise.all([
        loadDetail(),
        onReloadProjects(),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Project could not be reopened.",
      );
    } finally {
      setSaving(false);
    }
  }

  function selectStage(stage: NeaStageId) {
    setSelectedStage(stage);
    setStageProgress(
      project.stageProgress[stage] || 0,
    );
    setCoachReply("");
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
          NEA Project Journey
        </p>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">
              {project.title}
            </h1>
            <p className="mt-4 max-w-4xl leading-7 text-blue-100">
              {project.projectBrief}
            </p>
          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wide">
            {project.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric
            label="Overall progress"
            value={`${project.overallProgress}%`}
          />
          <Metric
            label="Evidence recorded"
            value={String(project.evidenceCount)}
          />
          <Metric
            label="Teacher feedback"
            value={String(project.teacherFeedbackCount)}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>Guidance only:</strong>{" "}
        {NEA_INTEGRITY_NOTICE}
      </section>

      {project.status === "submitted" ? (
        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
          <p className="font-black">
            Submitted for teacher review
          </p>
          <p className="mt-2 text-sm leading-6">
            Editing is paused while this project is submitted.
          </p>
          <button
            type="button"
            onClick={() => void returnToActive()}
            disabled={saving}
            className="mt-4 rounded-xl border border-blue-300 bg-white px-4 py-2 font-black text-blue-900"
          >
            Return to active work
          </button>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-5">
        {NEA_STAGE_ORDER.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => selectStage(stage)}
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
        ))}
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
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Milestones and progress
            </h2>

            <div className="mt-5 space-y-3">
              {stageMilestones.map((milestone) => {
                const overdue =
                  Boolean(milestone.dueDate) &&
                  milestone.status !== "complete" &&
                  Boolean(todayDate) &&
                  milestone.dueDate! < todayDate;

                return (
                  <div
                    key={milestone.id}
                    className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_180px]"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {milestone.title}
                      </p>
                      {milestone.dueDate ? (
                        <p
                          className={`mt-1 text-xs font-bold ${
                            overdue
                              ? "text-rose-700"
                              : "text-slate-500"
                          }`}
                        >
                          Due{" "}
                          {new Date(
                            `${milestone.dueDate}T00:00:00`,
                          ).toLocaleDateString("en-GB")}
                          {overdue ? " · overdue" : ""}
                        </p>
                      ) : null}
                    </div>

                    <select
                      value={milestone.status}
                      disabled={!canEdit}
                      onChange={(event) =>
                        void updateMilestone(
                          milestone.id,
                          event.target
                            .value as NeaMilestoneStatus,
                          milestone.dueDate,
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold disabled:bg-slate-100"
                    >
                      <option value="not_started">
                        Not started
                      </option>
                      <option value="in_progress">
                        In progress
                      </option>
                      <option value="complete">
                        Complete
                      </option>
                    </select>
                  </div>
                );
              })}
            </div>

            <label className="mt-6 block font-bold text-slate-800">
              Stage progress: {stageProgress}%
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={stageProgress}
                disabled={!canEdit}
                onChange={(event) =>
                  setStageProgress(
                    Number(event.target.value),
                  )
                }
                className="mt-3 w-full disabled:opacity-50"
              />
            </label>

            <label className="mt-6 grid gap-2 font-bold text-slate-800">
              Reflection
              <textarea
                value={reflection}
                disabled={!canEdit}
                onChange={(event) =>
                  setReflection(event.target.value)
                }
                rows={7}
                maxLength={2500}
                className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal disabled:bg-slate-100"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void updateProgress()}
                disabled={saving || !canEdit}
                className="rounded-xl bg-indigo-700 px-6 py-3 font-black text-white disabled:opacity-50"
              >
                Save stage progress
              </button>

              <button
                type="button"
                onClick={() => void completeStage()}
                disabled={
                  saving ||
                  !canEdit ||
                  !stageReady
                }
                className="rounded-xl bg-emerald-700 px-6 py-3 font-black text-white disabled:opacity-50"
              >
                Complete stage
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
              Evidence management
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {editingEvidenceId
                ? "Edit evidence"
                : "Record evidence"}
            </h2>

            <input
              value={evidenceTitle}
              disabled={!canEdit}
              onChange={(event) =>
                setEvidenceTitle(event.target.value)
              }
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              placeholder="Evidence title"
            />

            <textarea
              value={evidenceDescription}
              disabled={!canEdit}
              onChange={(event) =>
                setEvidenceDescription(event.target.value)
              }
              rows={5}
              className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              placeholder="What does this evidence show about your own work?"
            />

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <select
                value={referenceType}
                disabled={!canEdit}
                onChange={(event) =>
                  setReferenceType(
                    event.target
                      .value as NeaEvidenceReferenceType,
                  )
                }
                className="rounded-xl border border-slate-300 px-3 py-3 disabled:bg-slate-100"
              >
                <option value="none">No reference</option>
                <option value="link">Link</option>
                <option value="file-reference">
                  File reference
                </option>
                <option value="other">Other</option>
              </select>

              <input
                value={referenceLabel}
                disabled={!canEdit}
                onChange={(event) =>
                  setReferenceLabel(event.target.value)
                }
                className="rounded-xl border border-slate-300 px-3 py-3 disabled:bg-slate-100"
                placeholder="Reference label"
              />

              <input
                value={referenceValue}
                disabled={!canEdit}
                onChange={(event) =>
                  setReferenceValue(event.target.value)
                }
                className="rounded-xl border border-slate-300 px-3 py-3 disabled:bg-slate-100"
                placeholder="URL, file name or location"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void saveEvidence()}
                disabled={
                  saving ||
                  !canEdit ||
                  evidenceTitle.trim().length < 3 ||
                  evidenceDescription.trim().length < 10
                }
                className="rounded-xl bg-emerald-700 px-6 py-3 font-black text-white disabled:opacity-50"
              >
                {editingEvidenceId
                  ? "Save evidence changes"
                  : "Record evidence"}
              </button>

              {editingEvidenceId ? (
                <button
                  type="button"
                  onClick={resetEvidenceForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-3">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-emerald-700">
                        {NEA_STAGE_LABELS[item.stage]}
                      </p>
                      <p className="mt-1 font-black text-slate-950">
                        {item.title}
                      </p>
                    </div>

                    {canEdit ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => beginEditEvidence(item)}
                          className="text-xs font-black text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void deleteEvidence(item)
                          }
                          className="text-xs font-black text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  {item.referenceValue ? (
                    <p className="mt-2 break-all text-sm text-blue-700">
                      {item.referenceLabel ||
                        item.referenceValue}
                      {item.referenceLabel
                        ? `: ${item.referenceValue}`
                        : ""}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-violet-200 bg-violet-50 p-7">
            <p className="text-sm font-black uppercase tracking-widest text-violet-700">
              Socratic assistance
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Ask the NEA Coach
            </h2>

            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
              Guidance only. Assessed work must remain your own.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {guide.studentQuestions
                .slice(0, 3)
                .map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setCoachMessage(prompt)}
                    className="rounded-full border border-violet-200 bg-white px-3 py-2 text-left text-xs font-bold text-violet-800"
                  >
                    {prompt}
                  </button>
                ))}
            </div>

            <textarea
              value={coachMessage}
              onChange={(event) =>
                setCoachMessage(event.target.value)
              }
              rows={6}
              maxLength={2000}
              className="mt-5 w-full resize-y rounded-xl border border-violet-200 bg-white px-4 py-3"
            />

            <button
              type="button"
              onClick={() => void askCoach()}
              disabled={coachLoading}
              className="mt-4 rounded-xl bg-violet-700 px-6 py-3 font-black text-white disabled:opacity-50"
            >
              {coachLoading
                ? "Thinking..."
                : "Ask NEA Coach"}
            </button>

            {coachReply ? (
              <div className="mt-5 max-h-[32rem] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-white p-5 text-sm leading-7 text-slate-800 shadow-inner">
                {coachReply}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-teal-700">
              Teacher feedback
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Feedback history
            </h2>

            <div className="mt-5 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
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
                  </div>
                ))
              )}
            </div>
          </section>

          {project.status === "active" &&
          allStagesComplete ? (
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                Final workflow
              </p>
              <h2 className="mt-2 text-2xl font-black text-emerald-950">
                Ready for teacher review
              </h2>
              <button
                type="button"
                onClick={() => void submitProject()}
                disabled={saving}
                className="mt-4 rounded-xl bg-emerald-700 px-6 py-3 font-black text-white disabled:opacity-50"
              >
                Submit project for review
              </button>
            </section>
          ) : null}
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
      <p className="text-sm text-blue-100">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
