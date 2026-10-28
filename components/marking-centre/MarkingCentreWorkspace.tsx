"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CandidateScriptManager from "@/components/marking-centre/CandidateScriptManager";
import PaperStructureManager from "@/components/marking-centre/PaperStructureManager";

type Paper = { id: string; title: string };
type Exam = { id: string; title: string; subject: string; yearGroup: string; qualificationLevel?: string; papers?: Paper[]; totalMarks?: number | null; candidateCount: number };
type Candidate = { code: string; status: string };
type DocKind = "questionPaper" | "markScheme" | "gradeBoundaries";
const subjects = ["Art and Design", "Biology", "Business", "Chemistry", "Combined Science", "Computer Science", "Creative iMedia", "Design and Technology", "Drama", "Economics", "English Language", "English Literature", "French", "Geography", "German", "History", "Mathematics", "Media Studies", "Music", "Physical Education", "Physics", "Psychology", "Religious Studies", "Sociology", "Spanish"];
const levels = ["KS3", "GCSE", "AS Level", "A Level", "BTEC", "Cambridge National", "Other"];
const documentTypes: { kind: DocKind; label: string }[] = [{ kind: "questionPaper", label: "Question paper" }, { kind: "markScheme", label: "Mark scheme" }, { kind: "gradeBoundaries", label: "Grade boundaries (optional)" }];

