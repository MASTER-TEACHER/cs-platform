"use client";

import { useEffect, useState } from "react";
import { announceActivity } from "@/components/auth/IdleSessionGuard";

type Summary = { questionId: string; scripts: number; maxMarks: number };
type AnyQuestion = { questionId: string; maxMarks: number; checked: number; open: number };
type Item = {
  candidateCode: string; revision: number; answerText: string; awardedMarks: number; aiMarks: number;
  feedback: string; improvementGuidance: string; evidence: string; checked: boolean; needsCheck: boolean; reasons: string[];
};
type Detail = { question: { id: string; maxMarks: number; criteria: string; notes: string }; items: Item[] };
type Edit = { marks: number; reason: string };
type View = { url: string; page: number; pages: number | null };

type Props = {
  endpoint: string;
  paperIds: string[];
  getToken: () => Promise<string>;
  onSaved: () => void | Promise<unknown>;
  openScript: (paperId: string, candidateCode: string) => void;
};

/**
 * Check one question across every script, as examiners do. Each answer is shown with
 * the AI's mark and feedback; the teacher keeps or changes the mark. Saving records
 * the question as checked on every script listed.
 */
export default function QuestionCheckPanel({ endpoint, paperIds, getToken, onSaved, openScript }: Props) {
  const [paperId, setPaperId] = useState(paperIds[0] ?? "");
  const [summary, setSummary] = useState<Summary[] | null>(null);
  const [allQuestions, setAllQuestions] = useState<AnyQuestion[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Side panel: the candidate being viewed, their script link and the page shown.
  const [viewing, setViewing] = useState<string | null>(null);
  const [views, setViews] = useState<Record<string, View>>({});
  const [page, setPage] = useState(1);
  const [viewError, setViewError] = useState("");

  async function call(url: string, init?: RequestInit) {
    const response = await fetch(url, { ...init, cache: "no-store", headers: { Authorization: `Bearer ${await getToken()}`, "Content-Type": "application/json" } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function loadSummary(paper = paperId) {
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await call(`${endpoint}/by-question?${new URLSearchParams({ paperId: paper })}`);
      setSummary(data.questions);
      setAllQuestions(Array.isArray(data.all) ? data.all : []);
      setDetail(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load."); }
    finally { setBusy(false); }
  }

  async function openQuestion(questionId: string) {
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await call(`${endpoint}/by-question?${new URLSearchParams({ paperId, questionId })}`) as Detail;
      setDetail(data);
      setEdits(Object.fromEntries(data.items.map(item => [item.candidateCode, { marks: item.awardedMarks, reason: "" }])));
      announceActivity();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load."); }
    finally { setBusy(false); }
  }

  async function fetchView(code: string, questionId: string): Promise<View | null> {
    const key = `${code}:${questionId}`;
    if (views[key]) return views[key];
    try {
      const data = await call(`${endpoint}/view?${new URLSearchParams({ paperId, candidateCode: code, questionId })}`) as View;
      setViews(old => ({ ...old, [key]: data }));
      return data;
    } catch (e) { setViewError(e instanceof Error ? e.message : "Unable to open the script."); return null; }
  }

  async function show(code: string) {
    if (!detail) return;
    setViewError("");
    setViewing(code);
    announceActivity();
    const view = await fetchView(code, detail.question.id);
    if (view) setPage(view.page);
    // Get the next candidate's link ready, so moving on is instant.
    const index = detail.items.findIndex(i => i.candidateCode === code);
    const next = detail.items[index + 1];
    if (next) void fetchView(next.candidateCode, detail.question.id);
  }

  function step(direction: 1 | -1) {
    if (!detail || !viewing) return;
    const index = detail.items.findIndex(i => i.candidateCode === viewing);
    const target = detail.items[index + direction];
    if (target) void show(target.candidateCode);
  }

  function setMark(code: string, marks: number) {
    setEdits(old => ({ ...old, [code]: { reason: old[code]?.reason ?? "", marks } }));
  }

  // Keyboard: 0-9 set the mark, N / right arrow next, P / left arrow previous, Esc closes.
  useEffect(() => {
    if (!viewing || !detail) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "Escape") setViewing(null);
      else if (event.key === "ArrowRight" || event.key.toLowerCase() === "n") step(1);
      else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "p") step(-1);
      else if (/^\d$/.test(event.key) && Number(event.key) <= detail.question.maxMarks) setMark(viewing, Number(event.key));
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function save() {
    if (!detail) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const decisions = detail.items.map(item => ({
        candidateCode: item.candidateCode, expectedRevision: item.revision,
        awardedMarks: edits[item.candidateCode]?.marks ?? item.awardedMarks,
        ...(edits[item.candidateCode]?.reason.trim() ? { reason: edits[item.candidateCode].reason.trim() } : {}),
      }));
      const data = await call(`${endpoint}/by-question`, { method: "POST", body: JSON.stringify({ paperId, questionId: detail.question.id, decisions }) });
      const failed = (data.outcomes as { candidateCode: string; saved: boolean; reason?: string }[]).filter(o => !o.saved);
      const changed = decisions.filter(d => d.awardedMarks !== detail.items.find(i => i.candidateCode === d.candidateCode)?.awardedMarks).length;
      setViewing(null);
      setMessage(`Question ${detail.question.id}: ${data.saved} script(s) checked${changed ? `, ${changed} mark(s) changed` : ""}.${failed.length ? ` Not saved: ${failed.map(f => `${f.candidateCode} (${f.reason})`).join("; ")}.` : ""}`);
      await onSaved();
      await loadSummary();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save."); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-2 rounded border-2 border-indigo-300 p-3">
      <p className="text-sm font-semibold">Check by question (fastest)</p>
      <p className="text-xs text-slate-700">
        Check one question across every script at once: each candidate&apos;s answer, the AI&apos;s mark and its reason are shown side by side with the mark scheme. Keep or change each mark, then save. Once every question to check is done, the scripts can be approved together.
      </p>
      <div className="flex flex-wrap items-end gap-2">
        {paperIds.length > 1 && (
          <label className="text-xs">Paper{" "}
            <select className="rounded border p-1" value={paperId} onChange={e => { setPaperId(e.target.value); void loadSummary(e.target.value); }}>
              {paperIds.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </label>
        )}
        <button type="button" className="rounded border px-3 py-1 text-sm" disabled={busy || !paperId} onClick={() => void loadSummary()}>
          {summary ? "Refresh questions to check" : "Show questions to check"}
        </button>
      </div>

      {summary && !detail && (summary.length === 0
        ? <p className="rounded bg-emerald-50 p-2 text-sm text-emerald-900">Nothing left to check on this paper. Use sample moderation (or approve individually) to finish.</p>
        : <div className="flex flex-wrap gap-2">{summary.map(q => (
            <button key={q.questionId} type="button" className="rounded border border-amber-400 bg-amber-50 px-3 py-1 text-sm" disabled={busy} onClick={() => void openQuestion(q.questionId)}>
              Q{q.questionId} <span className="text-xs text-slate-600">· {q.scripts} script(s) · {q.maxMarks} mark(s)</span>
            </button>))}</div>)}
      {summary && !detail && allQuestions.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer">Any question (check a question the AI got wrong on your sample, on every script)</summary>
          <div className="mt-2 flex flex-wrap gap-1">{allQuestions.map(q => (
            <button key={q.questionId} type="button" disabled={busy} onClick={() => void openQuestion(q.questionId)}
              className={`rounded border px-2 py-1 text-xs ${q.open && q.checked === q.open ? "border-emerald-500 bg-emerald-50" : "bg-white"}`}>
              Q{q.questionId}{q.open && q.checked === q.open ? " ✓" : q.checked ? ` (${q.checked}/${q.open})` : ""}
            </button>))}</div>
        </details>
      )}

      {detail && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">Question {detail.question.id} ({detail.question.maxMarks} marks) · {detail.items.length} script(s)</p>
            <button type="button" className="text-xs text-indigo-700 underline" onClick={() => setDetail(null)}>Back to question list</button>
          </div>
          <details className="rounded bg-slate-50 p-2 text-xs" open>
            <summary className="cursor-pointer font-semibold">Mark scheme</summary>
            <p className="mt-1 whitespace-pre-wrap">{detail.question.criteria}</p>
            {detail.question.notes && <p className="mt-1 whitespace-pre-wrap text-slate-600">{detail.question.notes}</p>}
          </details>
          <div className="max-h-[32rem] space-y-2 overflow-auto">
            {detail.items.map(item => {
              const edit = edits[item.candidateCode] ?? { marks: item.awardedMarks, reason: "" };
              const changed = edit.marks !== item.awardedMarks;
              return (
                <div key={item.candidateCode} className={`grid gap-2 rounded border p-2 text-xs md:grid-cols-[1fr_1fr_auto] ${item.needsCheck ? "border-amber-400" : ""} ${changed ? "bg-indigo-50" : ""}`}>
                  <div>
                    <p className="font-semibold">{item.candidateCode}{item.checked && <span className="ml-2 font-normal text-emerald-800">checked</span>}</p>
                    <p className="mt-1 whitespace-pre-wrap rounded bg-white p-1">{item.answerText || <em>No answer</em>}</p>
                  </div>
                  <div>
                    <p><strong>AI: {item.aiMarks}/{detail.question.maxMarks}</strong>{item.awardedMarks !== item.aiMarks && ` · current ${item.awardedMarks}`}. {item.feedback}</p>
                    {item.reasons.length > 0 && <p className="mt-1 text-amber-900">{item.reasons.join(" · ")}</p>}
                    <details className="mt-1"><summary className="cursor-pointer text-slate-600">AI evidence</summary><p className="whitespace-pre-wrap text-slate-600">{item.evidence}</p></details>
                    <button type="button" className="mt-1 text-indigo-700 underline" onClick={() => void show(item.candidateCode)}>View script</button>
                  </div>
                  <div className="space-y-1 md:w-48">
                    <div className="flex flex-wrap gap-1" role="group" aria-label={`Mark for ${item.candidateCode}`}>
                      {Array.from({ length: detail.question.maxMarks + 1 }, (_, n) => (
                        <button key={n} type="button" aria-pressed={edit.marks === n}
                          className={`min-w-7 rounded border px-2 py-1 ${edit.marks === n ? "border-indigo-700 bg-indigo-700 text-white" : "bg-white"}`}
                          onClick={() => setEdits(old => ({ ...old, [item.candidateCode]: { ...edit, marks: n } }))}>{n}</button>
                      ))}
                    </div>
                    {changed && <input className="w-full rounded border p-1" placeholder="Reason (optional)" value={edit.reason} maxLength={1500}
                      onChange={e => setEdits(old => ({ ...old, [item.candidateCode]: { ...edit, reason: e.target.value } }))} />}
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={busy} onClick={() => void save()}>
            Save: question {detail.question.id} checked on {detail.items.length} script(s)
          </button>
          <p className="text-xs text-slate-600">Marks you leave unchanged are recorded as checked and kept. Changed marks replace the AI feedback with a short teacher note, which you can edit when you open the script.</p>
        </div>
      )}
      {detail && viewing && (() => {
        const index = detail.items.findIndex(i => i.candidateCode === viewing);
        const item = detail.items[index];
        if (!item) return null;
        const edit = edits[item.candidateCode] ?? { marks: item.awardedMarks, reason: "" };
        const view = views[`${item.candidateCode}:${detail.question.id}`];
        const changed = edit.marks !== item.awardedMarks;
        return (
          <aside role="dialog" aria-label={`Script ${item.candidateCode}, question ${detail.question.id}`}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l-2 border-indigo-300 bg-white shadow-2xl md:w-[58vw]">
            <div className="flex flex-wrap items-center gap-2 border-b bg-indigo-50 p-2 text-sm">
              <strong>Q{detail.question.id} · {item.candidateCode}</strong>
              <span className="text-xs text-slate-600">{index + 1} of {detail.items.length}</span>
              <div className="ml-auto flex gap-1">
                <button type="button" className="rounded border bg-white px-2 py-1 text-xs" disabled={index === 0} onClick={() => step(-1)}>← Previous</button>
                <button type="button" className="rounded border bg-white px-2 py-1 text-xs" disabled={index === detail.items.length - 1} onClick={() => step(1)}>Next →</button>
                <button type="button" className="rounded border bg-white px-2 py-1 text-xs" onClick={() => openScript(paperId, item.candidateCode)}>Whole review</button>
                <button type="button" aria-label="Close" className="rounded border bg-white px-2 py-1 text-xs" onClick={() => setViewing(null)}>✕</button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b px-2 py-1 text-xs">
              <button type="button" className="rounded border px-2" disabled={page <= 1} onClick={() => setPage(n => Math.max(1, n - 1))}>◀</button>
              <span>Page {page}{view?.pages ? ` of ${view.pages}` : ""}{view && page === view.page ? " (answer found here)" : ""}</span>
              <button type="button" className="rounded border px-2" disabled={Boolean(view?.pages && page >= view.pages)} onClick={() => setPage(n => n + 1)}>▶</button>
              {view && page !== view.page && <button type="button" className="text-indigo-700 underline" onClick={() => setPage(view.page)}>Back to answer page</button>}
            </div>
            <div className="min-h-0 flex-1 bg-slate-100">
              {view
                ? <iframe key={`${item.candidateCode}-${page}`} title={`Script ${item.candidateCode}`} src={`${view.url}#page=${page}&view=FitH&toolbar=0&navpanes=0`} className="h-full w-full" />
                : <p className="p-4 text-sm">{viewError || "Opening script..."}</p>}
            </div>

            <div className="space-y-2 border-t bg-white p-3 text-xs">
              <details>
                <summary className="cursor-pointer text-slate-600">AI reading of the answer</summary>
                <p className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-1">{item.answerText || "No answer"}</p>
              </details>
              <p><strong>AI: {item.aiMarks}/{detail.question.maxMarks}.</strong> {item.feedback}</p>
              {item.reasons.length > 0 && <p className="text-amber-900">{item.reasons.join(" · ")}</p>}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">Your mark:</span>
                {Array.from({ length: detail.question.maxMarks + 1 }, (_, n) => (
                  <button key={n} type="button" aria-pressed={edit.marks === n}
                    className={`min-w-9 rounded border px-3 py-2 text-sm ${edit.marks === n ? "border-indigo-700 bg-indigo-700 text-white" : "bg-white"}`}
                    onClick={() => setMark(item.candidateCode, n)}>{n}</button>
                ))}
                {changed && <input className="min-w-40 flex-1 rounded border p-1" placeholder="Reason (optional)" value={edit.reason} maxLength={1500}
                  onChange={e => setEdits(old => ({ ...old, [item.candidateCode]: { ...edit, reason: e.target.value } }))} />}
                <button type="button" className="ml-auto rounded bg-indigo-700 px-3 py-2 text-sm text-white" onClick={() => index === detail.items.length - 1 ? setViewing(null) : step(1)}>
                  {index === detail.items.length - 1 ? "Done: back to list" : "Next candidate →"}
                </button>
              </div>
              <p className="text-slate-500">Keys: 0–{Math.min(9, detail.question.maxMarks)} set the mark · N or → next · P or ← previous · Esc close. Nothing is saved until you click Save under the list.</p>
            </div>
          </aside>
        );
      })()}
      {message && <p role="status" className="text-sm text-emerald-900">{message}</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
