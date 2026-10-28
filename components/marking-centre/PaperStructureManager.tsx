"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Paper = { id: string; title: string };
type Question = { id: string; maxMarks: number; criteria: string; notes: string };
type Suggestion = { questions: Question[]; warnings: string[]; model: string; source: string; sourceHash: string; generatedAt?: string };
type Structure = { status: "draft" | "approved"; questionText?: string; markSchemeText?: string; questionPages?: number; markSchemePages?: number; questionTextTruncated?: boolean; markSchemeTextTruncated?: boolean; questions?: Question[]; totalMarks?: number };
const empty = (): Question => ({ id: "", maxMarks: 1, criteria: "", notes: "" });
export default function PaperStructureManager({ examId, papers }: { examId: string; papers: Paper[] }) {
  const { user } = useAuth();
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const [structure, setStructure] = useState<Structure | null>(null);
  const [questions, setQuestions] = useState<Question[]>([empty()]);
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [message, setMessage] = useState("");
  const endpoint = `/api/marking-centre/exams/${examId}/papers/${paperId}/structure`;
  const call = useCallback(async (method: string, payload?: unknown) => {
    if (!user) throw new Error("Please sign in.");
    const response = await fetch(endpoint, { method, headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(payload ? { "Content-Type": "application/json" } : {}) }, ...(payload ? { body: JSON.stringify(payload) } : {}), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }, [endpoint, user]);
  useEffect(() => {
    if (!user || !paperId) return;
    let cancelled = false;
    void call("GET").then(data => {
      if (cancelled) return;
      const result = (data.structure ?? null) as Structure | null;
      setStructure(result);
      setQuestions(result?.questions?.length ? result.questions : [empty()]);
    }).catch(error => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load paper structure."); });
    return () => { cancelled = true; };
  }, [call, paperId, user]);
  async function generateSuggestions() {
    if (busy) return;
    if (questions.some(q => q.id.trim() && q.criteria.trim()) && !window.confirm("Generate a new proposal? Your current form will remain unchanged until you explicitly apply the proposal.")) return;
    setBusy(true); setMessage("Analysing question paper and mark scheme with AI...");
    try {
      const result = await call("PATCH", { action: "suggest" }) as { suggestion: Suggestion };
      setSuggestion(result.suggestion);
      setMessage(`Generated ${result.suggestion.questions.length} question suggestions. Review the warnings and apply when ready.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "AI generation failed."); }
    finally { setBusy(false); }
  }
  function applySuggestion() {
    if (!suggestion || locked) return;
    if (!window.confirm("Replace the unsaved form with the AI proposal? Saved draft data will not change until you click Save draft.")) return;
    setQuestions(suggestion.questions);
    setMessage("AI suggestions copied into the editor. Check the source PDFs and save the draft when satisfied.");
  }
  async function perform(method: "POST" | "PUT", approve = false) {
    if (busy) return;
    if (approve && !window.confirm("Approve and lock this paper's question structure? It cannot be edited in Phase 3.")) return;
    setBusy(true); setMessage(method === "POST" ? "Extracting PDF text..." : "Saving question structure...");
    try {
      const result = await call(method, method === "PUT" ? { questions, approve } : undefined);
      const fresh = await call("GET");
      const next = (fresh.structure ?? null) as Structure | null;
      setStructure(next);
      setQuestions(next?.questions?.length ? next.questions : [empty()]);
      setSuggestion(null);
      setMessage(result.message || (approve ? `Approved structure (${result.totalMarks} marks).` : `Draft saved (${result.totalMarks} marks).`));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Operation failed."); }
    finally { setBusy(false); }
  }
  function update(index: number, patch: Partial<Question>) { setQuestions(previous => previous.map((question, i) => i === index ? { ...question, ...patch } : question)); }
  const locked = structure?.status === "approved";
  const total = questions.reduce((sum, q) => sum + (Number.isFinite(q.maxMarks) ? q.maxMarks : 0), 0);
  return <section className="space-y-4 border-t pt-5">
    <div><h3 className="text-lg font-semibold">Phase 3 — Question and mark scheme verification</h3><p className="text-sm text-slate-600">Extract PDF text and automatically propose question numbers, marks and marking criteria. Review the proposal before approval. No candidate marks are awarded here.</p></div>
    <label className="block max-w-sm text-sm">Paper<select className="mt-1 block w-full rounded border p-2" value={paperId} disabled={busy} onChange={event => { setPaperId(event.target.value); setStructure(null); setQuestions([empty()]); setSuggestion(null); setMessage(""); }}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={busy || locked || !paperId} onClick={() => void perform("POST")} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "Working..." : "Extract uploaded PDFs"}</button><span className="text-sm">Status: <strong>{structure?.status ?? "Not extracted"}</strong></span></div>
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={busy || locked || !structure?.questionText?.trim() || !structure?.markSchemeText?.trim()} onClick={() => void generateSuggestions()} className="rounded bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "Working..." : "Auto-populate from PDFs (AI)"}</button><span className="text-xs text-slate-600">AI creates a reviewable proposal; approved records are never overwritten.</span></div>
    {suggestion && <div className="space-y-2 rounded border border-amber-400 bg-amber-50 p-3 text-sm"><strong>AI proposal — {suggestion.questions.length} questions, {suggestion.questions.reduce((n, q) => n + q.maxMarks, 0)} marks</strong><p>AI suggestions can be incorrect. Compare each mark and criterion against the official PDF before approval.</p>{suggestion.warnings.length > 0 && <ul className="list-disc pl-5">{suggestion.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul>}{locked ? <p className="font-medium text-amber-900">This paper is approved and locked. The proposal is preview-only; the approved structure has not changed.</p> : <button type="button" onClick={applySuggestion} className="rounded bg-emerald-700 px-3 py-2 text-white">Apply proposal to editor</button>}<details><summary>Review proposed question data</summary><pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(suggestion.questions, null, 2)}</pre></details></div>}
    {message && <p role="status" className="rounded bg-indigo-50 p-3 text-sm">{message}</p>}
    {structure && <div className="grid gap-3 md:grid-cols-2">{([{ title: "Question paper", text: structure.questionText, pages: structure.questionPages, truncated: structure.questionTextTruncated }, { title: "Mark scheme", text: structure.markSchemeText, pages: structure.markSchemePages, truncated: structure.markSchemeTextTruncated }]).map(item => <div key={item.title} className="rounded border p-3"><h4 className="font-semibold">{item.title} — {item.pages ?? "?"} page(s)</h4>{item.truncated && <p className="text-xs text-amber-700">Text truncated for review. Check the original PDF.</p>}{!item.text?.trim() && <p className="text-xs text-amber-700">No selectable text detected. Scanned PDFs need manual transcription or future visual extraction.</p>}<pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words bg-slate-50 p-2 text-xs">{item.text || "No extracted text."}</pre></div>)}</div>}
    <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">Verified question structure — {total} total marks</h4><button type="button" disabled={busy || locked || questions.length >= 150} onClick={() => setQuestions(previous => [...previous, empty()])} className="rounded border px-3 py-1 text-sm disabled:opacity-40">+ Add question</button></div><p className="text-xs text-slate-600">Use Auto-populate to propose the structure, then check question IDs, maximum marks and criteria against the official PDFs. Manual editing remains available.</p>
      {questions.map((q, i) => <div key={i} className="grid gap-2 rounded border p-3 md:grid-cols-5"><label className="text-xs">Question ID<input disabled={busy || locked} value={q.id} onChange={event => update(i, { id: event.target.value })} placeholder="1a" className="mt-1 w-full rounded border p-2"/></label><label className="text-xs">Max marks<input disabled={busy || locked} type="number" min={1} max={100} value={q.maxMarks} onChange={event => update(i, { maxMarks: Number(event.target.value) })} className="mt-1 w-full rounded border p-2"/></label><label className="text-xs md:col-span-2">Marking criteria<textarea disabled={busy || locked} rows={3} maxLength={6000} value={q.criteria} onChange={event => update(i, { criteria: event.target.value })} className="mt-1 w-full rounded border p-2" placeholder="Accepted answers, partial-credit rules and marking points"/></label><div className="space-y-2"><label className="block text-xs">Teacher notes<textarea disabled={busy || locked} rows={2} maxLength={2000} value={q.notes} onChange={event => update(i, { notes: event.target.value })} className="mt-1 w-full rounded border p-2"/></label><button type="button" disabled={busy || locked || questions.length === 1} onClick={() => setQuestions(previous => previous.filter((_, j) => j !== i))} className="text-xs text-red-700 disabled:opacity-40">Remove</button></div></div>)}
      <div className="flex flex-wrap gap-3"><button type="button" disabled={busy || locked} onClick={() => void perform("PUT")} className="rounded border px-4 py-2 text-sm disabled:opacity-40">Save draft</button><button type="button" disabled={busy || locked || !structure?.questionText?.trim() || !structure?.markSchemeText?.trim() || questions.some(q => !q.id.trim() || !q.criteria.trim() || !Number.isInteger(q.maxMarks) || q.maxMarks < 1)} onClick={() => void perform("PUT", true)} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-40">Approve and lock</button></div>
      {locked && <p className="text-sm text-green-800">Teacher-approved question structure saved. Marking is not enabled yet.</p>}
    </div>
  </section>;
}