type Section = "overview" | "setup" | "candidates" | "structures" | "marking" | "results";
const tabs: { id: Section; title: string; hint: string }[] = [
  { id: "overview", title: "My exams", hint: "Start or continue an examination" },
  { id: "setup", title: "Upload exam", hint: "Question papers and mark schemes" },
  { id: "candidates", title: "Upload scripts", hint: "Add all candidate scripts" },
  { id: "structures", title: "Check mark scheme", hint: "Verify the AI proposal once" },
  { id: "marking", title: "Mark and approve", hint: "Process scripts and check exceptions" },
  { id: "results", title: "Download results", hint: "Grades, feedback and subject QLA" },
];
export default function MarkingCentreWorkspace({ section, initialExamId }: { section: Section; initialExamId?: string }) {
  const { user, loading } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selected, setSelected] = useState<Exam | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [yearGroup, setYearGroup] = useState("Year 11");
  const [qualificationLevel, setQualificationLevel] = useState("GCSE");
  const [paperTitles, setPaperTitles] = useState(["Paper 1"]);
  const [count, setCount] = useState(100);
  const [uploading, setUploading] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<Record<string, Record<string, string>>>({});
  const [paperLocks, setPaperLocks] = useState<Record<string, boolean>>({});
  const initialOpened = useRef(false);

  const call = useCallback(async (path: string, method = "GET", payload?: unknown) => {
    if (!user) throw new Error("Please sign in.");
    const response = await fetch(path, { method, headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(payload ? { "Content-Type": "application/json" } : {}) }, ...(payload ? { body: JSON.stringify(payload) } : {}), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }, [user]);
  const refresh = useCallback(async () => {
    const data = await call("/api/marking-centre/exams");
    setExams(data.exams);
    return data.exams as Exam[];
  }, [call]);
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void call("/api/marking-centre/exams").then(data => { if (!cancelled) setExams(data.exams); }).catch(error => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load examinations."); });
    return () => { cancelled = true; };
  }, [user, call]);

  useEffect(() => {
    if (!initialExamId || initialOpened.current || exams.length === 0) return;
    const match = exams.find(exam => exam.id === initialExamId);
    if (!match) return;
    initialOpened.current = true;
    void openExam(match);
    // Initial examination selection is only applied once per page navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exams, initialExamId]);
  function href(target: Section, examId?: string) {
    const base = target === "overview" ? "/teacher/marking-centre" : `/teacher/marking-centre/${target}`;
    return examId ? `${base}?examId=${encodeURIComponent(examId)}` : base;
  }
  async function createExam(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const result = await call("/api/marking-centre/exams", "POST", { title, subject, yearGroup, qualificationLevel, papers: paperTitles.map(p => ({ title: p })) });
      setTitle(""); setPaperTitles(["Paper 1"]);
      const updated = await refresh();
      const created = updated.find(exam => exam.id === result.id);
      if (created) await openExam(created);
      setMessage("Examination created. Upload the question paper and mark scheme for each paper below.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create examination."); }
    finally { setBusy(false); }
  }
  async function openExam(exam: Exam) {
    setSelected(exam); setCandidates([]); setDocuments({}); setPaperLocks({}); setMessage("");
    try {
      const data = await call(`/api/marking-centre/exams/${exam.id}/candidates`);
      setCandidates(data.candidates);
      await Promise.all((exam.papers ?? []).map(async paper => {
        const response = await call(`/api/marking-centre/exams/${exam.id}/papers/${paper.id}/documents`);
        try {
          const status = await call(`/api/marking-centre/exams/${exam.id}/papers/${paper.id}/structure`);
          setPaperLocks(previous => ({
            ...previous,
            [paper.id]: status.structure?.status === "approved"
          }));
        } catch {
          setPaperLocks(previous => ({ ...previous, [paper.id]: true }));
          setMessage("Some approval statuses could not be loaded. Document uploads are locked for safety.");
        }
        setDocuments(previous => ({ ...previous, [paper.id]: Object.fromEntries((response.documents as {kind:string;filename:string}[]).map(d => [d.kind, d.filename])) }));
      }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load examination details."); }
  }
  async function editExam(exam: Exam) {
    const nextTitle = window.prompt("Examination title", exam.title);
    if (nextTitle === null) return;
    const nextSubject = window.prompt("Subject", exam.subject);
    if (nextSubject === null) return;
    const nextYear = window.prompt("Year group", exam.yearGroup);
    if (nextYear === null) return;
    const nextLevel = window.prompt("Qualification level", exam.qualificationLevel ?? "GCSE");
    if (nextLevel === null) return;
    setBusy(true);
    try {
      await call(`/api/marking-centre/exams/${exam.id}`, "PATCH", { title: nextTitle, subject: nextSubject, yearGroup: nextYear, qualificationLevel: nextLevel });
      const updated = await refresh();
      if (selected?.id === exam.id) setSelected(updated.find(e => e.id === exam.id) ?? null);
      setMessage("Examination details updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed."); }
    finally { setBusy(false); }
  }
  async function deleteExam(exam: Exam) {
    if (!window.confirm(`Delete examination "${exam.title}"? Only empty examinations can be deleted. This cannot be undone.`)) return;
    setBusy(true);
    try {
      await call(`/api/marking-centre/exams/${exam.id}`, "DELETE");
      if (selected?.id === exam.id) { setSelected(null); setCandidates([]); setDocuments({}); }
      await refresh();
      setMessage("Empty examination deleted.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Deletion failed."); }
    finally { setBusy(false); }
  }
  async function generate() {
    if (!selected) return;
    setBusy(true); setMessage("Generating codes...");
    try {
      const exam = selected;
      let generated = 0;
      for (let remaining = count; remaining > 0; remaining -= Math.min(remaining, 100)) {
        const batch = Math.min(remaining, 100);
        const result = await call(`/api/marking-centre/exams/${exam.id}/candidates`, "POST", { count: batch });
        generated += result.codes.length;
        setMessage(`Generated ${generated} of ${count} codes...`);
      }
      const data = await call(`/api/marking-centre/exams/${exam.id}/candidates`);
      setCandidates(data.candidates);
      const updated = await refresh();
      setSelected(updated.find(item => item.id === exam.id) ?? exam);
      setMessage(`${generated} unique candidate codes created successfully.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create codes."); }
    finally { setBusy(false); }
  }
  async function upload(paperId: string, kind: DocKind, file: File | undefined) {
    if (!file || !selected || !user) return;
    if (kind !== "gradeBoundaries") {
      if (paperLocks[paperId] !== false) {
        setMessage("Documents locked or approval status unavailable.");
        return;
      }
      try {
        const latest = await call(`/api/marking-centre/exams/${selected.id}/papers/${paperId}/structure`);
        if (latest.structure?.status === "approved") {
          setPaperLocks(previous => ({ ...previous, [paperId]: true }));
          setMessage("Approved - documents locked.");
          return;
        }
      } catch {
        setMessage("Unable to verify approval status. Upload cancelled.");
        return;
      }
    }
    if (file.type !== "application/pdf" || file.size > 12 * 1024 * 1024) { setMessage("Upload a PDF smaller than 12 MB."); return; }
    setBusy(true); setUploading(`${paperId}_${kind}`); setMessage(`Uploading ${file.name}...`);
    try {
      const form = new FormData(); form.append("kind", kind); form.append("file", file);
      const response = await fetch(`/api/marking-centre/exams/${selected.id}/papers/${paperId}/documents`, { method: "POST", headers: { Authorization: `Bearer ${await user.getIdToken()}` }, body: form, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setDocuments(previous => ({ ...previous, [paperId]: { ...previous[paperId], [kind]: data.filename } }));
      setMessage(`${data.filename} uploaded successfully.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); setUploading(null); }
  }
  function exportCodes() {
    if (!selected) return;
    const rows = [["Examination", "Subject", "Year group", "Qualification level", "Candidate code", "Student name (optional)"], ...candidates.map(candidate => [selected.title, selected.subject, selected.yearGroup, selected.qualificationLevel ?? "", candidate.code, ""])];
    const csv = rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `candidate-codes-${selected.id}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  if (loading) return <main className="p-8">Loading Marking Centre...</main>;
  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-9">
    <header className="space-y-2"><p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">CS Master · Teacher workspace</p><h1 className="text-3xl font-bold tracking-tight">AI Examination Marking Centre</h1><p className="text-sm text-slate-600">Upload an exam, add scripts, check the marking and download reports. Your existing examinations and records are preserved.</p></header>
    <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
      <nav aria-label="Marking Centre stages" className="self-start rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-5">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{tabs.map((tab, i) => <Link key={tab.id} aria-current={section === tab.id ? "page" : undefined} href={href(tab.id, selected?.id ?? initialExamId)} className={`rounded-lg px-3 py-3 text-sm transition-colors ${section === tab.id ? "bg-indigo-700 text-white" : "text-slate-700 hover:bg-slate-100"}`}><span className="font-semibold">{i + 1}. {tab.title}</span><span className={`mt-1 hidden text-xs lg:block ${section === tab.id ? "text-indigo-100" : "text-slate-500"}`}>{tab.hint}</span></Link>)}</div>
      </nav>
      <div className="min-w-0 space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-slate-500">Current stage</p><h2 className="text-xl font-bold">{tabs.find(t => t.id === section)?.title}</h2></div><label className="text-sm font-medium">Examination<select className="ml-2 max-w-72 rounded-lg border border-slate-300 bg-white p-2 text-sm" value={selected?.id ?? ""} onChange={e => { const exam = exams.find(x => x.id === e.target.value); if (exam) void openExam(exam); }}><option value="">Select an examination</option>{exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}</select></label></div>
          {selected && <p className="mt-2 text-sm text-slate-600">{selected.title} · {selected.subject} · {selected.qualificationLevel ?? "Qualification not set"} · {selected.papers?.length ?? 0} papers · {selected.candidateCount} candidates</p>}
        </section>
        {message && <p role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm">{message}</p>}
        {section === "overview" && <div className="space-y-5">
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Your examinations</h2>
        <Link href={href("setup", selected?.id ?? initialExamId)} className="inline-flex items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">+ Create new examination</Link>
      </div>
      {exams.length === 0 ? <p className="text-slate-600">No examinations created yet.</p> : <div className="grid gap-3 md:grid-cols-2">{exams.map(exam => <div key={exam.id} className="rounded-lg border p-4"><Link href={href("setup", exam.id)} className="block w-full text-left hover:text-indigo-700"><strong>{exam.title}</strong><p className="text-sm text-slate-600">{exam.subject} · {exam.yearGroup} · {exam.qualificationLevel ?? "Legacy exam"} · {exam.papers?.length ?? 1} papers · {exam.candidateCount} codes</p></Link><div className="mt-3 flex gap-2"><button type="button" disabled={busy} onClick={() => void editExam(exam)} className="rounded border px-3 py-1 text-sm">Edit details</button><button type="button" disabled={busy} onClick={() => void deleteExam(exam)} className="rounded border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></div></div>)}</div>}
    </section>
          <section className="rounded-xl border bg-white p-5"><h2 className="text-lg font-semibold">Continue your workflow</h2><p className="mt-2 text-sm text-slate-600">Choose an examination above. Upload its papers and mark scheme, upload candidate scripts, check the approved criteria, process the cohort and download reports. Only scripts requiring attention should need individual investigation.</p></section></div>}
        {section === "setup" && <div className="space-y-5">
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-xl font-semibold">Create an examination</h2>
      <form onSubmit={createExam} className="space-y-4">
        <label className="block text-sm font-medium">Examination title<input required maxLength={140} value={title} onChange={event => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border p-2" placeholder="Year 11 Mock Examination" /></label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium">Subject (search or enter your own)<input required list="marking-subjects" maxLength={80} value={subject} onChange={event => setSubject(event.target.value)} className="mt-1 w-full rounded-lg border p-2"/><datalist id="marking-subjects">{subjects.map(s => <option key={s} value={s}/>)}</datalist></label>
          <label className="block text-sm font-medium">Year group<select value={yearGroup} onChange={event => setYearGroup(event.target.value)} className="mt-1 w-full rounded-lg border p-2">{Array.from({ length: 7 }, (_, i) => `Year ${i + 7}`).map(y => <option key={y}>{y}</option>)}</select></label>
          <label className="block text-sm font-medium">Qualification level<select value={qualificationLevel} onChange={event => setQualificationLevel(event.target.value)} className="mt-1 w-full rounded-lg border p-2">{levels.map(l => <option key={l}>{l}</option>)}</select></label>
        </div>
        <div className="space-y-3"><h3 className="font-semibold">Examination papers</h3><p className="text-sm text-slate-600">Add one or more papers. Upload documents after creating the examination.</p>
          {paperTitles.map((paper, index) => <div key={index} className="flex gap-2"><label className="flex-1 text-sm">Paper {index + 1}<input required maxLength={120} value={paper} onChange={event => setPaperTitles(old => old.map((p, i) => i === index ? event.target.value : p))} className="mt-1 w-full rounded-lg border p-2"/></label><button type="button" disabled={paperTitles.length === 1} onClick={() => setPaperTitles(old => old.filter((_, i) => i !== index))} className="self-end rounded-lg border px-3 py-2 disabled:opacity-40">Remove</button></div>)}
          <button type="button" disabled={paperTitles.length >= 12} onClick={() => setPaperTitles(old => [...old, `Paper ${old.length + 1}`])} className="rounded-lg border px-4 py-2">+ Add another paper</button>
        </div><button disabled={busy || !user} className="rounded-lg bg-indigo-700 px-5 py-3 font-medium text-white disabled:opacity-50">{busy ? "Please wait..." : "Create examination"}</button>
      </form>
    </section>
          {selected && <section className="space-y-5 rounded-xl border bg-white p-5"><h2 className="text-lg font-semibold">{selected.title} — paper documents</h2>
      {selected.papers?.map(paper => <div key={paper.id} className="space-y-3 rounded-lg border p-4"><h3 className="font-semibold">{paper.title}</h3>{paperLocks[paper.id] === true && <p className="text-sm font-semibold text-amber-800">Approved or unavailable - documents locked</p>}<div className="grid gap-4 md:grid-cols-3">{documentTypes.map((doc, index) => <div key={doc.kind} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4"><div className="mb-2 text-sm font-bold">{index + 1}. {doc.label}</div><p className="mb-3 text-xs text-slate-600">{doc.kind === "questionPaper" ? "Examination questions (required)" : doc.kind === "markScheme" ? "Marking criteria and answers (required)" : "Official or school grade thresholds (optional)"}</p><label className="block text-xs font-semibold">Select PDF<input disabled={busy || (doc.kind !== "gradeBoundaries" && paperLocks[paper.id] !== false)} type="file" accept=".pdf,application/pdf" onChange={event => { void upload(paper.id, doc.kind, event.target.files?.[0]); event.target.value = ""; }} className="mt-2 block w-full text-xs"/></label><p className="mt-3 break-words text-xs" role="status">{uploading === `${paper.id}_${doc.kind}` ? "Uploading..." : documents[paper.id]?.[doc.kind] ? `Uploaded: ${documents[paper.id][doc.kind]}` : "No file uploaded"}</p></div>)}</div></div>)}

          </section>}
        </div>}
        {section === "candidates" && (selected ? <section className="space-y-5 rounded-xl border bg-white p-5"><h2 className="text-lg font-semibold">Candidate registration and uploads</h2>
      <div className="border-t pt-4"><h3 className="font-semibold">Anonymous candidate codes</h3><p className="mt-1 text-sm text-slate-600">One code per candidate, shared across all papers in this examination.</p><div className="my-4 flex flex-wrap items-end gap-3"><label className="text-sm">New codes (1–1,000 total)<input type="number" min={1} max={1000} value={count} onChange={event => setCount(Number(event.target.value))} className="mt-1 block w-32 rounded-lg border p-2"/></label><button disabled={busy || count < 1 || count > 1000 || count + (selected.candidateCount ?? 0) > 1000} onClick={() => void generate()} className="rounded-lg bg-indigo-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Working..." : "Generate codes"}</button><button disabled={candidates.length === 0} onClick={exportCodes} className="rounded-lg border px-4 py-2 disabled:opacity-50">Export code register (CSV)</button></div><p className="mb-3 text-sm">{candidates.length} candidates listed</p><div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-4">{candidates.map(candidate => <code key={candidate.code} className="rounded bg-slate-100 p-2 text-xs">{candidate.code}</code>)}</div></div>
          <CandidateScriptManager key={`${selected.id}-scripts`} examId={selected.id} papers={selected.papers ?? []} candidateCodes={candidates.map(c => c.code)} mode="scripts" qualificationLevel={selected.qualificationLevel}/></section> : <p className="rounded-xl border bg-white p-6">Select an examination to manage candidates.</p>)}
        {section === "structures" && (selected ? <section className="rounded-xl border bg-white p-5"><PaperStructureManager key={selected.id} examId={selected.id} papers={selected.papers ?? []}/></section> : <p className="rounded-xl border bg-white p-6">Select an examination to review mark schemes.</p>)}
        {section === "marking" && (selected ? <section className="rounded-xl border bg-white p-5"><CandidateScriptManager key={`${selected.id}-marking`} examId={selected.id} papers={selected.papers ?? []} candidateCodes={candidates.map(c => c.code)} mode="marking" qualificationLevel={selected.qualificationLevel}/></section> : <p className="rounded-xl border bg-white p-6">Select an examination to begin marking.</p>)}
        {section === "results" && (selected ? <section className="rounded-xl border bg-white p-5"><CandidateScriptManager key={`${selected.id}-results`} examId={selected.id} papers={selected.papers ?? []} candidateCodes={candidates.map(c => c.code)} mode="results" qualificationLevel={selected.qualificationLevel}/></section> : <p className="rounded-xl border bg-white p-6">Select an examination to view results.</p>)}
      </div>
    </div>
  </main>;
}
