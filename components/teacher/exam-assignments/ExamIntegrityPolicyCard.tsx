"use client";

import {
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import { updateExamIntegrityPolicy } from "@/services/examAssignmentService";

import type {
  ExamAssignment,
  ExamIntegrityPolicy,
  ExamVisibilityAction,
} from "@/types/examAssignment";

export default function ExamIntegrityPolicyCard({
  assignment,
  teacherId,
  onSaved,
}: {
  assignment: ExamAssignment;
  teacherId: string;
  onSaved: (
    policy: ExamIntegrityPolicy,
  ) => void;
}) {
  const [
    policy,
    setPolicy,
  ] = useState<ExamIntegrityPolicy>(
    assignment.integrityPolicy,
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  async function save() {
    try {
      setSaving(true);

      const updated =
        await updateExamIntegrityPolicy({
          assignmentId: assignment.id,
          teacherId,
          policy,
        });

      setPolicy(updated);
      onSaved(updated);

      toast.success(
        "Exam integrity settings saved.",
      );
    } catch (error) {
      console.error(
        "Unable to save exam integrity settings:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Integrity settings could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-indigo-200">
      <div className="bg-gradient-to-r from-indigo-950 to-violet-900 p-6 text-white">
        <div className="flex items-center gap-2 text-indigo-200">
          <ShieldCheck className="h-5 w-5" />

          <p className="text-xs font-black uppercase tracking-[0.16em]">
            Exam integrity monitoring
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black">
          Integrity settings
        </h2>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-white/75">
          CS Master records fullscreen and page-visibility events to support
          teacher review. This is integrity monitoring, not a guaranteed
          lockdown browser.
        </p>
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-2">
        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={policy.enabled}
            onChange={(event) =>
              setPolicy(
                (
                  current: ExamIntegrityPolicy,
                ) => ({
                  ...current,
                  enabled:
                    event.target.checked,
                }),
              )
            }
            className="mt-1 h-4 w-4"
          />

          <div>
            <p className="font-black text-slate-900">
              Enable integrity monitoring
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Use the monitored exam-entry workflow and record enabled
              integrity events for this assignment.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={policy.fullscreenRequired}
            disabled={!policy.enabled}
            onChange={(event) =>
              setPolicy(
                (
                  current: ExamIntegrityPolicy,
                ) => ({
                  ...current,
                  fullscreenRequired:
                    event.target.checked,
                }),
              )
            }
            className="mt-1 h-4 w-4"
          />

          <div>
            <p className="font-black text-slate-900">
              Require fullscreen
            </p>

            <p className="mt-1 text-sm text-slate-500">
              When enabled, leaving fullscreen starts the fixed five-second
              return countdown.
            </p>
          </div>
        </label>

        <div className="rounded-2xl bg-red-50 p-4">
          <p className="font-black text-red-950">
            Fullscreen exit rule
          </p>

          <p className="mt-2 text-sm leading-6 text-red-800">
            If fullscreen is required, leaving fullscreen starts a visible
            5-second countdown. If the learner does not return before it
            reaches zero, the exam is automatically terminated and submitted.
          </p>
        </div>

        <label className="rounded-2xl bg-slate-50 p-4">
          <span className="text-sm font-black text-slate-900">
            Page-hidden response
          </span>

          <select
            value={policy.visibilityAction}
            disabled={
              !policy.enabled ||
              !policy.monitorPageVisibility
            }
            onChange={(event) =>
              setPolicy(
                (
                  current: ExamIntegrityPolicy,
                ) => ({
                  ...current,
                  visibilityAction:
                    event.target
                      .value as ExamVisibilityAction,
                }),
              )
            }
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold disabled:opacity-60"
          >
            <option value="warn">
              Warn and record
            </option>

            <option value="pause">
              Pause and require resume
            </option>

            <option value="auto_submit">
              Auto-submit immediately
            </option>
          </select>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 lg:col-span-2">
          <input
            type="checkbox"
            checked={policy.monitorPageVisibility}
            disabled={!policy.enabled}
            onChange={(event) =>
              setPolicy(
                (
                  current: ExamIntegrityPolicy,
                ) => ({
                  ...current,
                  monitorPageVisibility:
                    event.target.checked,
                }),
              )
            }
            className="mt-1 h-4 w-4"
          />

          <div>
            <p className="font-black text-slate-900">
              Monitor page visibility
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Record when the exam tab becomes hidden and when it becomes
              visible again. Choose whether a hidden page records a warning,
              pauses the exam, or immediately submits it.
            </p>
          </div>
        </label>
      </div>

      <div className="flex justify-end border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={() =>
            void save()
          }
          disabled={saving}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-700 px-5 text-sm font-black text-white disabled:opacity-60"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : "Save integrity settings"}
        </button>
      </div>
    </Card>
  );
}