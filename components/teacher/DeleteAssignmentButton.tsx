"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type Kind = "general" | "quiz" | "programming" | "exam";

export default function DeleteAssignmentButton({
  assignmentId,
  kind,
  returnTo,
}: {
  assignmentId: string;
  kind: Kind;
  returnTo: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (busy || !assignmentId) return;
    if (!window.confirm("Permanently delete this assignment and its linked submissions and results? This cannot be undone.")) return;
    if (!window.confirm("Final confirmation: permanently delete this assignment?")) return;
    setBusy(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please sign in again.");
      const token = await user.getIdToken();
      const endpoint = kind === "exam"
        ? `/api/exam-assignments/${encodeURIComponent(assignmentId)}/delete`
        : `/api/teacher-assignments/${kind}/${encodeURIComponent(assignmentId)}/delete`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || `Deletion failed (${response.status}).`);
      router.push(returnTo);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Deletion failed. Please retry.");
      setBusy(false);
    }
  }

  return (
    <div className="my-4 flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy || !assignmentId}
        className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        {busy ? "Deleting assignment…" : "Permanently delete assignment"}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
