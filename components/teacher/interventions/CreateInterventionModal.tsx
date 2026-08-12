"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createIntervention } from "@/services/interventionService";
import type { InterventionCandidate } from "@/services/interventionAnalyticsService";
import type { InterventionPriority } from "@/types/intervention";

export default function CreateInterventionModal({
  candidate,
  teacherId,
  teacherName,
  onClose,
  onCreated,
}: {
  candidate: InterventionCandidate | null;
  teacherId: string;
  teacherName: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<InterventionPriority>("high");
  const [pathway, setPathway] = useState<
    "lesson" | "quiz" | "exam" | "complete"
  >("complete");
  const [dueDate, setDueDate] = useState("");
  const [lessonHref, setLessonHref] = useState("");
  const [quizId, setQuizId] = useState("");
  const [examId, setExamId] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!candidate) return;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setDueDate(date.toISOString().slice(0, 10));
    setTitle(`${candidate.priorityTopic} intervention`);
    setTopic(candidate.priorityTopic);
    setReason(candidate.recommendation);
    setPriority(candidate.priority === "low" ? "medium" : candidate.priority);
    setLessonHref(
      `/learn?search=${encodeURIComponent(candidate.priorityTopic)}`,
    );
  }, [candidate]);
  if (!candidate) return null;
  async function submit() {
    setSaving(true);
    try {
      await createIntervention({
        teacherId,
        teacherName,
        studentId: candidate!.student.uid,
        studentName: candidate!.student.name,
        studentEmail: candidate!.student.email,
        classId: candidate!.classId,
        className: candidate!.className,
        title,
        topic,
        reason,
        priority,
        baselineScore: candidate!.combinedAverage,
        dueDate: new Date(`${dueDate}T23:59:59`),
        pathway,
        lessonHref,
        quizAssignmentId: quizId,
        examAssignmentId: examId,
        xpPerStep: 25,
      });
      toast.success("Intervention created.");
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Intervention could not be created.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-600">
              Create intervention
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {candidate.student.name}
            </h2>
            <p className="text-sm text-slate-500">
              Baseline {candidate.combinedAverage}% · {candidate.className}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2 font-bold"
          >
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-bold">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
          <label>
            <span className="text-sm font-bold">Topic</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
          <label>
            <span className="text-sm font-bold">Priority</span>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as InterventionPriority)
              }
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-bold">Pathway</span>
            <select
              value={pathway}
              onChange={(e) => setPathway(e.target.value as typeof pathway)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="complete">Complete pathway</option>
              <option value="lesson">Lesson only</option>
              <option value="quiz">Quiz only</option>
              <option value="exam">Exam only</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-bold">Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
          <label className="md:col-span-2">
            <span className="text-sm font-bold">Reason</span>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
          {(pathway === "lesson" || pathway === "complete") && (
            <label className="md:col-span-2">
              <span className="text-sm font-bold">Lesson link</span>
              <input
                value={lessonHref}
                onChange={(e) => setLessonHref(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>
          )}
          {(pathway === "quiz" || pathway === "complete") && (
            <label>
              <span className="text-sm font-bold">
                Quiz assignment ID (optional)
              </span>
              <input
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>
          )}
          {(pathway === "exam" || pathway === "complete") && (
            <label>
              <span className="text-sm font-bold">
                Exam assignment ID (optional)
              </span>
              <input
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => void submit()}
            disabled={saving}
            className="rounded-xl bg-teal-600 px-5 py-3 font-bold text-white disabled:bg-slate-300"
          >
            {saving ? "Creating..." : "Create Intervention"}
          </button>
        </div>
      </div>
    </div>
  );
}
