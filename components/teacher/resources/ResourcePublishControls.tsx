"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Loader2,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  GeneratedTeachingResource,
  updateTeacherResourceStatus,
} from "@/services/teacherResourceService";

type ResourceStatus = "draft" | "published" | "archived";

type ResourcePublishControlsProps = {
  resourceId: string;
  status: ResourceStatus;
  content: GeneratedTeachingResource;
  onStatusChange: (status: ResourceStatus) => void;
};

type ConfirmationAction = "publish" | "unpublish" | null;

function validateResourceForPublishing(
  resource: GeneratedTeachingResource,
): string[] {
  const issues: string[] = [];

  if (!resource.title?.trim()) {
    issues.push("The resource needs a title.");
  }

  if (!resource.topic?.trim()) {
    issues.push("The resource needs a topic.");
  }

  if (!resource.overview?.trim()) {
    issues.push("The resource needs an overview.");
  }

  if (
    !resource.learningObjectives ||
    resource.learningObjectives.length === 0 ||
    resource.learningObjectives.some((objective) => !objective.trim())
  ) {
    issues.push("Add at least one complete learning objective.");
  }

  if (
    !resource.successCriteria ||
    resource.successCriteria.length === 0 ||
    resource.successCriteria.some((criterion) => !criterion.trim())
  ) {
    issues.push("Add at least one complete success criterion.");
  }

  if (!resource.sections || resource.sections.length === 0) {
    issues.push("Add at least one lesson section.");
  } else {
    const incompleteSection = resource.sections.some(
      (section) =>
        !section.title?.trim() ||
        !section.teacherInstructions?.trim() ||
        !section.studentTask?.trim(),
    );

    if (incompleteSection) {
      issues.push(
        "Every lesson section needs a title, teacher instructions and student task.",
      );
    }
  }

  if (
    !resource.assessmentQuestions ||
    resource.assessmentQuestions.length === 0
  ) {
    issues.push("Add at least one assessment question.");
  } else {
    const incompleteQuestion = resource.assessmentQuestions.some(
      (question) =>
        !question.question?.trim() ||
        !question.answer?.trim() ||
        question.marks < 1,
    );

    if (incompleteQuestion) {
      issues.push(
        "Every assessment question needs a question, model answer and valid mark value.",
      );
    }
  }

  return issues;
}

export default function ResourcePublishControls({
  resourceId,
  status,
  content,
  onStatusChange,
}: ResourcePublishControlsProps) {
  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction>(null);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccess(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success]);

  useEffect(() => {
    if (!confirmationAction) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updating) {
        setConfirmationAction(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmationAction, updating]);

  function openPublishConfirmation() {
    const issues = validateResourceForPublishing(content);

    setError(null);
    setSuccess(null);
    setValidationIssues(issues);
    setConfirmationAction("publish");
  }

  function openUnpublishConfirmation() {
    setError(null);
    setSuccess(null);
    setValidationIssues([]);
    setConfirmationAction("unpublish");
  }

  function closeConfirmation() {
    if (updating) {
      return;
    }

    setConfirmationAction(null);
    setValidationIssues([]);
  }

  async function confirmStatusChange() {
    if (!confirmationAction) {
      return;
    }

    if (confirmationAction === "publish" && validationIssues.length > 0) {
      return;
    }

    const newStatus: ResourceStatus =
      confirmationAction === "publish" ? "published" : "draft";

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      await updateTeacherResourceStatus(resourceId, newStatus);

      onStatusChange(newStatus);

      setSuccess(
        newStatus === "published"
          ? "Resource published successfully."
          : "Resource returned to draft.",
      );

      setConfirmationAction(null);
      setValidationIssues([]);
    } catch (caughtError) {
      console.error("Failed to update resource status:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The resource status could not be updated.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {status === "archived" ? (
          <div className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600">
            Archived · restore this resource from the Content Hub
          </div>
        ) : status === "draft" ? (
          <button
            type="button"
            onClick={openPublishConfirmation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Publish resource
          </button>
        ) : (
          <button
            type="button"
            onClick={openUnpublishConfirmation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Return to draft
          </button>
        )}

        {success && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-emerald-800 shadow-2xl"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">Status updated</p>

              <p className="mt-1 text-sm">{success}</p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess(null)}
              aria-label="Close notification"
              className="ml-2 text-slate-400 transition hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {confirmationAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div
                  className={
                    confirmationAction === "publish"
                      ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
                      : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"
                  }
                >
                  {confirmationAction === "publish" ? (
                    <FileCheck2 className="h-6 w-6" />
                  ) : (
                    <RotateCcw className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <h2
                    id="status-dialog-title"
                    className="text-xl font-bold text-slate-950"
                  >
                    {confirmationAction === "publish"
                      ? "Publish resource?"
                      : "Return resource to draft?"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {confirmationAction === "publish"
                      ? "Publishing marks this resource as reviewed and ready for future exporting or assignment."
                      : "The resource will no longer be marked as published. Its content will not be deleted."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={updating}
                aria-label="Close confirmation"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="p-6">
              {confirmationAction === "publish" &&
                validationIssues.length === 0 && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="font-bold text-emerald-900">Resource ready</p>

                    <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Required lesson content is complete
                      </li>

                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Learning objectives and success criteria are present
                      </li>

                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Assessment questions include model answers
                      </li>
                    </ul>
                  </div>
                )}

              {confirmationAction === "publish" &&
                validationIssues.length > 0 && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                      <div>
                        <p className="font-bold text-red-900">
                          Resource not ready
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                          Complete the following items before publishing:
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2 pl-8 text-sm text-red-800">
                      {validationIssues.map((issue) => (
                        <li key={issue} className="list-disc">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {error && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">Status not updated</p>

                    <p className="mt-1 text-sm leading-6">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeConfirmation}
                disabled={updating}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void confirmStatusChange()}
                disabled={
                  updating ||
                  (confirmationAction === "publish" &&
                    validationIssues.length > 0)
                }
                className={
                  confirmationAction === "publish"
                    ? "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    : "inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                }
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating status...
                  </>
                ) : confirmationAction === "publish" ? (
                  <>
                    <Send className="h-4 w-4" />
                    Publish resource
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Return to draft
                  </>
                )}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
