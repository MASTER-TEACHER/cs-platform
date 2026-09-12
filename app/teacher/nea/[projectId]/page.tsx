"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useParams,
} from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import {
  NEA_STAGE_LABELS,
  NEA_STAGE_ORDER,
} from "@/lib/nea/constants";
import {
  NEA_STAGE_GUIDANCE,
} from "@/lib/nea/guidance";
import type {
  NeaEvidence,
  NeaFeedback,
  NeaMilestone,
  NeaProject,
  NeaTeacherNote,
} from "@/types/nea";

type DetailResponse = {
  project?: NeaProject;
  evidence?: NeaEvidence[];
  feedback?: NeaFeedback[];
  teacherNotes?: NeaTeacherNote[];
  error?: string;
};

export default function TeacherNeaProjectPage() {
  const params = useParams<{
    projectId: string;
  }>();

  const projectId = params.projectId;
  const { user } = useAuth();

  const [project, setProject] =
    useState<NeaProject | null>(null);
  const [evidence, setEvidence] =
    useState<NeaEvidence[]>([]);
  const [feedback, setFeedback] =
    useState<NeaFeedback[]>([]);
  const [teacherNotes, setTeacherNotes] =
    useState<NeaTeacherNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTodayDate(
        new Date().toISOString().slice(0, 10),
      );
    });
  }, []);

  const loadDetail = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken(true);

      const response = await fetch(
        `/api/nea/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result = (await response.json()) as
        DetailResponse;

      if (!response.ok || !result.project) {
        throw new Error(
          result.error ||
            "NEA project could not be loaded.",
        );
      }

      setProject(result.project);
      setEvidence(
        Array.isArray(result.evidence)
          ? result.evidence
          : [],
      );
      setFeedback(
        Array.isArray(result.feedback)
          ? result.feedback
          : [],
      );
      setTeacherNotes(
        Array.isArray(result.teacherNotes)
          ? result.teacherNotes
          : [],
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "NEA project could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    void Promise.resolve().then(() => loadDetail());
  }, [loadDetail]);

  async function patch(
    body: Record<string, unknown>,
  ) {
    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    const response = await fetch(
      `/api/nea/projects/${projectId}`,
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
    };

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ||
          "The NEA project could not be updated.",
      );
    }
  }

  async function saveFeedback() {
    try {
      setSaving(true);
      await patch({
        action: "add-feedback",
        message: feedbackText,
      });
      setFeedbackText("");
      toast.success("Student feedback saved.");
      await loadDetail();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Feedback could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveNote() {
    try {
      setSaving(true);
      await patch({
        action: "add-teacher-note",
        message: noteText,
      });
      setNoteText("");
      toast.success("Private teacher note saved.");
      await loadDetail();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Teacher note could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function setDueDate(
    milestone: NeaMilestone,
    dueDate: string,
  ) {
    try {
      await patch({
        action: "update-milestone",
        milestoneId: milestone.id,
        dueDate,
      });
      await loadDetail();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Milestone deadline could not be saved.",
      );
    }
  }

  async function changeStatus(
    action: string,
    successMessage: string,
  ) {
    if (
      !window.confirm(
        "Confirm this project status change.",
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await patch({ action });
      toast.success(successMessage);
      await loadDetail();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Project status could not be changed.",
      );
    } finally {
      setSaving(false);
    }
  }

  const stageEvidence = useMemo(
    () =>
      Object.fromEntries(
        NEA_STAGE_ORDER.map((stage) => [
          stage,
          evidence.filter(
            (item) => item.stage === stage,
          ),
        ]),
      ) as Record<string, NeaEvidence[]>,
    [evidence],
  );

  if (loading || !project) {
    return (
      <main className="mx-auto max-w-7xl">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/teacher/nea"
        className="inline-flex font-bold text-teal-700 hover:text-teal-900"
      >
        Back to NEA monitoring
      </Link>

      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-900 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-200">
          Student NEA review
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {project.title}
        </h1>

        <p className="mt-2 text-teal-100">
          {project.studentName} · {project.examBoard} A-level
        </p>

        <p className="mt-4 max-w-4xl leading-7 text-teal-100">
          {project.projectBrief}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Metric
            label="Progress"
            value={`${project.overallProgress}%`}
          />
          <Metric
            label="Status"
            value={project.status}
          />
          <Metric
            label="Evidence"
            value={String(project.evidenceCount)}
          />
          <Metric
            label="Feedback"
            value={String(project.teacherFeedbackCount)}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {NEA_STAGE_ORDER.map((stage) => {
          const milestones = project.milestones.filter(
            (item) => item.stage === stage,
          );
          const completed = milestones.filter(
            (item) => item.status === "complete",
          ).length;

          return (
            <article
              key={stage}
              className={`rounded-2xl border p-5 ${
                stage === project.currentStage
                  ? "border-teal-400 bg-teal-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-black text-slate-950">
                {NEA_STAGE_LABELS[stage]}
              </p>
              <p className="mt-2 text-2xl font-black text-teal-700">
                {project.stageProgress[stage]}%
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {completed}/{milestones.length} milestones
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {NEA_STAGE_ORDER.map((stage) => {
            const guide = NEA_STAGE_GUIDANCE[stage];
            const milestones = project.milestones.filter(
              (item) => item.stage === stage,
            );
            const evidenceItems =
              stageEvidence[stage] || [];

            return (
              <article
                key={stage}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-teal-700">
                      Stage review
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      {NEA_STAGE_LABELS[stage]}
                    </h2>
                  </div>

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-black text-teal-800">
                    {project.stageProgress[stage]}%
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {guide.purpose}
                </p>

                <div className="mt-5 space-y-3">
                  {milestones.map((milestone) => {
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
                          <p className="font-bold text-slate-900">
                            {milestone.title}
                          </p>
                          <p
                            className={`mt-1 text-xs font-bold uppercase ${
                              overdue
                                ? "text-rose-700"
                                : "text-slate-500"
                            }`}
                          >
                            {milestone.status.replace(
                              "_",
                              " ",
                            )}
                            {overdue ? " · overdue" : ""}
                          </p>
                        </div>

                        <label className="grid gap-1 text-xs font-bold text-slate-600">
                          Teacher deadline
                          <input
                            type="date"
                            value={milestone.dueDate || ""}
                            onChange={(event) =>
                              void setDueDate(
                                milestone,
                                event.target.value,
                              )
                            }
                            className="rounded-lg border border-slate-300 px-2 py-2 font-normal"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-black text-slate-950">
                    Evidence
                  </p>

                  {evidenceItems.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      No evidence recorded for this stage.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {evidenceItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl bg-slate-50 p-4"
                        >
                          <p className="font-black text-slate-950">
                            {item.title}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
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
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-teal-700">
              Latest student reflection
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {project.latestReflection ||
                "No reflection has been recorded yet."}
            </p>
          </section>

          <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">
              Feedback visible to student
            </p>

            <textarea
              rows={5}
              value={feedbackText}
              onChange={(event) =>
                setFeedbackText(event.target.value)
              }
              className="mt-4 w-full resize-y rounded-xl border border-blue-200 bg-white px-4 py-3"
              placeholder="Ask questions, identify gaps and direct the student back to their own evidence."
            />

            <button
              type="button"
              onClick={() => void saveFeedback()}
              disabled={
                saving ||
                feedbackText.trim().length < 5
              }
              className="mt-3 rounded-xl bg-blue-700 px-5 py-3 font-black text-white disabled:opacity-50"
            >
              Save student feedback
            </button>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white p-4"
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
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-violet-700">
              Private teacher notes
            </p>

            <p className="mt-2 text-sm text-violet-900">
              These notes are not returned to the student workspace.
            </p>

            <textarea
              rows={4}
              value={noteText}
              onChange={(event) =>
                setNoteText(event.target.value)
              }
              className="mt-4 w-full resize-y rounded-xl border border-violet-200 bg-white px-4 py-3"
              placeholder="Private monitoring note..."
            />

            <button
              type="button"
              onClick={() => void saveNote()}
              disabled={
                saving ||
                noteText.trim().length < 5
              }
              className="mt-3 rounded-xl bg-violet-700 px-5 py-3 font-black text-white disabled:opacity-50"
            >
              Save private note
            </button>

            <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
              {teacherNotes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white p-4"
                >
                  <p className="font-black text-slate-950">
                    {item.teacherName}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Project workflow
            </p>

            <div className="mt-4 grid gap-3">
              {project.status === "submitted" ? (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      void changeStatus(
                        "return-to-active",
                        "Project returned to active work.",
                      )
                    }
                    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-black text-amber-900"
                  >
                    Return to active work
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      void changeStatus(
                        "complete-project",
                        "Project marked complete.",
                      )
                    }
                    className="rounded-xl bg-emerald-700 px-4 py-3 font-black text-white"
                  >
                    Mark project complete
                  </button>
                </>
              ) : null}

              {project.status !== "archived" ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void changeStatus(
                      "archive-project",
                      "Project archived.",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-black text-slate-800"
                >
                  Archive project
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void changeStatus(
                      "restore-project",
                      "Project restored.",
                    )
                  }
                  className="rounded-xl bg-slate-950 px-4 py-3 font-black text-white"
                >
                  Restore archived project
                </button>
              )}
            </div>
          </section>
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
      <p className="text-sm text-teal-100">{label}</p>
      <p className="mt-1 break-words text-xl font-black capitalize">
        {value}
      </p>
    </div>
  );
}
