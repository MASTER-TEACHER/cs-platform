"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Paper = { id: string; title: string };
type Question = { id: string; maxMarks: number; criteria: string; notes: string; needsCriteria?: boolean };
type Suggestion = { questions: Question[]; warnings: string[]; declaredTotal?: number | null; model: string; source: string; sourceHash: string; generatedAt?: string };
type Structure = { status: "draft" | "approved"; questionText?: string; markSchemeText?: string; questionPages?: number; markSchemePages?: number; questionTextTruncated?: boolean; markSchemeTextTruncated?: boolean; questions?: Question[]; totalMarks?: number; criteriaProvenance?: string; schemeSource?: "uploaded" | "no_uploaded_scheme" | "teacher_entered" };
const empty = (): Question => ({ id: "", maxMarks: 1, criteria: "", notes: "" });
type Review = { warnings: string[]; declaredTotal: number | null };

/** Warnings that mention this question ID (not part of a longer number or ID). */
function warningsFor(id: string, warnings: string[]): string[] {
  const clean = id.trim();
  if (!clean) return [];
  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?<![\\w(])${escaped}(?![\\w(])`, "i");
  return warnings.filter(w => pattern.test(w));
}
export default function PaperStructureManager({ examId, papers }: { examId: string; papers: Paper[] }) {
  const { user } = useAuth();
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const [structure, setStructure] = useState<Structure | null>(null);
  const [questions, setQuestions] = useState<Question[]>([empty()]);
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [criteriaOrigin, setCriteriaOrigin] = useState<
    "manual" | "ai-assisted"
  >("manual");
  const [message, setMessage] = useState("");
  // The AI's warnings and the paper's printed total stay with the editor (and this
  // browser) after the proposal is applied, so the red and amber boxes remain.
  const [review, setReview] = useState<Review>({ warnings: [], declaredTotal: null });
  const reviewKey = `csmaster:structureReview:${examId}:${paperId}`;
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(reviewKey) || "null");
      setReview(saved && Array.isArray(saved.warnings) ? saved : { warnings: [], declaredTotal: null });
    } catch { setReview({ warnings: [], declaredTotal: null }); }
  }, [reviewKey]);
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
      setCriteriaOrigin(
        result?.criteriaProvenance?.includes("ai_")
          ? "ai-assisted"
          : "manual"
      );
      setQuestions(result?.questions?.length ? result.questions : [empty()]);
    }).catch(error => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load paper structure."); });
    return () => { cancelled = true; };
  }, [call, paperId, user]);
  async function generateSuggestions() {
    if (busy) return;
    if (questions.some(q => q.id.trim() && q.criteria.trim()) && !window.confirm("Generate a new proposal? Your current form will remain unchanged until you explicitly apply the proposal.")) return;
    setBusy(true); setMessage(structure?.markSchemeText?.trim() ? "Analysing both PDFs..." : "Generating an unofficial draft mark scheme from the question paper...");
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
    setCriteriaOrigin("ai-assisted");
    const next = { warnings: suggestion.warnings, declaredTotal: suggestion.declaredTotal ?? null };
    setReview(next);
    try { window.localStorage.setItem(reviewKey, JSON.stringify(next)); } catch { /* ignore */ }
    setMessage("AI suggestions copied into the editor. Check the source PDFs and save the draft when satisfied.");
  }
  async function perform(method: "POST" | "PUT", approve = false) {
    if (busy) return;
    if (approve && !window.confirm("Approve and lock this paper's question structure? It cannot be edited in Phase 3.")) return;
    setBusy(true); setMessage(method === "POST" ? "Extracting PDF text..." : "Saving question structure...");
    try {
      const result = await call(method, method === "PUT" ? { questions, approve, criteriaOrigin } : undefined);
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
    <label className="block max-w-sm text-sm">Paper<select className="mt-1 block w-full rounded border p-2" value={paperId} disabled={busy} onChange={event => { setPaperId(event.target.value); setStructure(null); setQuestions([empty()]); setSuggestion(null); setCriteriaOrigin("manual"); setMessage(""); }}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
    {structure && !structure.markSchemeText?.trim() && <p role="status" className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">No official mark scheme uploaded. You can generate an unofficial AI draft, edit all criteria and approve the verified version. AI suggestions are not official awarding-body criteria.</p>}
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={busy || locked || !paperId} onClick={() => void perform("POST")} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "Working..." : "Extract uploaded PDFs"}</button><span className="text-sm">Status: <strong>{structure?.status ?? "Not extracted"}</strong></span></div>
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={busy || locked || !structure?.questionText?.trim() || Boolean(structure?.questionTextTruncated)} onClick={() => void generateSuggestions()} className="rounded bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "Working..." : structure?.markSchemeText?.trim() ? "Auto-populate from PDFs (AI)" : "Generate Draft Mark Scheme (AI)"}</button><span className="text-xs text-slate-600">AI creates a reviewable proposal; approved records are never overwritten.</span></div>
    {suggestion && (
      <div className="space-y-4 rounded border border-amber-400 bg-amber-50 p-4 text-sm">
        <div>
          <h4 className="font-semibold">
            AI proposal — {suggestion.questions.length} questions,
            {" "}
            {suggestion.questions.reduce((sum, question) => sum + question.maxMarks, 0)} marks
          </h4>

          <p className="mt-2 text-amber-950">
            {structure?.markSchemeText?.trim()
              ? "AI-assisted proposal based on the uploaded question paper and mark scheme. Verify that all criteria match the supplied mark scheme before approval."
              : "UNOFFICIAL AI-generated draft. No mark scheme was uploaded. Independently verify every answer, marking point and mark allocation before approval."}
          </p>
        </div>

        {suggestion.warnings.length > 0 && (
          <div>
            <h5 className="font-medium">Review warnings</h5>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {suggestion.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <h5 className="font-semibold">
            Proposed question-by-question criteria
          </h5>

          {suggestion.questions.map((question, index) => (
            <div
              key={`${question.id}-${index}`}
              className={`rounded bg-white p-3 ${question.criteria.trim() ? "border border-amber-200" : "border-2 border-red-600"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h6 className="font-semibold">
                  Question {question.id}
                </h6>

                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">
                  {question.maxMarks}{" "}
                  {question.maxMarks === 1 ? "mark" : "marks"}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-700">
                  Proposed marking criteria
                </p>

                {question.criteria.trim()
                  ? <div className="mt-1 whitespace-pre-wrap break-words rounded bg-slate-50 p-3 leading-relaxed">{question.criteria}</div>
                  : <div className="mt-1 rounded bg-red-50 p-3 font-semibold text-red-800">Criteria needed: the mark scheme answer for this question could not be read. Apply the proposal, then type the criteria in the red box.</div>}
              </div>

              {question.notes.trim() && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-700">
                    Teacher notes
                  </p>

                  <div className="mt-1 whitespace-pre-wrap break-words rounded bg-slate-50 p-3">
                    {question.notes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!locked ? (
          <button
            type="button"
            disabled={busy}
            onClick={applySuggestion}
            className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-40"
          >
            Apply proposal to editor
          </button>
        ) : (
          <p className="font-medium text-amber-900">
            This structure is approved and locked.
            No changes can be applied.
          </p>
        )}
      </div>
    )}
    {message && <p role="status" className="rounded bg-indigo-50 p-3 text-sm">{message}</p>}
    {structure && <div className="grid gap-3 md:grid-cols-2">{([{ title: "Question paper", text: structure.questionText, pages: structure.questionPages, truncated: structure.questionTextTruncated }, { title: "Mark scheme", text: structure.markSchemeText, pages: structure.markSchemePages, truncated: structure.markSchemeTextTruncated }]).map(item => <div key={item.title} className="rounded border p-3"><h4 className="font-semibold">{item.title} — {item.pages ?? "?"} page(s)</h4>{item.truncated && <p className="text-xs text-amber-700">Text truncated for review. Check the original PDF.</p>}{!item.text?.trim() && <p className="text-xs text-amber-700">No selectable text detected. Scanned PDFs need manual transcription or future visual extraction.</p>}<pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words bg-slate-50 p-2 text-xs">{item.text || "No extracted text."}</pre></div>)}</div>}
    <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">Verified question structure — {total} total marks</h4><button type="button" disabled={busy || locked || questions.length >= 150} onClick={() => setQuestions(previous => [...previous, empty()])} className="rounded border px-3 py-1 text-sm disabled:opacity-40">+ Add question</button></div><p className="text-xs text-slate-600">Review question IDs, maximum marks, answers and partial-credit rules before approval. Where a mark scheme was uploaded, compare against that document. Otherwise, independently verify the unofficial AI draft against the question paper. Manual editing is available until approval.</p>
      {(() => {
        const needs = questions.filter(q => q.id.trim() && !q.criteria.trim());
        const checks = questions.filter(q => q.criteria.trim() && warningsFor(q.id, review.warnings).length);
        const offTotal = review.declaredTotal !== null && review.declaredTotal !== total;
        if (locked || (!needs.length && !checks.length && !offTotal)) return null;
        const jump = (id: string) => document.getElementById(`structure-q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return <div className="space-y-2">
          {(needs.length > 0 || offTotal) && <div role="alert" className="rounded border-2 border-red-600 bg-red-50 p-3 text-sm text-red-900">
            <p className="font-semibold">You need to add something before approving</p>
            {offTotal && <p>The question paper says <strong>{review.declaredTotal} marks</strong>, but these questions add up to <strong>{total}</strong>. {total < (review.declaredTotal ?? 0) ? "Add the missing question(s) with + Add question." : "Check for a duplicated question or wrong marks."}</p>}
            {needs.length > 0 && <p>Criteria needed for: {needs.map(q => <button key={q.id} type="button" className="mr-2 font-semibold underline" onClick={() => jump(q.id)}>{q.id} ({q.maxMarks})</button>)}</p>}
          </div>}
          {checks.length > 0 && <div className="rounded border-2 border-amber-500 bg-amber-50 p-3 text-sm text-amber-950">
            <p className="font-semibold">Check against the mark scheme (the AI raised a warning)</p>
            <p>{checks.map(q => <button key={q.id} type="button" className="mr-2 underline" onClick={() => jump(q.id)}>{q.id}</button>)}</p>
          </div>}
        </div>;
      })()}
      {questions.map((q, i) => { const missing = !locked && Boolean(q.id.trim()) && !q.criteria.trim(); const warned = !locked && !missing ? warningsFor(q.id, review.warnings) : []; return <div key={i} id={`structure-q-${q.id.trim()}`} className={`grid gap-2 rounded p-3 md:grid-cols-5 ${missing ? "border-2 border-red-600 bg-red-50" : warned.length ? "border-2 border-amber-500" : "border"}`}>
        {missing && <p className="text-sm font-semibold text-red-800 md:col-span-5">Criteria needed: the AI could read the question and its {q.maxMarks} mark(s), but not the mark scheme answer. Type the accepted answers and how marks are given.</p>}
        {warned.length > 0 && <p className="text-xs text-amber-900 md:col-span-5"><strong>Check:</strong> {warned.join(" · ")}</p>}<label className="text-xs">Question ID<input disabled={busy || locked} value={q.id} onChange={event => update(i, { id: event.target.value })} placeholder="1a" className="mt-1 w-full rounded border p-2"/></label><label className="text-xs">Max marks<input disabled={busy || locked} type="number" min={1} max={100} value={q.maxMarks} onChange={event => update(i, { maxMarks: Number(event.target.value) })} className="mt-1 w-full rounded border p-2"/></label><label className="text-xs md:col-span-2">Marking criteria<textarea disabled={busy || locked} rows={8} maxLength={6000} value={q.criteria} onChange={event => update(i, { criteria: event.target.value })} className={`mt-1 w-full rounded p-2 ${missing ? "border-2 border-red-600 bg-white" : "border"}`} placeholder="Accepted answers, partial-credit rules and marking points"/></label><div className="space-y-2"><label className="block text-xs">Teacher notes<textarea disabled={busy || locked} rows={5} maxLength={4000} value={q.notes} onChange={event => update(i, { notes: event.target.value })} className="mt-1 w-full rounded border p-2"/></label><button type="button" disabled={busy || locked || questions.length === 1} onClick={() => setQuestions(previous => previous.filter((_, j) => j !== i))} className="text-xs text-red-700 disabled:opacity-40">Remove</button></div></div>; })}
      <div className="flex flex-wrap gap-3"><button type="button" disabled={busy || locked} onClick={() => void perform("PUT")} className="rounded border px-4 py-2 text-sm disabled:opacity-40">Save draft</button><button type="button" disabled={busy || locked || !structure?.questionText?.trim() || questions.some(q => !q.id.trim() || !q.criteria.trim() || !Number.isInteger(q.maxMarks) || q.maxMarks < 1)} onClick={() => void perform("PUT", true)} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-40">Approve and lock</button></div>
      {!locked && questions.some(q => !q.id.trim() || !q.criteria.trim()) && <p className="text-sm font-semibold text-red-800">Approve and lock is unavailable until every question has an ID and criteria (see the red boxes). Save draft keeps your work in the meantime.</p>}
      {locked && <p className="text-sm text-green-800">Teacher-approved question structure saved. Marking is not enabled yet.</p>}
    </div>
  </section>;
}
