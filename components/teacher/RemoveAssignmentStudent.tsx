"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";

type Kind = "general" | "quiz" | "programming" | "exam";
type Student = { id: string; name: string | null };
type Props = { assignmentId: string; kind: Kind; studentIds: string[] };

export default function RemoveAssignmentStudent({ assignmentId, kind, studentIds }: Props) {
  const [selected, setSelected] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [names, setNames] = useState<Record<string, string>>({});
  const [namesLoading, setNamesLoading] = useState(true);
  const endpoint = `/api/teacher-assignments/${kind}/${encodeURIComponent(assignmentId)}/students`;
  const studentIdsKey = studentIds.join("\u0000");
  const assignedIds = useMemo(() => new Set(studentIdsKey.split("\u0000").filter(Boolean)), [studentIdsKey]);
  const available = useMemo(() => studentIds.filter(id => !removed.includes(id)), [studentIds, removed]);

  useEffect(() => {
    let cancelled = false;
    async function loadNames() {
      setNames({});
      setNamesLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!response.ok) return;
        const result: { students?: Student[] } = await response.json();
        if (!cancelled) {
          const resolved: Record<string, string> = {};
          for (const student of result.students ?? []) {
            if (student.name && assignedIds.has(student.id)) resolved[student.id] = student.name;
          }
          setNames(resolved);
        }
      } catch {
        // Keep IDs visible when names cannot be verified.
      } finally {
        if (!cancelled) setNamesLoading(false);
      }
    }
    void loadNames();
    return () => { cancelled = true; };
  }, [endpoint, assignedIds]);

  const label = (id: string) => names[id] ? `${names[id]} (${id})` : id;

  async function remove() {
    if (!selected || busy) return;
    if (!window.confirm(`Permanently remove ${label(selected)} from this assignment and delete only their linked assignment results? Other students will remain assigned.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please sign in again.");
      const token = await user.getIdToken();
      const response = await fetch(`${endpoint}/${encodeURIComponent(selected)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || `Removal failed (${response.status}).`);
      setRemoved(previous => [...previous, selected]);
      setSelected("");
      setMessage("Student removed. Other recipients and their results were retained.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Removal failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!studentIds.length) return null;
  return (
    <section className="my-4 rounded-lg border p-4" aria-label="Remove student from assignment">
      <h3 className="font-semibold">Remove an individual student</h3>
      <p className="my-2 text-sm">This permanently removes only the selected student&apos;s assignment results. Verified student names are shown with IDs; unavailable names are shown as IDs only.</p>
      <div className="flex flex-wrap items-center gap-2">
        <select className="max-w-full rounded border p-2 text-sm" aria-label="Assigned student" value={selected} onChange={event => setSelected(event.target.value)} disabled={busy}>
          <option value="">{namesLoading ? "Loading student names…" : "Select assigned student"}</option>
          {available.map(id => <option key={id} value={id}>{label(id)}</option>)}
        </select>
        <button type="button" className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50" disabled={!selected || busy} onClick={remove}>
          {busy ? "Removing…" : "Remove selected student"}
        </button>
      </div>
      {message && <p role="status" className="mt-2 text-sm">{message}</p>}
    </section>
  );
}
