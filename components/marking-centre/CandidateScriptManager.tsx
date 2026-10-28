"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Paper = { id: string; title: string };
type Script = { paperId: string; candidateCode: string; filename: string; size: number; uploadedAt: string | null };
type ExtractionPreview = {
  paperId: string;
  candidateCode: string;
  filename: string | null;
  approvedQuestions: { id: string; maxMarks: number }[];
  extraction: {
    status: "requires_vision_or_manual_transcription" | "truncated_review_required" | "text_available_review_required";
    pages: number;
    truncated: boolean;
    text: string;
  };
  markingEnabled: false;
  teacherReviewRequired: true;
};
type AlignmentResult = {
  paperId: string;
  candidateCode: string;
  answers: { questionId: string; answerText: string; confidence: "high" | "medium" | "low" | "missing"; warning: string }[];
  warnings: string[];
  model: string;
  teacherReviewRequired: true;
  markingEnabled: false;
};
type ReviewFlag = { questionId: string; code: string; detail: string };
type QueueRow = { paperId: string; candidateCode: string; filename: string; status: string; revision: number; flagged: boolean; bulkEligible?: boolean; flags: ReviewFlag[] };
type MarkReview = { qualityFlags?: ReviewFlag[]; paperId: string; candidateCode: string; status: string; revision: number; stale?: boolean; total?: number; marks: { questionId: string; answerText: string; awardedMarks: number; feedback: string; improvementGuidance?: string; evidence: string; confidence: "high" | "medium" | "low"; needsReview: boolean; teacherJustification?: string }[] };
type Pending = { id: number; file: File; candidateCode: string; paperId: string; replace: boolean };
type Props = { examId: string; papers: Paper[]; candidateCodes: string[]; mode?: "scripts" | "marking" | "results"; qualificationLevel?: string };
const LIMIT = 12 * 1024 * 1024;
const BATCH = 20;
function estimatedBoundaries(level: string, maximum: number) {
  const profile: readonly (readonly [string, number])[] = level.trim().toLowerCase() === "a level"
    ? [["A*", 0.8], ["A", 0.7], ["B", 0.6], ["C", 0.5], ["D", 0.4], ["E", 0.3]]
    : [["9", 0.9], ["8", 0.8], ["7", 0.7], ["6", 0.6], ["5", 0.5], ["4", 0.4], ["3", 0.3], ["2", 0.2], ["1", 0.1]];
  const thresholds = profile.map(([grade, fraction]) => ({ grade, minimum: Math.ceil(maximum * fraction) }));
  return new Set(thresholds.map(b => b.minimum)).size === thresholds.length ? thresholds : null;
}
function matchCode(name: string, codes: string[]) {
  const matches = codes.filter(code => name.toUpperCase().includes(code));
  return matches.length === 1 ? matches[0] : "";
}
export default function CandidateScriptManager({ examId, papers, candidateCodes, mode = "scripts", qualificationLevel = "GCSE" }: Props) {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const [candidateCode, setCandidateCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [extractingKey, setExtractingKey] = useState<string | null>(null);
  const [preview, setPreview] = useState<ExtractionPreview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [aligning, setAligning] = useState(false);
  const [alignment, setAlignment] = useState<AlignmentResult | null>(null);
  const [alignmentError, setAlignmentError] = useState("");
  const [review, setReview] = useState<MarkReview | null>(null);
  const [auditHistory, setAuditHistory] = useState<{ id: string; action: string; revision: number; at: string | null; previousMarks: { questionId: string; awardedMarks: number }[] | null; marks: { questionId: string; awardedMarks: number; teacherJustification?: string }[] | null }[]>([]);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [queueError, setQueueError] = useState("");
  const [queueBusy, setQueueBusy] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [moderationNote, setModerationNote] = useState("");
  const [sampleChecked, setSampleChecked] = useState(false);
  const [showAdvancedQla, setShowAdvancedQla] = useState(false);
  const [topicText, setTopicText] = useState("");
  const [topicRevision, setTopicRevision] = useState(0);
  const [topicMessage, setTopicMessage] = useState("");
  const [batchProgress, setBatchProgress] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [results, setResults] = useState<{ allStructuresApproved: boolean; rows: { candidateCode: string; total: number | null; grade: string | null; status: string; paperScores: Record<string, number | null> }[]; papers: Paper[]; maximum: number; grading: { ready: boolean; revision: number; mode?: "internal" | "official"; boundaries: { grade: string; minimum: number }[]; sourceNote: string } } | null>(null);
  const [resultsError, setResultsError] = useState("");
  const [boundariesText, setBoundariesText] = useState("");
  const [boundarySource, setBoundarySource] = useState("");
  const [boundaryMode, setBoundaryMode] = useState<"internal" | "official">("internal");
  const [resultsMessage, setResultsMessage] = useState("");
  const [message, setMessage] = useState("");
  const [nextId, setNextId] = useState(1);
  const endpoint = `/api/marking-centre/exams/${examId}/scripts`;
  const refresh = useCallback(async () => {
    if (!user) return;
    const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load scripts.");
    setScripts(data.scripts);
  }, [endpoint, user]);
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadInitialScripts() {
      try {
        const token = await user!.getIdToken();
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load scripts.");
        }

        if (!cancelled) {
          setScripts(data.scripts);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load scripts."
          );
        }
      }
    }

    void loadInitialScripts();

    return () => {
      cancelled = true;
    };
  }, [endpoint, user]);
  const existing = useMemo(() => new Set(scripts.map(s => `${s.paperId}_${s.candidateCode}`)), [scripts]);
  function addFiles(files: FileList | null, selectedPaper: string, selectedCandidate = "") {
    if (!files) return;
    const additions = Array.from(files).map((file, index) => ({ id: nextId + index, file, paperId: selectedPaper, candidateCode: selectedCandidate || matchCode(file.name, candidateCodes), replace: false }));
    setNextId(n => n + additions.length);
    setPending(old => [...old, ...additions]);
    setMessage(`${additions.length} file(s) staged. Review candidate matching before uploading.`);
  }
  async function submit() {
    if (!user || pending.length === 0 || busy) return;
    if (pending.length > BATCH) { setMessage(`Upload a maximum of ${BATCH} files per batch.`); return; }
    const seen = new Set<string>();
    for (const item of pending) {
      if (!candidateCodes.includes(item.candidateCode) || !papers.some(p => p.id === item.paperId)) { setMessage("Every file must have a valid candidate and paper."); return; }
      if (!item.file.name.toLowerCase().endsWith(".pdf") || item.file.size < 5 || item.file.size > LIMIT || (item.file.type && item.file.type !== "application/pdf")) { setMessage("Only non-empty PDFs up to 12 MB are supported."); return; }
      const key = `${item.paperId}_${item.candidateCode}`;
      if (seen.has(key)) { setMessage("Two staged files target the same candidate and paper. Remove the duplicate."); return; }
      seen.add(key);
      if (existing.has(key) && !item.replace) { setMessage(`A script already exists for ${item.candidateCode}, ${item.paperId}. Tick Replace to proceed.`); return; }
    }
    setBusy(true); setMessage("Uploading candidate scripts...");
    try {
      const form = new FormData();
      form.set("manifest", JSON.stringify(pending.map(({ paperId, candidateCode, replace }) => ({ paperId, candidateCode, replace }))));
      pending.forEach((item, index) => form.append(`file_${index}`, item.file));
      const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${await user.getIdToken()}` }, body: form, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed. Refresh the script register before retrying; some files may have uploaded.");
      setPending([]);
      await refresh();
      setMessage(`${data.count} candidate script(s) uploaded successfully.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed. Refresh before retrying."); }
    finally { setBusy(false); }
  }
  async function previewScript(script: Script) {
    if (!user || extractingKey) return;
    const key = `${script.paperId}_${script.candidateCode}`;
    setExtractingKey(key);
    setPreview(null);
    setPreviewError("");
    setAlignment(null);
    setAlignmentError("");
    setReview(null);
    setReviewError(""); setReviewMessage("");
    try {
      const token = await user.getIdToken();
      const params = new URLSearchParams({
        paperId: script.paperId,
        candidateCode: script.candidateCode,
      });
      const response = await fetch(`${endpoint}/extract?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const error = result && typeof result === "object" && "error" in result
          ? String((result as { error: unknown }).error)
          : "Unable to extract this candidate script.";
        throw new Error(error);
      }
      const data = result as ExtractionPreview;
      if (!data.extraction || !Array.isArray(data.approvedQuestions) ||
          data.paperId !== script.paperId || data.candidateCode !== script.candidateCode) {
        throw new Error("Unexpected extraction response. Please try again.");
      }
      setPreview(data);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "Unable to extract script.");
    } finally {
      setExtractingKey(null);
    }
  }
  async function identifyAnswers() {
    if (!user || !preview || aligning || preview.extraction.status !== "text_available_review_required") return;
    setAligning(true);
    setAlignment(null);
    setAlignmentError("");
    try {
      const response = await fetch(`${endpoint}/align`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: preview.paperId, candidateCode: preview.candidateCode }),
        cache: "no-store",
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = result && typeof result === "object" && "error" in result
          ? String((result as { error: unknown }).error) : "Unable to identify answers.";
        throw new Error(message);
      }
      const data = result as AlignmentResult;
      if (data.paperId !== preview.paperId || data.candidateCode !== preview.candidateCode || !Array.isArray(data.answers)) throw new Error("Invalid alignment response.");
      setAlignment(data);
    } catch (error) {
      setAlignmentError(error instanceof Error ? error.message : "Unable to identify answers.");
    } finally { setAligning(false); }
  }
  async function reviewAction(action: "load" | "propose" | "save" | "approve") {
    if (!user || !preview || reviewBusy) return;
    setReviewBusy(true); setReviewError(""); setReviewMessage("");
    try {
      const url = `${endpoint}/review`;
      const query = new URLSearchParams({ paperId: preview.paperId, candidateCode: preview.candidateCode });
      const response = await fetch(action === "load" ? `${url}?${query}` : url, {
        method: action === "load" ? "GET" : "POST", cache: "no-store",
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(action === "load" ? {} : { "Content-Type": "application/json" }) },
        ...(action === "load" ? {} : { body: JSON.stringify({ paperId: preview.paperId, candidateCode: preview.candidateCode, action, marks: review?.marks, expectedRevision: review?.revision }) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Marking request failed.");
      // Verify the server acknowledged exactly the marks shown at approval time.
      if (action === "approve" || action === "save") {
        const submitted = review?.marks ?? [];
        const expectedTotal = submitted.reduce((sum, mark) => sum + mark.awardedMarks, 0);
        const acknowledged = Array.isArray(result.marks) ? result.marks as { questionId: string; awardedMarks: number }[] : [];
        const matchingMarks = acknowledged.length === submitted.length && submitted.every(mark =>
          acknowledged.some(saved => saved.questionId === mark.questionId && saved.awardedMarks === mark.awardedMarks)
        );
        if (!matchingMarks || result.total !== expectedTotal) {
          throw new Error("The server did not confirm the exact submitted marks. Reload this review and investigate before continuing.");
        }
      }
      if (action === "load") { setReview(result.review ?? null); setReviewMessage(result.review ? `Review loaded (revision ${result.review.revision}).` : "No saved review for this script."); }
      else {
        const refreshed = await fetch(`${url}?${query}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
        const updated = await refreshed.json();
        if (!refreshed.ok) throw new Error(updated.error || "Unable to refresh marking review.");
        if (action === "approve" && (updated.review?.status !== "approved" || updated.review?.total !== result.total || updated.review?.revision !== result.revision)) {
          throw new Error("Approval verification failed. Reload the review before exporting results.");
        }
        setReview(updated.review ?? null);
        setReviewMessage(action === "propose" ? "AI proposal generated. Review all answers and criteria." : action === "save" ? `Teacher edits saved successfully (revision ${updated.review?.revision ?? "?"}).` : "Final marks approved and locked.");
      }
    } catch (error) { setReviewError(error instanceof Error ? error.message : "Marking request failed."); }
    finally { setReviewBusy(false); }
  }
  async function loadAudit() {
    if (!user || !preview) return;
    setReviewError("");
    try {
      const query = new URLSearchParams({ paperId: preview.paperId, candidateCode: preview.candidateCode, audit: "1" });
      const response = await fetch(`${endpoint}/review?${query}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.audit)) throw new Error(result.error || "Unable to load audit history.");
      setAuditHistory(result.audit);
    } catch (error) { setReviewError(error instanceof Error ? error.message : "Unable to load audit history."); }
  }
  async function loadQueue(): Promise<QueueRow[]> {
    if (!user) return [];
    setQueueError("");
    try {
      const response = await fetch(`${endpoint}/queue`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load review queue.");
      setQueue(data.rows);
      return data.rows as QueueRow[];
    } catch (error) {
      setQueueError(error instanceof Error ? error.message : "Unable to load review queue.");
      return [];
    }
  }
  async function loadQlaTopics() {
    if (!user) return;
    try {
      const response = await fetch(`${endpoint.replace(/\/scripts$/, "")}/qla-topics`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load topics.");
      setTopicRevision(data.revision);
      setTopicText(Object.entries(data.mappings as Record<string, string>).map(([k, v]) => `${k} | ${v}`).join("\n"));
      setTopicMessage("Saved topic mappings loaded. Use the exact approved question ID, for example paper-1::1a | Topic name.");
    } catch (error) { setTopicMessage(error instanceof Error ? error.message : "Unable to load topics."); }
  }
  async function saveQlaTopics() {
    if (!user) return;
    try {
      const mappings: Record<string, string> = {};
      for (const line of topicText.split(/\r?\n/).map(x => x.trim()).filter(Boolean)) {
        const divider = line.indexOf("|");
        if (divider < 1) throw new Error(`Invalid topic line: ${line}`);
        const key = line.slice(0, divider).trim(); const value = line.slice(divider + 1).trim();
        if (!value || !/^paper-\d{1,2}::.+$/.test(key)) throw new Error(`Invalid mapping: ${line}`);
        mappings[key] = value;
      }
      const response = await fetch(`${endpoint.replace(/\/scripts$/, "")}/qla-topics`, { method: "PUT", headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" }, body: JSON.stringify({ mappings, expectedRevision: topicRevision }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save topics.");
      setTopicRevision(data.revision); setTopicMessage("Topic mappings saved. Download a new QLA to include them.");
    } catch (error) { setTopicMessage(error instanceof Error ? error.message : "Unable to save topics."); }
  }
  async function bulkApproveSelected() {
    if (!user || queueBusy) return;
    const selections = queue.filter(row => bulkSelected.includes(`${row.paperId}_${row.candidateCode}`) && row.bulkEligible)
      .slice(0, 20).map(row => ({ paperId: row.paperId, candidateCode: row.candidateCode, expectedRevision: row.revision }));
    if (!sampleChecked || !selections.length || moderationNote.trim().length < 12) {
      setQueueError("Select eligible scripts and enter a moderation note of at least 12 characters."); return;
    }
    if (!window.confirm(`You are authorising ${selections.length} candidate script(s) after checking the source scripts and moderating a sample. Any stale or flagged scripts will be rejected. Continue?`)) return;
    setQueueBusy(true); setQueueError("");
    try {
      const response = await fetch(`${endpoint}/bulk-approve`, { method: "POST", cache: "no-store",
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ selections, confirmed: true, moderationNote: moderationNote.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Bulk approval failed.");
      setBatchProgress(`Teacher bulk approval: ${data.approved} approved, ${data.rejected} rejected. Review rejected scripts individually.`);
      setBulkSelected([]);
      setSampleChecked(false);
      await loadQueue();
    } catch (error) { setQueueError(error instanceof Error ? error.message : "Bulk approval failed."); }
    finally { setQueueBusy(false); }
  }
  async function proposeBatch() {
    if (!user || queueBusy) return;
    const latestQueue = await loadQueue();
    const todo = latestQueue.filter(row => row.status === "unprocessed");
    if (!todo.length) { setQueueError("No unprocessed scripts in the current queue. Refresh the queue first."); return; }
    if (!window.confirm(`Mark all ${todo.length} remaining scripts with AI? This does not approve any marks. Keep this tab open until the batch finishes.`)) return;
    setQueueBusy(true); setQueueError("");
    const token = await user.getIdToken();
    let completed = 0, failed = 0;
    for (const item of todo) {
      setBatchProgress(`Processing ${completed + failed + 1}/${todo.length}: ${item.candidateCode}`);
      try {
        const response = await fetch(`${endpoint}/review`, {
          method: "POST", cache: "no-store",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ action: "propose", paperId: item.paperId, candidateCode: item.candidateCode }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Proposal failed.");
        completed++;
      } catch (error) {
        failed++;
        setQueueError(old => `${old}${old ? " | " : ""}${item.candidateCode}: ${error instanceof Error ? error.message : "Failed"}`);
      }
    }
    setBatchProgress(`Finished: ${completed} proposed, ${failed} failed. No marks were approved.`);
    setQueueBusy(false);
    await loadQueue();
  }
  async function loadResults() {
    if (!user) return;
    setResultsError("");
    try {
      const response = await fetch(`/api/marking-centre/exams/${examId}/results`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Results unavailable.");
      setResults(data);
      if (data.grading.boundaries.length === 0 && data.allStructuresApproved && ["GCSE", "A Level"].includes(qualificationLevel)) {
        const generated = estimatedBoundaries(qualificationLevel, data.maximum);
        if (generated) {
          setBoundariesText(generated.map(b => `${b.grade},${b.minimum}`).join("\n"));
          setBoundarySource(`CS Master internal estimate — ${qualificationLevel} — editable percentage profile`);
          setBoundaryMode("internal");
          setResultsMessage("Estimated grade boundaries prepared automatically. Review and save to apply; these are not official thresholds.");
        }
      } else {
        setBoundariesText(data.grading.boundaries.map((b: { grade: string; minimum: number }) => `${b.grade},${b.minimum}`).join("\n"));
        setBoundarySource(data.grading.sourceNote);
        setBoundaryMode(data.grading.mode === "official" ? "official" : "internal");
      }
    } catch (error) { setResultsError(error instanceof Error ? error.message : "Unable to load results."); }
  }
  function generateBoundaries() {
    if (!results) return;
    setResultsError(""); setResultsMessage("");
    if (!results.allStructuresApproved) {
      setResultsError("Approve the question structures for every paper before generating examination boundaries."); return;
    }
    const thresholds = estimatedBoundaries(qualificationLevel, results.maximum);
    if (!thresholds) {
      setResultsError("The examination maximum is too small for distinct thresholds at every grade. Enter a suitable internal scale manually."); return;
    }
    setBoundariesText(thresholds.map(b => `${b.grade},${b.minimum}`).join("\n"));
    setBoundaryMode("internal");
    setBoundarySource(`CS Master internal estimate — ${qualificationLevel} — editable percentage profile`);
    setResultsMessage("Estimated boundaries generated. Review and save to apply. Not official grade boundaries.");
  }
  async function saveBoundaries() {
    if (!user || !results) return;
    setResultsError(""); setResultsMessage("");
    try {
      const boundaries = boundariesText.split(/\r?\n/).filter(Boolean).map(line => { const parts = line.split(","); return { grade: parts[0]?.trim(), minimum: Number(parts[1]?.trim()) }; });
      if (!window.confirm(boundaryMode === "official" ? "Confirm these are verified official awarding-body thresholds?" : "Save these as INTERNAL ESTIMATED grade boundaries? They are not official awarding-body boundaries.")) return;
      const response = await fetch(`/api/marking-centre/exams/${examId}/results`, { method: "PUT", headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" }, body: JSON.stringify({ boundaries, sourceNote: boundarySource, mode: boundaryMode, expectedRevision: results.grading.revision }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save boundaries.");
      await loadResults();
      setResultsMessage("Grade boundaries saved successfully.");
    } catch (error) { setResultsError(error instanceof Error ? error.message : "Unable to save boundaries."); }
  }
  async function downloadResults() {
    if (!user) return;
    setResultsError("");
    try {
      const response = await fetch(`/api/marking-centre/exams/${examId}/results?format=csv`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Export failed."); }
      const blob = await response.blob(); const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `CSMaster-${examId}-results.csv`; anchor.click(); URL.revokeObjectURL(url);
    } catch (error) { setResultsError(error instanceof Error ? error.message : "Export failed."); }
  }
  async function downloadReport(format: "detailed-csv" | "xlsx" | "qla-xlsx" | "pdf" | "pdf-all", selectedCode?: string) {
    if (!user) return;
    setResultsError("");
    try {
      const query = new URLSearchParams({ format });
      if (selectedCode) query.set("candidateCode", selectedCode);
      const response = await fetch(`/api/marking-centre/exams/${examId}/reports?${query}`, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store"
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Report download failed.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = format === "qla-xlsx" ? `CSMaster-${examId}-subject-QLA.xlsx` : format === "xlsx" ? `CSMaster-${examId}-analysis.xlsx`
        : format === "detailed-csv" ? `CSMaster-${examId}-feedback.csv`
        : format === "pdf-all" ? `CSMaster-${examId}-all-feedback.pdf`
        : `CSMaster-${selectedCode}-feedback.pdf`;
      document.body.appendChild(anchor);
      anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setResultsError(error instanceof Error ? error.message : "Report download failed."); }
  }
  return <section className="space-y-4 border-t pt-5">
    {mode === "scripts" && <>
    <div><h3 className="text-lg font-semibold">Candidate answer scripts</h3><p className="text-sm text-slate-600">Upload individual PDFs or stage up to 20 PDFs at once. Match every file to a candidate and paper before saving. Filename matching uses an existing candidate code.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">{papers.map(p => <div key={p.id} className="rounded-lg border bg-slate-50 p-3"><strong>{p.title}</strong><p className="text-sm">{scripts.filter(s => s.paperId === p.id).length} / {candidateCodes.length} uploaded</p></div>)}</div>
    <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
      <label className="text-sm">Paper<select className="mt-1 block w-full rounded border p-2" value={paperId} onChange={e => setPaperId(e.target.value)}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
      <label className="text-sm">Candidate (individual upload)<select className="mt-1 block w-full rounded border p-2" value={candidateCode} onChange={e => setCandidateCode(e.target.value)}><option value="">Select candidate</option>{candidateCodes.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
      <label className="text-sm">Individual PDF<input className="mt-1 block w-full text-xs" disabled={busy || !candidateCode} type="file" accept=".pdf,application/pdf" onChange={e => { addFiles(e.target.files, paperId, candidateCode); e.target.value = ""; }}/></label>
      <label className="text-sm md:col-span-3">Bulk PDFs for selected paper<input className="mt-1 block w-full text-xs" disabled={busy} type="file" multiple accept=".pdf,application/pdf" onChange={e => { addFiles(e.target.files, paperId); e.target.value = ""; }}/></label>
    </div>
    {pending.length > 0 && <div className="space-y-3"><h4 className="font-semibold">Review {pending.length} staged file(s)</h4><div className="max-h-96 space-y-2 overflow-y-auto">{pending.map(item => <div key={item.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-4"><div className="break-all text-xs">{item.file.name}</div><select aria-label={`Candidate for ${item.file.name}`} value={item.candidateCode} disabled={busy} className="rounded border p-2 text-xs" onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, candidateCode: e.target.value } : p))}><option value="">Unmatched — choose candidate</option>{candidateCodes.map(c => <option key={c}value={c}>{c}</option>)}</select><select aria-label={`Paper for ${item.file.name}`} value={item.paperId} disabled={busy} className="rounded border p-2 text-xs" onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, paperId: e.target.value } : p))}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><div className="flex items-center justify-between gap-2"><label className="text-xs"><input type="checkbox" disabled={busy} checked={item.replace} onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, replace: e.target.checked } : p))}/> Replace existing</label><button type="button" disabled={busy} onClick={() => setPending(old => old.filter(p => p.id !== item.id))} className="text-xs text-red-700">Remove</button></div></div>)}</div><button type="button" disabled={busy || pending.length > BATCH} onClick={() => void submit()} className="rounded-lg bg-indigo-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Uploading..." : `Confirm upload (${pending.length})`}</button>{pending.length > BATCH && <p className="text-sm text-amber-700">Remove files until no more than 20 remain.</p>}</div>}
    {message && <p role="status" className="rounded bg-indigo-50 p-3 text-sm">{message}</p>}
    </>}
    {mode !== "results" && <>
    <div><div className="flex items-center justify-between"><h4 className="font-semibold">Uploaded scripts ({scripts.length})</h4><button type="button" disabled={busy} className="rounded border px-3 py-1 text-sm" onClick={() => {
  if (refreshing) return;
  setRefreshing(true);
  setMessage("Refreshing candidate scripts...");
  void refresh()
    .then(() => setMessage("Candidate script register refreshed successfully."))
    .catch(error =>
      setMessage(error instanceof Error ? error.message : "Refresh failed.")
    )
    .finally(() => setRefreshing(false));
}}>{refreshing ? "Refreshing..." : "Refresh"}</button></div><div className="mt-2 max-h-64 overflow-y-auto">{scripts.length === 0 ? <p className="text-sm text-slate-600">No candidate scripts uploaded yet.</p> : scripts.map(s => <div key={`${s.paperId}_${s.candidateCode}`} className="flex flex-wrap items-center justify-between gap-2 border-b py-2 text-xs"><p className="min-w-0 break-all"><strong>{s.candidateCode}</strong> · {papers.find(p => p.id === s.paperId)?.title ?? s.paperId} · {s.filename}</p>{mode === "marking" ? <button type="button" className="rounded border border-indigo-600 px-3 py-1 text-indigo-700 disabled:opacity-50" disabled={busy || extractingKey !== null} onClick={() => void previewScript(s)}>{extractingKey === `${s.paperId}_${s.candidateCode}` ? "Extracting..." : "Extract / Preview"}</button> : <span className="text-slate-500">Uploaded</span>}</div>)}</div></div>
    {previewError && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{previewError}</p>}
    </>}
    {mode === "marking" && <div className="space-y-3 rounded-lg border p-4">
      <h4 className="font-semibold">Mark your whole class</h4>
      <p className="text-xs text-slate-600">Mark every remaining selectable-text script in one action. Keep this tab open while marking runs. Completed proposals are saved, so you can retry failures without repeating successful work. You approve marks after checking exceptions and a suitable sample.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border px-3 py-2 text-sm" disabled={queueBusy} onClick={() => void loadQueue()}>Refresh review queue</button>
        <button
          type="button"
          className="rounded bg-indigo-700 px-3 py-2 text-sm text-white"
          disabled={queueBusy || !queue.some((r) => r.status === "unprocessed")}
          onClick={() => void proposeBatch()}
        >
          {queueBusy ? "Processing..." : "Mark all remaining scripts"}
        </button>
      </div>
      <div className="space-y-2 rounded border border-amber-200 p-3">
        <p className="text-sm font-semibold">Approve eligible scripts together (up to 20 at a time)</p>
        <p className="text-xs">Scripts with automated warnings are excluded. Check a suitable sample against the original papers and mark scheme before approval. AI confidence does not guarantee correctness.</p>
        <button type="button" className="rounded border px-3 py-1 text-sm" disabled={queueBusy} onClick={() => setBulkSelected(queue.filter(r => r.bulkEligible).slice(0, 20).map(r => `${r.paperId}_${r.candidateCode}`))}>Select up to 20 ready for approval</button>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={sampleChecked} onChange={e => setSampleChecked(e.target.checked)} />I have checked an appropriate sample against the original scripts and approved mark scheme.</label>
        <label className="block text-xs">Moderation record (editable)
          <textarea className="mt-1 w-full rounded border p-2 text-sm" value={moderationNote} onChange={e => setModerationNote(e.target.value)} maxLength={1000} rows={2} placeholder="For example: Checked a sample of high, middle and low scoring scripts against the approved mark scheme; reviewed automated exceptions." />
        </label>
        <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={queueBusy || !sampleChecked || bulkSelected.length === 0 || moderationNote.trim().length < 12} onClick={() => void bulkApproveSelected()}>Approve {bulkSelected.length} selected scripts</button>
      </div>
      {batchProgress && <p role="status" className="text-sm">{batchProgress}</p>}
      {queueError && <p role="alert" className="text-sm text-red-700">{queueError}</p>}
      {queue.length > 0 && <><p className="text-sm">{queue.length} uploaded · {queue.filter(r => r.status === "approved").length} approved · {queue.filter(r => r.flagged).length} flagged · {queue.filter(r => r.status === "unprocessed").length} unprocessed</p>
        <div className="max-h-72 overflow-auto"><table className="w-full text-left text-xs"><thead><tr><th className="border p-2">Bulk</th><th className="border p-2">Candidate</th><th className="border p-2">Paper</th><th className="border p-2">Status</th><th className="border p-2">Review warnings</th><th className="border p-2">Open</th></tr></thead><tbody>{queue.map(item => <tr key={`${item.paperId}_${item.candidateCode}`}><td className="border p-2"><input type="checkbox" aria-label={`Select ${item.candidateCode} ${item.paperId} for bulk approval`} disabled={!item.bulkEligible || queueBusy} checked={bulkSelected.includes(`${item.paperId}_${item.candidateCode}`)} onChange={e => setBulkSelected(old => e.target.checked ? [...old, `${item.paperId}_${item.candidateCode}`].slice(0, 20) : old.filter(k => k !== `${item.paperId}_${item.candidateCode}`))} /></td><td className="border p-2">{item.candidateCode}</td><td className="border p-2">{item.paperId}</td><td className="border p-2">{item.status}</td><td className="border p-2">{item.flags.length ? item.flags.map(f => `${f.questionId}: ${f.code}`).join("; ") : "No automated flags (teacher verification still required)"}</td><td className="border p-2"><button type="button" className="text-indigo-700 underline" disabled={queueBusy} onClick={() => void previewScript({ paperId: item.paperId, candidateCode: item.candidateCode, filename: item.filename, size: 0, uploadedAt: null })}>Review</button></td></tr>)}</tbody></table></div>
      </>}
    </div>}
    {mode === "marking" && <div className="space-y-2 rounded-lg border p-4">
      <button type="button" className="font-semibold text-indigo-700 underline" aria-expanded={showAdvancedQla} onClick={() => setShowAdvancedQla(v => !v)}>{showAdvancedQla ? "Hide" : "Show"} advanced topic mapping (optional)</button>
      {showAdvancedQla && <div className="space-y-2">
      <h4 className="font-semibold">Subject-specific QLA topic mapping</h4>
      <p className="text-xs">Optional: map approved question IDs to curriculum topics. Example: paper-1::1a | Data representation. Unmapped questions are labelled clearly in the QLA, never guessed from the mark scheme.</p>
      <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => void loadQlaTopics()}>Load saved QLA topics</button>
      <textarea className="w-full rounded border p-2 font-mono text-xs" rows={4} value={topicText} onChange={e => setTopicText(e.target.value)} placeholder={"paper-1::1a | Data representation\npaper-1::2b | Programming"} />
      <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white" onClick={() => void saveQlaTopics()}>Save subject topic mapping</button>
      {topicMessage && <p role="status" className="text-xs">{topicMessage}</p>}
      </div>}
    </div>}
    {mode === "marking" && preview && <div className="space-y-3 rounded-lg border p-4" aria-label="Candidate extraction preview">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h4 className="font-semibold">Extraction preview — {preview.candidateCode}</h4>
          <p className="text-xs text-slate-600">{papers.find(p => p.id === preview.paperId)?.title ?? preview.paperId} · {preview.filename ?? "Candidate PDF"} · {preview.extraction.pages} page(s)</p>
        </div>
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => { setPreview(null); setPreviewError(""); setAlignment(null); setAlignmentError(""); setReview(null); setReviewError(""); }}>Close preview</button>
      </div>
      <p role="status" className="rounded bg-amber-50 p-3 text-sm text-amber-900">
        {preview.extraction.status === "requires_vision_or_manual_transcription"
          ? "No selectable text detected. This scan requires vision processing or manual transcription."
          : preview.extraction.status === "truncated_review_required"
            ? "Extracted text was truncated. Compare against the complete PDF before continuing."
            : "Selectable text extracted. Teacher must verify completeness and question alignment."}
        {" "}No marks have been awarded.
      </p>
      <div><h5 className="text-sm font-semibold">Approved question structure</h5>
        <div className="mt-1 flex flex-wrap gap-2">{preview.approvedQuestions.map(q => <span key={q.id} className="rounded border bg-slate-50 px-2 py-1 text-xs">{q.id}: {q.maxMarks} mark(s)</span>)}</div>
      </div>
      <div><h5 className="text-sm font-semibold">Extracted text (teacher-only preview)</h5>
        <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-3 text-xs">{preview.extraction.text || "No selectable text was found in this PDF."}</pre>
      </div>
      <div className="space-y-3 border-t pt-3">
        <button type="button" className="rounded bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-50"
          disabled={aligning || preview.extraction.status !== "text_available_review_required"}
          onClick={() => void identifyAnswers()}>{aligning ? "Identifying answers..." : "Identify Answers (AI)"}</button>
        {alignmentError && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{alignmentError}</p>}
        {alignment && <div className="space-y-3" aria-label="AI proposed answer alignment">
          <p className="rounded bg-amber-50 p-3 text-sm text-amber-900">AI suggestions only. Verify every association against the original script. No marks awarded or saved.</p>
          {alignment.warnings.map((warning, i) => <p key={i} className="text-sm text-amber-800">Warning: {warning}</p>)}
          {alignment.answers.map(answer => <div key={answer.questionId} className="rounded border p-3">
            <div className="flex flex-wrap justify-between gap-2"><strong className="text-sm">Question {answer.questionId}</strong><span className="text-xs">Confidence: {answer.confidence}</span></div>
            <pre className="mt-2 whitespace-pre-wrap break-words text-xs">{answer.answerText || "No answer identified"}</pre>
            {answer.warning && <p className="mt-2 text-xs text-amber-800">{answer.warning}</p>}
          </div>)}
        </div>}
      </div>
      <div className="space-y-3 border-t pt-4">
        <h4 className="font-semibold">AI marking and teacher approval</h4>
        <p className="text-sm text-amber-800">AI marks are provisional. Check the original PDF and approved criteria before approving. Scanned PDFs are not yet supported.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded border px-3 py-2 text-sm disabled:opacity-50" disabled={reviewBusy} onClick={() => void reviewAction("load")}>Load review</button>
          <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={reviewBusy || preview.extraction.status !== "text_available_review_required" || review?.status === "approved" && !review.stale} onClick={() => void reviewAction("propose")}>{reviewBusy ? "Working..." : "Generate AI mark proposal"}</button>
        </div>
        {reviewMessage && <p role="status" className="rounded bg-green-50 p-2 text-sm text-green-800">{reviewMessage}</p>}
        {reviewError && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{reviewError}</p>}
        {review && <div className="space-y-3">
          <div className="space-y-2"><button type="button" className="rounded border px-3 py-2 text-sm" disabled={reviewBusy} onClick={() => void loadAudit()}>View marking audit history</button>
          {auditHistory.length > 0 && <div className="max-h-64 overflow-auto rounded border p-3 text-xs" aria-label="Marking audit history">{auditHistory.map(entry => <div key={entry.id} className="border-b py-2"><strong>Revision {entry.revision}: {entry.action}</strong> — {entry.at ?? "Timestamp pending"}<div>Marks: {(entry.marks ?? []).map(m => `${m.questionId}: ${m.awardedMarks}`).join(", ")}</div>{(entry.marks ?? []).filter(m => m.teacherJustification).map(m => <p key={m.questionId}>Question {m.questionId} justification: {m.teacherJustification}</p>)}</div>)}</div>}</div>
          <p className="text-sm">Status: <strong>{review.stale ? "STALE - source changed" : review.status}</strong> · Revision {review.revision} {review.total !== undefined ? `· Total ${review.total}` : ""}</p>
          {review.marks.map((mark, index) => <div key={mark.questionId} className="space-y-2 rounded border p-3">
            <p className="font-semibold text-sm">Question {mark.questionId} · Max {preview.approvedQuestions.find(q => q.id === mark.questionId)?.maxMarks}</p>
            <pre className="whitespace-pre-wrap text-xs">{mark.answerText || "No answer identified"}</pre>
            <label className="block text-sm">Teacher mark
              <input type="number" min={0} max={preview.approvedQuestions.find(q => q.id === mark.questionId)?.maxMarks ?? 0} step={1} className="ml-2 w-20 rounded border p-1" value={mark.awardedMarks} disabled={review.status === "approved" || review.stale || reviewBusy}
                onChange={e => setReview(old => old ? { ...old, marks: old.marks.map((m, i) => i === index ? { ...m, awardedMarks: Number(e.target.value) } : m) } : old)}/>
            </label>
            <label className="block text-sm">Feedback
              <textarea className="mt-1 w-full rounded border p-2 text-sm" rows={2} value={mark.feedback} disabled={review.status === "approved" || review.stale || reviewBusy}
                onChange={e => setReview(old => old ? { ...old, marks: old.marks.map((m, i) => i === index ? { ...m, feedback: e.target.value } : m) } : old)}/>
            </label>
            <label className="block text-sm">How to gain full marks (AI draft — check against the script and approved criteria)
              <textarea className="mt-1 w-full rounded border p-2 text-sm" rows={3} value={mark.improvementGuidance ?? ""} disabled={review.status === "approved" || review.stale || reviewBusy} placeholder="Specific missing step, correction or improvement target" onChange={e => setReview(old => old ? { ...old, marks: old.marks.map((m, i) => i === index ? { ...m, improvementGuidance: e.target.value } : m) } : old)}/>
            </label>
            {mark.awardedMarks < (preview.approvedQuestions.find(q => q.id === mark.questionId)?.maxMarks ?? 0) && !mark.improvementGuidance?.trim() && <p className="text-xs text-amber-800">Improvement guidance missing: review before approval.</p>}
            <label className="block text-sm">Teacher justification (required for changed marks or credit without an answer before approval)
              <textarea className="mt-1 w-full rounded border p-2 text-sm" rows={2} value={mark.teacherJustification ?? ""} disabled={review.status === "approved" || review.stale || reviewBusy} placeholder="Explain the evidence supporting a mark override" onChange={e => setReview(old => old ? { ...old, marks: old.marks.map((m, i) => i === index ? { ...m, teacherJustification: e.target.value } : m) } : old)}/>
            </label>
            {(review.qualityFlags ?? []).filter(flag => flag.questionId === mark.questionId || flag.questionId === "*").map((flag, flagIndex) => <p key={`${flag.code}_${flagIndex}`} className="rounded bg-amber-50 p-2 text-xs text-amber-900">Review warning ({flag.code}): {flag.detail}</p>)}
            <p className="text-xs text-slate-600">Evidence: {mark.evidence || "Not supplied"} · Confidence: {mark.confidence}{mark.needsReview ? " · Requires review" : ""}</p>
          </div>)}
          {review.status !== "approved" && !review.stale && <div className="flex flex-wrap gap-2">
            <button type="button" disabled={reviewBusy} className="rounded border px-3 py-2 text-sm" onClick={() => void reviewAction("save")}>Save teacher edits</button>
            <button type="button" disabled={reviewBusy} className="rounded bg-emerald-700 px-3 py-2 text-sm text-white" onClick={() => { if (window.confirm("Confirm you checked the original script, every mark, feedback and improvement guidance? Approval locks this review.")) void reviewAction("approve"); }}>Approve final marks</button>
          </div>}
        </div>}
      </div>
      <p className="text-xs text-slate-600">Teacher approval is required. No grades are inferred from unverified boundaries.</p>
    </div>}
    {mode === "results" && (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Exam results and grade boundaries</h3>
      <p className="text-sm text-slate-600">Only approved paper marks contribute to complete results. Generate editable internal estimates for GCSE or A Level, or enter verified official boundaries.</p>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => void loadResults()}>Load exam results</button>{results && <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white" onClick={() => void downloadResults()}>Export CSV for Excel</button>}{results && <><button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => void downloadReport("detailed-csv")}>Detailed feedback CSV</button><button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white" onClick={() => void downloadReport("xlsx")}>Excel analysis workbook</button><button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => void downloadReport("qla-xlsx")}>Subject QLA workbook</button><button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => void downloadReport("pdf-all")}>All candidate PDF reports</button></>}</div>
      {resultsMessage && <p role="status" className="rounded bg-green-50 p-2 text-sm text-green-800">{resultsMessage}</p>}
      {resultsError && <p role="alert" className="text-sm text-red-700">{resultsError}</p>}
      {results && <div className="space-y-3">
        <p className="text-sm">Maximum: {results.maximum} · {results.rows.filter(r => r.status === "approved").length} / {results.rows.length} candidates have approved results · Grading {results.grading.ready ? (results.grading.mode === "official" ? "official verified" : "internal estimate") : "not configured"}</p>
        <div className="max-h-80 overflow-auto"><table className="w-full border-collapse text-left text-xs"><thead><tr><th className="border p-2">Candidate</th>{results.papers.map(p => <th key={p.id} className="border p-2">{p.title}</th>)}<th className="border p-2">Total</th><th className="border p-2">Grade</th><th className="border p-2">Feedback report</th></tr></thead><tbody>{results.rows.map(r => <tr key={r.candidateCode}><td className="border p-2">{r.candidateCode}</td>{results.papers.map(p => <td key={p.id} className="border p-2">{r.paperScores[p.id] ?? "Pending"}</td>)}<td className="border p-2">{r.total ?? "Pending"}</td><td className="border p-2">{r.grade ?? "—"}</td><td className="border p-2"><button type="button" className="rounded border px-2 py-1 text-indigo-700" onClick={() => void downloadReport("pdf", r.candidateCode)}>PDF</button></td></tr>)}</tbody></table></div>
        <div className="rounded-lg border bg-slate-50 p-3 space-y-3">
          <p className="text-sm font-medium">Qualification: {qualificationLevel} · Maximum: {results.maximum} marks</p>
          {!results.allStructuresApproved && <p className="text-sm text-amber-800">Some paper structures are not approved. Complete all papers before saving grade boundaries.</p>}
          <label className="block text-sm">Boundary type<select className="mt-1 block w-full rounded border p-2" value={boundaryMode} onChange={e => setBoundaryMode(e.target.value as "internal" | "official")}><option value="internal">Internal estimated thresholds</option><option value="official">Verified official awarding-body thresholds</option></select></label>
          <button type="button" disabled={!results.allStructuresApproved || !["GCSE", "A Level"].includes(qualificationLevel)} className="rounded bg-indigo-700 px-3 py-2 text-sm text-white disabled:opacity-50" onClick={generateBoundaries}>Generate {qualificationLevel} estimated boundaries</button>
          <p className="text-xs text-slate-600">Internal thresholds are illustrative, not official. U applies below the lowest threshold. For other qualifications, enter verified thresholds manually.</p>
        </div>
        <label className="block text-sm">Editable boundaries — one grade and minimum total per line (example: 9,90)<textarea className="mt-1 w-full rounded border p-2 font-mono text-sm" rows={5} value={boundariesText} onChange={e => setBoundariesText(e.target.value)}/></label>
        <label className="block text-sm">Boundary source / examination series (required)<input className="mt-1 w-full rounded border p-2 text-sm" value={boundarySource} onChange={e => setBoundarySource(e.target.value)} placeholder="e.g. official awarding body document, June 2026"/></label>
        <button type="button" className="rounded bg-emerald-700 px-3 py-2 text-sm text-white" onClick={() => void saveBoundaries()} disabled={!results.allStructuresApproved}>Save grade boundaries</button>
      </div>}
    </div>
    )}
  </section>;
}
