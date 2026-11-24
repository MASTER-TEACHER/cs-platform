"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BatchScanSplitter from "@/components/marking-centre/BatchScanSplitter";
import QuestionCheckPanel from "@/components/marking-centre/QuestionCheckPanel";
import { announceActivity } from "@/components/auth/IdleSessionGuard";
import { flagTier, watchFlags, type SampleStatus, type WatchEntry } from "@/lib/marking/reviewPolicy";

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
    visionUsed?: boolean;
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
type ReviewFlag = { questionId: string; code: string; detail: string; tier?: "check" | "info" };
// Short, grouped labels for queue warnings ("Unclear reading: Q2, Q5"). Full detail stays available.
function flagLabel(flag: { code: string; detail: string; tier?: "check" | "info" }): string {
  const detail = flag.detail.toLowerCase();
  if (flag.code === "WATCH_QUESTION") return "AI often differs from you here";
  if (flag.code === "UNCERTAIN") {
    if (detail.includes("markers disagreed")) return flag.tier === "info" ? "Small marker difference (resolved)" : "Markers disagreed";
    if (flag.tier === "info" && detail.includes("check:")) return "Auto-check corrected mark";
    if (detail.includes("moderation unavailable")) return "One marker only";
    if (detail.includes("could not mark")) return "Not marked by AI";
    if (detail.includes("check:")) return "Auto-check changed mark";
    if (detail.includes("uncertain")) return "Unclear reading";
    return "Needs a look";
  }
  const labels: Record<string, string> = {
    UNSUPPORTED_CREDIT: "Credit for a non-answer",
    UNSUPPORTED_WORKING: "Method claim to check",
    MISSING_EVIDENCE: "Missing evidence",
    MISSING_FEEDBACK: "Missing feedback",
    MISSING_GUIDANCE: "Missing guidance",
    OVERRIDE_FEEDBACK_CHECK: "Check your override",
    ALIGNMENT: "Answer location",
  };
  return labels[flag.code] ?? flag.code.replace(/_/g, " ").toLowerCase();
}
/**
 * Two tiers of review flag. "Check" flags often mean a wrong mark and need the
 * teacher's eye. "Info" flags (an unclear reading the AI already resolved, one
 * marker only, missing feedback text) are shown for transparency but do not
 * require opening the question.
 */
const INFO_LABELS = new Set(["Unclear reading", "One marker only", "Missing feedback", "Missing guidance"]);
function isCheckFlag(flag: { code: string; detail: string; tier?: "check" | "info" }): boolean {
  return flag.tier ? flag.tier === "check" : !INFO_LABELS.has(flagLabel(flag));
}
function groupedFlags(flags: { questionId: string; code: string; detail: string }[]): string {
  const groups = new Map<string, string[]>();
  for (const flag of flags) {
    const label = flagLabel(flag);
    const list = groups.get(label) ?? [];
    const where = flag.questionId === "*" ? "whole script" : `Q${flag.questionId}`;
    if (!list.includes(where)) list.push(where);
    groups.set(label, list);
  }
  return [...groups.entries()].map(([label, qs]) => `${label}: ${qs.join(", ")}`).join(" · ");
}

type UsageSummary = { month: string; costUsd: number; budgetUsd: number; scriptsMarked: number; calls: number; averageCostPerScriptUsd: number };
type AccuracyReport = {
  verdict: "not_enough_data" | "ready_for_bulk_approval" | "keep_reviewing";
  advice: string;
  summary: { scriptsCompared: number; questionAgreement: number; scriptsWithinTolerance: number; totalTolerance: number; meanTotalDifference: number; averageBias: number; minimumScripts: number };
  questions: { questionId: string; compared: number; agreementRate: number; meanAbsoluteDifference: number; aiTooGenerous: number; aiTooHarsh: number }[];
  scripts: { candidateCode: string; aiTotal: number; teacherTotal: number; difference: number; questionsChanged: string[] }[];
};
type QueueRow = { paperId: string; candidateCode: string; filename: string; status: string; revision: number; flagged: boolean; bulkEligible?: boolean; bulkEligibleWithFlags?: boolean; sampleReady?: boolean; checks?: number; aiTotal?: number; flags: ReviewFlag[] };
type MarkReview = { checkedQuestions?: string[]; qualityFlags?: ReviewFlag[]; paperId: string; candidateCode: string; status: string; revision: number; stale?: boolean; total?: number; originalProposalMarks?: { questionId: string; awardedMarks: number }[]; marks: { questionId: string; answerText: string; awardedMarks: number; feedback: string; improvementGuidance?: string; evidence: string; confidence: "high" | "medium" | "low"; needsReview: boolean; teacherJustification?: string }[] };
type Pending = { id: number; file: File; candidateCode: string; paperId: string; replace: boolean };
type Props = { examId: string; papers: Paper[]; candidateCodes: string[]; mode?: "scripts" | "marking" | "results"; qualificationLevel?: string };
const LIMIT = 25 * 1024 * 1024;
const BATCH = 20;
function estimatedBoundaries(level: string, maximum: number) {
  const profile: readonly (readonly [string, number])[] = level.trim().toLowerCase() === "a level"
    ? [["A*", 0.8], ["A", 0.7], ["B", 0.6], ["C", 0.5], ["D", 0.4], ["E", 0.3]]
    : [["9", 0.9], ["8", 0.8], ["7", 0.7], ["6", 0.6], ["5", 0.5], ["4", 0.4], ["3", 0.3], ["2", 0.2], ["1", 0.1]];
  const thresholds = profile.map(([grade, fraction]) => ({ grade, minimum: Math.ceil(maximum * fraction) }));
  return new Set(thresholds.map(b => b.minimum)).size === thresholds.length ? thresholds : null;
}
function matchCode(name: string, codes: string[]) {
  // Ignore browser/Windows duplicate suffixes such as "code (1).pdf" or "code - Copy.pdf".
  const stem = name.replace(/\.pdf$/i, "").replace(/\s*(?:\(\d+\)|-\s*copy(?:\s*\(\d+\))?)\s*$/i, "").toUpperCase();

  // Match codes even when the separator removes hyphens,
  // underscores or spaces from the original candidate code.
  const normalise = (value: string) =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const normalisedStem = normalise(stem);

  const matches = codes.filter((code) => {
    const normalisedCode = normalise(code);

    if (!normalisedCode) return false;

    // Match a code occupying the whole filename.
    if (normalisedStem === normalisedCode) {
      return true;
    }

    // Also support filenames containing a delimited code.
    const escaped = code
      .toUpperCase()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `(^|[^A-Z0-9])${escaped}(?=$|[^A-Z0-9])`
    );

    return pattern.test(stem);
  });

  // Never guess when there are multiple possible matches.
  return matches.length === 1 ? matches[0] : "";
}
export default function CandidateScriptManager({ examId, papers, candidateCodes, mode = "scripts", qualificationLevel = "GCSE" }: Props) {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  // When codes are registered after files were staged, match the still-unmatched files again.
  useEffect(() => {
    setPending(items => items.some(item => !item.candidateCode)
      ? items.map(item => item.candidateCode ? item : { ...item, candidateCode: matchCode(item.file.name, candidateCodes) })
      : items);
  }, [candidateCodes]);
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
  const [accuracy, setAccuracy] = useState<AccuracyReport | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [accuracyError, setAccuracyError] = useState("");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [moderationNote, setModerationNote] = useState("");
  const [sampleChecked, setSampleChecked] = useState(false);
  const [samples, setSamples] = useState<SampleStatus[]>([]);
  const [watch, setWatch] = useState<WatchEntry[]>([]);
  const [sampleConfirmed, setSampleConfirmed] = useState(false);
  const [includeFlagged, setIncludeFlagged] = useState(false);
  const [focusReview, setFocusReview] = useState(true);
  const eligible = (row: QueueRow) => includeFlagged ? Boolean(row.bulkEligibleWithFlags) : Boolean(row.bulkEligible);
  const [showAdvancedQla, setShowAdvancedQla] = useState(false);
  const [topicText, setTopicText] = useState("");
  const [topicRevision, setTopicRevision] = useState(0);
  const [topicMessage, setTopicMessage] = useState("");
  const [batchProgress, setBatchProgress] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [results, setResults] = useState<{ allStructuresApproved: boolean; rows: { candidateCode: string; total: number | null; grade: string | null; status: string; paperScores: Record<string, number | null>; provisionalScores?: Record<string, number | null>; provisionalTotal?: number | null; provisionalGrade?: string | null }[]; papers: Paper[]; maximum: number; grading: { ready: boolean; revision: number; mode?: "internal" | "official"; boundaries: { grade: string; minimum: number }[]; sourceNote: string } } | null>(null);
  const [resultsError, setResultsError] = useState("");
  const [boundariesText, setBoundariesText] = useState("");
  const [boundarySource, setBoundarySource] = useState("");
  const [boundaryMode, setBoundaryMode] = useState<"internal" | "official">("internal");
  const [resultsMessage, setResultsMessage] = useState("");
  const [message, setMessage] = useState("");
  const [nextId, setNextId] = useState(1);
  const endpoint = `/api/marking-centre/exams/${examId}/scripts`;
  // Set when the browser blocks direct storage uploads (CORS not configured).
  const directBlocked = useRef(false);
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
  function addFiles(files: FileList | File[] | null, selectedPaper: string, selectedCandidate = "") {
    if (!files) return;
    const additions = Array.from(files).map((file, index) => ({ id: nextId + index, file, paperId: selectedPaper, candidateCode: selectedCandidate || matchCode(file.name, candidateCodes), replace: false }));
    setNextId(n => n + additions.length);
    setPending(old => [...old, ...additions]);
    setMessage(`${additions.length} file(s) staged. Review candidate matching before uploading.`);
  }
  async function submit() {
    if (!user || pending.length === 0 || busy) return;

    const seen = new Set<string>();

    for (const item of pending) {
      if (!candidateCodes.includes(item.candidateCode) ||
          !papers.some(p => p.id === item.paperId)) {
        setMessage("Every file must have a valid candidate and paper.");
        return;
      }

      if (!item.file.name.toLowerCase().endsWith(".pdf") ||
          item.file.size < 5 ||
          item.file.size > LIMIT ||
          (item.file.type && item.file.type !== "application/pdf")) {
        const mb = (item.file.size / 1024 / 1024).toFixed(1);
        setMessage(`${item.file.name} (${mb} MB) cannot be uploaded: only non-empty PDFs up to 25 MB are supported. Remove it, or split the batch again.`);
        return;
      }

      const key = `${item.paperId}_${item.candidateCode}`;

      if (seen.has(key)) {
        setMessage("Duplicate candidate and paper in staged files.");
        return;
      }

      seen.add(key);

      if (existing.has(key) && !item.replace) {
        setMessage(
          `A script already exists for ${item.candidateCode}. ` +
          "Select Replace to proceed."
        );
        return;
      }
    }

    setBusy(true);

    let uploaded = 0;
    const failed: string[] = [];

    try {
      const token = await user.getIdToken();
      const queue = [...pending];

      // Three uploads at a time, each straight to storage (no size limit
      // from Vercel). See uploadOne() for the fallback.
      const run = async () => {
        for (let item = queue.shift(); item; item = queue.shift()) {
          try {
            await uploadOne(item, token);
            uploaded++;
            const done = item.id;
            setPending(old => old.filter(p => p.id !== done));
          } catch (error) {
            failed.push(`${item.candidateCode}: ${error instanceof Error ? error.message : "upload failed"}`);
          }
          setMessage(`Uploading... ${uploaded}/${pending.length} scripts completed.`);
          announceActivity();
        }
      };
      await Promise.all([run(), run(), run()]);

      await refresh().catch(() => undefined);

      setMessage(
        failed.length
          ? `${uploaded} script(s) uploaded. ${failed.length} failed and are still listed above: ${failed.slice(0, 3).join("; ")}${failed.length > 3 ? "; ..." : ""}`
          : `${uploaded} candidate script(s) uploaded successfully.`
      );
    } catch (error) {
      await refresh().catch(() => undefined);
      setMessage(
        `${uploaded} script(s) confirmed uploaded. ` +
        (error instanceof Error ? error.message : "Upload failed.") +
        " Check the uploaded script register before retrying."
      );
    } finally {
      setBusy(false);
    }
  }

  /** Read a response that should be JSON, without crashing on HTML/text errors. */
  async function readJson(response: Response): Promise<{ error?: string; url?: string }> {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      if (response.status === 413) return { error: "The file is too large to send through the server." };
      return { error: `Server error ${response.status}: ${text.slice(0, 80)}` };
    }
  }

  async function uploadOne(item: Pending, token: string) {
    const json = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const details = { paperId: item.paperId, candidateCode: item.candidateCode, replace: item.replace };

    if (!directBlocked.current) {
      const sign = await fetch(`${endpoint}/direct`, {
        method: "POST", headers: json, cache: "no-store",
        body: JSON.stringify({ action: "sign", ...details, size: item.file.size }),
      });
      const signed = await readJson(sign);
      if (!sign.ok || !signed.url) throw new Error(signed.error || "Could not start the upload.");

      let put: Response | null = null;
      try {
        put = await fetch(signed.url, { method: "PUT", headers: { "Content-Type": "application/pdf" }, body: item.file });
      } catch {
        // The browser blocked the request: storage CORS is not set up yet.
        directBlocked.current = true;
      }

      if (put) {
        if (!put.ok) throw new Error(`Storage refused the file (${put.status}).`);
        const complete = await fetch(`${endpoint}/direct`, {
          method: "POST", headers: json, cache: "no-store",
          body: JSON.stringify({ action: "complete", ...details, filename: item.file.name }),
        });
        const result = await readJson(complete);
        if (!complete.ok) throw new Error(result.error || "The upload could not be confirmed.");
        return;
      }
    }

    // Fallback through the server: only works under Vercel's ~4.5 MB limit.
    if (item.file.size > 4 * 1024 * 1024) {
      throw new Error("over 4 MB and direct storage upload is not set up (storage CORS)");
    }
    const form = new FormData();
    form.set("manifest", JSON.stringify([details]));
    form.append("file_0", item.file);
    const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form, cache: "no-store" });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error || "Upload failed.");
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
      // Fill the required boxes the teacher left empty, so a changed mark is never blocked:
      // a changed mark gets a default reason, and lost marks get default guidance (both editable).
      const prepared = (review?.marks ?? []).map(mark => {
        const original = review?.originalProposalMarks?.find(o => o.questionId === mark.questionId);
        const max = preview.approvedQuestions.find(q => q.id === mark.questionId)?.maxMarks ?? 0;
        const changed = original !== undefined && original.awardedMarks !== mark.awardedMarks;
        return {
          ...mark,
          // A changed mark with the AI feedback cleared would leave the student with no feedback.
          feedback: changed && !(mark.feedback ?? "").trim()
            ? (mark.awardedMarks >= max && max > 0
              ? `Your teacher reviewed this answer and awarded full marks (${mark.awardedMarks}/${max}).`
              : `Your teacher reviewed this answer and awarded ${mark.awardedMarks} out of ${max} marks.`)
            : mark.feedback,
          teacherJustification: changed && !(mark.teacherJustification ?? "").trim()
            ? `Teacher changed the mark from ${original!.awardedMarks} to ${mark.awardedMarks} after checking the script against the mark scheme.`
            : mark.teacherJustification,
          improvementGuidance: mark.awardedMarks < max && !(mark.improvementGuidance ?? "").trim()
            ? "Review the mark scheme points for this question to see what else was needed."
            : mark.improvementGuidance,
        };
      });
      const send = (revision: number | undefined) => fetch(action === "load" ? `${url}?${query}` : url, {
        method: action === "load" ? "GET" : "POST", cache: "no-store",
        headers: { Authorization: `Bearer ${idToken}`, ...(action === "load" ? {} : { "Content-Type": "application/json" }) },
        ...(action === "load" ? {} : { body: JSON.stringify({ paperId: preview.paperId, candidateCode: preview.candidateCode, action, marks: action === "propose" ? review?.marks : prepared, expectedRevision: revision }) }),
      });
      const idToken = await user.getIdToken();
      let response: Response;
      try {
        response = await send(review?.revision);
      } catch (networkError) {
        if (action !== "propose") throw networkError;
        setReviewMessage("Connection dropped while marking. Checking whether the server finished (up to 6 minutes)...");
        // Wait for a NEW proposal: the saved review's revision must change
        // (a regenerated script already has an older proposal).
        const before = review?.revision ?? -1;
        let found: Response | null = null;
        for (let attempt = 0; attempt < 24 && !found; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 15000));
          announceActivity();
          try {
            const check = await fetch(`${url}?${query}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
            const latest = check.ok ? await check.clone().json() : null;
            if (latest?.review && (latest.review.revision ?? -1) !== before) found = check;
          } catch {
            // Still offline: keep waiting.
          }
        }
        if (!found) throw new Error("No result after 6 minutes. Try again, or check the Vercel logs.");
        response = found;
      }
      let result = await proposalResult(response) as Awaited<ReturnType<typeof response.json>>;
      // The script was updated in the background (e.g. by "Re-check flags"): fetch the latest
      // revision and send the teacher's marks again, once.
      if (response.status === 409 && (action === "approve" || action === "save")) {
        const latestResponse = await fetch(`${url}?${query}`, { headers: { Authorization: `Bearer ${idToken}` }, cache: "no-store" });
        const latest = await latestResponse.json();
        if (latestResponse.ok && latest.review && latest.review.status !== "approved" && latest.review.revision !== review?.revision) {
          response = await send(latest.review.revision);
          result = await response.json();
        }
      }
      if (!response.ok) throw new Error(result.error || "Marking request failed.");
      // Verify the server acknowledged exactly the marks shown at approval time.
      if (action === "approve" || action === "save") {
        const submitted = prepared;
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
  async function loadAccuracy() {
    if (!user) return;
    setAccuracyError("");
    try {
      const response = await fetch(`${endpoint.replace(/\/scripts$/, "")}/accuracy`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load the accuracy report.");
      setAccuracy(data as AccuracyReport);
    } catch (error) { setAccuracyError(error instanceof Error ? error.message : "Unable to load the accuracy report."); }
  }
  async function loadQueue(): Promise<QueueRow[]> {
    if (!user) return [];
    setQueueError("");
    try {
      const response = await fetch(`${endpoint}/queue`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load review queue.");
      setQueue(data.rows);
      setSamples(Array.isArray(data.samples) ? data.samples : []);
      setWatch(Array.isArray(data.watch) ? data.watch : []);
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
  /** Approve every script with nothing to check on papers whose sample has passed. */
  async function approveSampleModerated() {
    if (!user || queueBusy) return;
    const passed = new Set(samples.filter(sample => sample.passed).map(sample => sample.paperId));
    const selections = queue.filter(row => row.sampleReady && passed.has(row.paperId))
      .map(row => ({ paperId: row.paperId, candidateCode: row.candidateCode, expectedRevision: row.revision }));
    if (!selections.length || !sampleConfirmed) return;
    const note = samples.filter(sample => sample.passed).map(sample => `Paper ${sample.paperId}: ${sample.reviewed} script(s) reviewed individually, ${sample.withinTolerance} within ±2 of the AI total (largest difference ${sample.worst}).`).join(" ")
      + " Remaining scripts with no questions to check approved under sample moderation.";
    if (!window.confirm(`Approve ${selections.length} script(s) with nothing to check, based on your sample? Scripts with questions to check are not included. This is recorded in the audit log.`)) return;
    setQueueBusy(true); setQueueError("");
    try {
      let approved = 0, rejected = 0;
      const reasons: string[] = [];
      for (let start = 0; start < selections.length; start += 20) {
        setBatchProgress(`Approving ${Math.min(start + 20, selections.length)} of ${selections.length}...`);
        const response = await fetch(`${endpoint}/bulk-approve`, { method: "POST", cache: "no-store",
          headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify({ selections: selections.slice(start, start + 20), confirmed: true, moderationNote: note.slice(0, 1000), mode: "sample", sampleConfirmed: true }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Approval failed.");
        approved += data.approved ?? 0; rejected += data.rejected ?? 0;
        for (const o of (data.outcomes ?? []) as { candidateCode: string; approved: boolean; reason?: string }[]) if (!o.approved) reasons.push(`${o.candidateCode}: ${o.reason ?? "rejected"}`);
      }
      setBatchProgress(`Sample moderation: ${approved} approved, ${rejected} not approved.${reasons.length ? ` Not approved: ${reasons.join("; ")}.` : ""}`);
      setSampleConfirmed(false);
      await loadQueue();
    } catch (error) { setQueueError(error instanceof Error ? error.message : "Approval failed."); }
    finally { setQueueBusy(false); }
  }

  async function bulkApproveSelected() {
    if (!user || queueBusy) return;
    const selections = queue.filter(row => bulkSelected.includes(`${row.paperId}_${row.candidateCode}`) && eligible(row))
      .map(row => ({ paperId: row.paperId, candidateCode: row.candidateCode, expectedRevision: row.revision }));
    if (!sampleChecked || !selections.length || moderationNote.trim().length < 12) {
      setQueueError("Select eligible scripts and enter a moderation note of at least 12 characters."); return;
    }
    const flaggedCount = queue.filter(row => selections.some(sel => sel.paperId === row.paperId && sel.candidateCode === row.candidateCode) && row.flagged).length;
    if (!window.confirm(includeFlagged && flaggedCount
      ? `You are approving ${selections.length} script(s), including ${flaggedCount} with flagged questions. Confirm you have reviewed those flagged questions. Your acceptance of each flag is recorded in the audit log. Continue?`
      : `You are authorising ${selections.length} candidate script(s) after checking the source scripts and moderating a sample. Any stale or flagged scripts will be rejected. Continue?`)) return;
    setQueueBusy(true); setQueueError("");
    try {
      // The server accepts up to 20 per request, so larger selections are sent in batches.
      let approved = 0, rejected = 0;
      const reasons: string[] = [];
      for (let start = 0; start < selections.length; start += 20) {
        setBatchProgress(`Approving ${Math.min(start + 20, selections.length)} of ${selections.length}...`);
        const response = await fetch(`${endpoint}/bulk-approve`, { method: "POST", cache: "no-store",
          headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify({ selections: selections.slice(start, start + 20), confirmed: true, moderationNote: moderationNote.trim(), includeFlagged, flagsReviewed: includeFlagged }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Bulk approval failed.");
        approved += data.approved ?? 0; rejected += data.rejected ?? 0;
        for (const o of (data.outcomes ?? []) as { candidateCode: string; approved: boolean; reason?: string }[]) if (!o.approved) reasons.push(`${o.candidateCode}: ${o.reason ?? "rejected"}`);
      }
      setBatchProgress(`Bulk approval: ${approved} approved, ${rejected} not approved.${reasons.length ? ` Not approved: ${reasons.join("; ")}.` : ""}`);
      setBulkSelected([]);
      setSampleChecked(false);
      await loadQueue();
    } catch (error) { setQueueError(error instanceof Error ? error.message : "Bulk approval failed."); }
    finally { setQueueBusy(false); }
  }
  // Load the review queue as soon as the marking stage opens.
  useEffect(() => {
    if (mode === "marking" && user) { void loadQueue(); void loadUsage(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user, examId]);
  async function reflag() {
    if (!user || queueBusy) return;
    setQueueBusy(true); setQueueError("");
    try {
      const response = await fetch(`${endpoint}/reflag`, { method: "POST", headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Re-check failed.");
      setBatchProgress(`Flags re-checked for ${data.checked} script(s): ${data.cleared} now have no flags, ${data.stillFlagged} still need a look. Marks were not changed.`);
      await loadQueue();
    } catch (error) { setQueueError(error instanceof Error ? error.message : "Re-check failed."); }
    finally { setQueueBusy(false); }
  }
  async function loadUsage(): Promise<UsageSummary | null> {
    if (!user) return null;
    try {
      const response = await fetch("/api/marking-centre/usage", { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      if (!response.ok) return null;
      const data = await response.json() as UsageSummary;
      setUsage(data);
      return data;
    } catch { return null; }
  }
  /**
   * AI proposals for long handwritten scripts can take several minutes, and
   * some networks drop a request that is open that long ("Failed to fetch")
   * while the server carries on and saves the proposal. After a dropped
   * connection, check the queue every 15 seconds (up to 6 minutes, longer
   * than the server's 5-minute limit) until this script is no longer
   * unprocessed.
   */
  async function waitForProposal(paperId: string, candidateCode: string): Promise<boolean> {
    if (!user) return false;
    for (let attempt = 0; attempt < 24; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 15000));
      announceActivity();
      try {
        const response = await fetch(`${endpoint}/queue`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
        if (!response.ok) continue;
        const data = await response.json() as { rows?: QueueRow[] };
        const row = data.rows?.find(r => r.paperId === paperId && r.candidateCode === candidateCode);
        if (row && row.status !== "unprocessed") return true;
      } catch {
        // Still offline: keep waiting.
      }
    }
    return false;
  }

  /** Parse a JSON response; a Vercel timeout returns an HTML/text page instead. */
  async function proposalResult(response: Response): Promise<{ error?: string }> {
    const text = await response.text();
    try { return JSON.parse(text); } catch {
      return { error: response.status === 504 ? "Marking took longer than 5 minutes and timed out. Try this script again." : `Server error ${response.status}.` };
    }
  }

  async function proposeBatch() {
    if (!user || queueBusy) return;
    const latestQueue = await loadQueue();
    const todo = latestQueue.filter(row => row.status === "unprocessed");
    if (!todo.length) { setQueueError("No unprocessed scripts in the current queue. Refresh the queue first."); return; }
    const spend = await loadUsage();
    const estimate = spend ? todo.length * spend.averageCostPerScriptUsd : null;
    const costLine = spend && estimate !== null
      ? `\n\nEstimated cost: about $${estimate.toFixed(2)} (≈ $${spend.averageCostPerScriptUsd.toFixed(2)} per script). Spent this month: $${spend.costUsd.toFixed(2)}${spend.budgetUsd > 0 ? ` of your $${spend.budgetUsd.toFixed(0)} monthly cap` : ""}.`
        + (spend.budgetUsd > 0 && spend.costUsd + estimate > spend.budgetUsd ? "\n\nWarning: this batch may reach the monthly cap; marking stops when it is reached." : "")
      : "";
    if (!window.confirm(`Mark all ${todo.length} remaining scripts with AI? This does not approve any marks. Keep this tab open until the batch finishes.${costLine}`)) return;
    setQueueBusy(true); setQueueError("");
    let completed = 0, failed = 0;
    // A proposal can take minutes with no clicks: keep the session active while the batch runs.
    const keepAlive = window.setInterval(announceActivity, 60000);
    for (const item of todo) {
      setBatchProgress(`Processing ${completed + failed + 1}/${todo.length}: ${item.candidateCode}`);
      try {
        let response: Response | null = null;
        try {
          response = await fetch(`${endpoint}/review`, {
            method: "POST", cache: "no-store",
            headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ action: "propose", paperId: item.paperId, candidateCode: item.candidateCode }),
          });
        } catch {
          setBatchProgress(`Connection dropped on ${item.candidateCode}: checking whether the server finished it...`);
          announceActivity();
          if (await waitForProposal(item.paperId, item.candidateCode)) { completed++; continue; }
          throw new Error("No result after 6 minutes. Try this script on its own.");
        }
        const data = await proposalResult(response);
        if (!response.ok) throw new Error(data.error || "Proposal failed.");
        completed++;
      } catch (error) {
        failed++;
        setQueueError(old => `${old}${old ? " | " : ""}${item.candidateCode}: ${error instanceof Error ? error.message : "Failed"}`);
      }
    }
    setBatchProgress(`Finished: ${completed} proposed, ${failed} failed. No marks were approved.`);
    window.clearInterval(keepAlive); setQueueBusy(false);
    void loadUsage();
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
  // Flags for the open review, labelled check / info, plus questions the AI is often wrong on.
  const panelFlags: ReviewFlag[] = review ? [
    ...(review.qualityFlags ?? []).map(flag => ({ ...flag, tier: review.checkedQuestions?.includes(flag.questionId) ? "info" as const : flagTier(flag, preview?.approvedQuestions.find(q => q.id === flag.questionId)?.maxMarks) })),
    ...watchFlags(review.paperId, review.marks, watch).map(flag => ({ ...flag, tier: review.checkedQuestions?.includes(flag.questionId) ? "info" as const : "check" as const })),
  ] : [];
  return <section className="space-y-4 border-t pt-5">
    {mode === "scripts" && <>
    <div><h3 className="text-lg font-semibold">Candidate answer scripts</h3><p className="text-sm text-slate-600">Upload individual PDFs or select your entire cohort at once. Match every file to a candidate and paper before saving. Filename matching uses an existing candidate code.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">{papers.map(p => <div key={p.id} className="rounded-lg border bg-slate-50 p-3"><strong>{p.title}</strong><p className="text-sm">{scripts.filter(s => s.paperId === p.id).length} / {candidateCodes.length} uploaded</p></div>)}</div>
    <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
      <label className="text-sm">Paper<select className="mt-1 block w-full rounded border p-2" value={paperId} onChange={e => setPaperId(e.target.value)}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
      <label className="text-sm">Candidate (individual upload)<select className="mt-1 block w-full rounded border p-2" value={candidateCode} onChange={e => setCandidateCode(e.target.value)}><option value="">Select candidate</option>{candidateCodes.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
      <label className="text-sm">Individual PDF<input className="mt-1 block w-full text-xs" disabled={busy || !candidateCode} type="file" accept=".pdf,application/pdf" onChange={e => { addFiles(e.target.files, paperId, candidateCode); e.target.value = ""; }}/></label>
      <label className="text-sm md:col-span-3">Bulk PDFs for selected paper<input className="mt-1 block w-full text-xs" disabled={busy} type="file" multiple accept=".pdf,application/pdf" onChange={e => { addFiles(e.target.files, paperId); e.target.value = ""; }}/></label>
    </div>
    <BatchScanSplitter papers={papers} defaultPaperId={paperId} candidateCodes={candidateCodes} existing={existing} disabled={busy} onStage={(files, selectedPaper) => addFiles(files, selectedPaper)} />
    {pending.length > 0 && <div className="space-y-3"><h4 className="font-semibold">Review {pending.length} staged file(s)</h4><div className="max-h-96 space-y-2 overflow-y-auto">{pending.map(item => <div key={item.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-4"><div className="break-all text-xs">{item.file.name}</div><select aria-label={`Candidate for ${item.file.name}`} value={item.candidateCode} disabled={busy} className="rounded border p-2 text-xs" onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, candidateCode: e.target.value } : p))}><option value="">Unmatched — choose candidate</option>{candidateCodes.map(c => <option key={c}value={c}>{c}</option>)}</select><select aria-label={`Paper for ${item.file.name}`} value={item.paperId} disabled={busy} className="rounded border p-2 text-xs" onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, paperId: e.target.value } : p))}>{papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><div className="flex items-center justify-between gap-2"><label className="text-xs"><input type="checkbox" disabled={busy} checked={item.replace} onChange={e => setPending(old => old.map(p => p.id === item.id ? { ...p, replace: e.target.checked } : p))}/> Replace existing</label><button type="button" disabled={busy} onClick={() => setPending(old => old.filter(p => p.id !== item.id))} className="text-xs text-red-700">Remove</button></div></div>)}</div><button type="button" disabled={busy} onClick={() => void submit()} className="rounded-lg bg-indigo-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Uploading..." : `Confirm upload (${pending.length})`}</button>{pending.length > BATCH && <p className="text-sm text-amber-700">Files will be uploaded automatically in smaller batches.</p>}</div>}
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
      {usage && <p className="rounded bg-slate-50 p-2 text-xs text-slate-700">Estimated AI spend this month: <strong>${usage.costUsd.toFixed(2)}</strong>{usage.budgetUsd > 0 ? ` of $${usage.budgetUsd.toFixed(0)} cap` : " (no cap set)"} · {usage.scriptsMarked} script(s) marked · about ${usage.averageCostPerScriptUsd.toFixed(2)} per script. Estimates only; check your provider's billing page for exact charges.</p>}
      <p className="text-xs text-slate-600">Mark every remaining selectable-text script in one action. Keep this tab open while marking runs. Completed proposals are saved, so you can retry failures without repeating successful work. You approve marks after checking exceptions and a suitable sample.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border px-3 py-2 text-sm" disabled={queueBusy} onClick={() => void loadQueue()}>Refresh review queue</button>
        <button type="button" className="rounded border px-3 py-2 text-sm" disabled={queueBusy} onClick={() => void reflag()} title="Recalculates flags from the saved evidence. No AI calls, no cost.">Re-check flags (free)</button>
        <button
          type="button"
          className="rounded bg-indigo-700 px-3 py-2 text-sm text-white"
          disabled={queueBusy}
          onClick={() => void proposeBatch()}
        >
          {queueBusy ? "Processing..." : "Mark all remaining scripts"}
        </button>
      </div>
      <div className="space-y-2 rounded border border-indigo-200 p-3">
        <p className="text-sm font-semibold">AI accuracy check</p>
        <p className="text-xs">Mark at least 5 scripts on paper first without looking at the AI. Then enter your marks (override where you disagree) and approve each one individually. This report compares the AI&apos;s original marks with yours.</p>
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => void loadAccuracy()}>Show accuracy report</button>
        {accuracyError && <p role="alert" className="text-sm text-red-700">{accuracyError}</p>}
        {accuracy && <div className="space-y-2 text-sm">
          <p className={accuracy.verdict === "ready_for_bulk_approval" ? "rounded bg-green-50 p-2 text-green-900" : "rounded bg-amber-50 p-2 text-amber-900"}><strong>{accuracy.verdict === "ready_for_bulk_approval" ? "Ready for bulk approval" : accuracy.verdict === "keep_reviewing" ? "Keep reviewing" : "Not enough data yet"}.</strong> {accuracy.advice}</p>
          <p className="text-xs">{accuracy.summary.scriptsCompared} script(s) compared · questions identical: {(accuracy.summary.questionAgreement * 100).toFixed(0)}% · totals within ±{accuracy.summary.totalTolerance}: {accuracy.summary.scriptsWithinTolerance}/{accuracy.summary.scriptsCompared} · average total difference: {accuracy.summary.meanTotalDifference.toFixed(1)} · AI tendency: {accuracy.summary.averageBias > 0.25 ? `${accuracy.summary.averageBias.toFixed(1)} marks too generous` : accuracy.summary.averageBias < -0.25 ? `${Math.abs(accuracy.summary.averageBias).toFixed(1)} marks too harsh` : "balanced"}</p>
          {accuracy.questions.length > 0 && <div className="max-h-60 overflow-auto"><table className="w-full text-left text-xs"><thead><tr><th className="border p-1">Question</th><th className="border p-1">Compared</th><th className="border p-1">Identical</th><th className="border p-1">Avg difference</th><th className="border p-1">AI too generous</th><th className="border p-1">AI too harsh</th></tr></thead>
            <tbody>{accuracy.questions.map(q => <tr key={q.questionId} className={q.agreementRate < 0.9 ? "bg-amber-50" : ""}><td className="border p-1">{q.questionId}</td><td className="border p-1">{q.compared}</td><td className="border p-1">{(q.agreementRate * 100).toFixed(0)}%</td><td className="border p-1">{q.meanAbsoluteDifference.toFixed(2)}</td><td className="border p-1">{q.aiTooGenerous}</td><td className="border p-1">{q.aiTooHarsh}</td></tr>)}</tbody></table></div>}
          {accuracy.scripts.length > 0 && <details className="text-xs"><summary className="cursor-pointer">Per-script comparison</summary><ul className="mt-1 space-y-1">{accuracy.scripts.map(sc => <li key={sc.candidateCode}>{sc.candidateCode}: AI {sc.aiTotal}, you {sc.teacherTotal} ({sc.difference > 0 ? "+" : ""}{sc.difference}){sc.questionsChanged.length ? `: ${sc.questionsChanged.join(", ")}` : ""}</li>)}</ul></details>}
        </div>}
      </div>
      {user && queue.some(r => r.status !== "approved" && r.status !== "unprocessed") && <QuestionCheckPanel
        endpoint={endpoint}
        paperIds={[...new Set(queue.filter(r => r.status !== "approved").map(r => r.paperId))]}
        getToken={() => user.getIdToken()}
        onSaved={loadQueue}
        openScript={(paperId, candidateCode) => { const row = queue.find(r => r.paperId === paperId && r.candidateCode === candidateCode); void previewScript({ paperId, candidateCode, filename: row?.filename ?? "Candidate script", size: 0, uploadedAt: null }); }}
      />}
      {samples.length > 0 && <div className="space-y-2 rounded border-2 border-emerald-300 p-3">
        <p className="text-sm font-semibold">Sample moderation (quickest)</p>
        <p className="text-xs text-slate-700">Review a sample of scripts one at a time (at least 3, or 10% of the paper). If your marks agree with the AI (90% of the sample within ±2 marks, none more than 4 out), every script with nothing to check can be approved together. Scripts with questions to check still need opening, but only those questions are shown. Use this for mocks and internal assessment, not for marks you submit to the exam board.</p>
        {samples.map(sample => {
          const ready = queue.filter(r => r.paperId === sample.paperId && r.sampleReady).length;
          const toCheck = queue.filter(r => r.paperId === sample.paperId && r.status !== "approved" && (r.checks ?? 0) > 0).length;
          return <div key={sample.paperId} className={`rounded p-2 text-sm ${sample.passed ? "bg-emerald-50 text-emerald-900" : sample.failed ? "bg-red-50 text-red-900" : "bg-slate-50"}`}>
            <p><strong>Paper {sample.paperId}:</strong> {sample.reviewed} of {sample.required} sample scripts reviewed · {sample.withinTolerance} within ±2.{" "}
              {sample.passed ? `Sample passed: ${ready} script(s) can be approved together, ${toCheck} still have questions to check.`
                : sample.failed ? `Sample did not pass (${sample.outliers.join(", ") || "large difference"}). Review the remaining scripts individually, or fix the criteria for the questions you changed and re-mark.`
                : `Review ${sample.required - sample.reviewed} more script(s) to complete the sample.`}</p>
            {sample.suggested.length > 0 && <p className="mt-1 text-xs">Suggested (spread across low, middle and high AI totals): {sample.suggested.map(code => <button key={code} type="button" className="mr-2 text-indigo-700 underline" disabled={queueBusy} onClick={() => { const row = queue.find(r => r.paperId === sample.paperId && r.candidateCode === code); if (row) void previewScript({ paperId: row.paperId, candidateCode: row.candidateCode, filename: row.filename, size: 0, uploadedAt: null }); }}>{code}</button>)}. Open each one, check every question, correct any mark and approve it.</p>}
          </div>;
        })}
        {watch.length > 0 && <p className="text-xs text-amber-900">Always checked, because the AI differed from you on them: {watch.map(w => `${w.questionId} (${w.agreed}/${w.compared} matched)`).join(", ")}. Tightening the criteria for these questions in step 4 will reduce checking.</p>}
        {samples.some(sample => sample.passed) && <>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={sampleConfirmed} onChange={e => setSampleConfirmed(e.target.checked)} /><span>I reviewed the sample scripts against the original papers and mark scheme, and I am satisfied the AI&apos;s marking is consistent with mine for this assessment.</span></label>
          <button type="button" className="rounded bg-emerald-700 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={queueBusy || !sampleConfirmed || !queue.some(r => r.sampleReady && samples.some(sample => sample.passed && sample.paperId === r.paperId))} onClick={() => void approveSampleModerated()}>Approve {queue.filter(r => r.sampleReady && samples.some(sample => sample.passed && sample.paperId === r.paperId)).length} script(s) with nothing to check</button>
        </>}
      </div>}
      <div className="space-y-2 rounded border border-amber-200 p-3">
        <p className="text-sm font-semibold">Approve eligible scripts together</p>
        <p className="text-xs">Scripts with automated warnings are excluded. Check a suitable sample against the original papers and mark scheme before approval. AI confidence does not guarantee correctness.</p>
        <button type="button" className="rounded border px-3 py-1 text-sm" disabled={queueBusy} onClick={() => setBulkSelected(queue.filter(r => eligible(r)).map(r => `${r.paperId}_${r.candidateCode}`))}>Select all ready for approval</button>
        <label className="flex items-start gap-2 rounded bg-amber-50 p-2 text-sm"><input type="checkbox" checked={includeFlagged} onChange={e => { setIncludeFlagged(e.target.checked); setBulkSelected([]); }} /><span><strong>Include flagged scripts.</strong> I have opened these scripts and reviewed every question marked <em>Check</em> (the reason is shown in the table). Information-only flags were left as the AI resolved them. My acceptance of each flag is recorded.</span></label>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={sampleChecked} onChange={e => setSampleChecked(e.target.checked)} />I have checked an appropriate sample against the original scripts and approved mark scheme.</label>
        <label className="block text-xs">Moderation record (editable)
          <textarea className="mt-1 w-full rounded border p-2 text-sm" value={moderationNote} onChange={e => setModerationNote(e.target.value)} maxLength={1000} rows={2} placeholder="For example: Checked a sample of high, middle and low scoring scripts against the approved mark scheme; reviewed automated exceptions." />
        </label>
        <button type="button" className="rounded bg-indigo-700 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={queueBusy || !sampleChecked || bulkSelected.length === 0 || moderationNote.trim().length < 12} onClick={() => void bulkApproveSelected()}>Approve {bulkSelected.length} selected scripts</button>
        {!queueBusy && (bulkSelected.length === 0 || !sampleChecked || moderationNote.trim().length < 12) && <p className="text-xs text-amber-800">To approve: {[bulkSelected.length === 0 ? "select scripts (tick All, or tick rows)" : "", !sampleChecked ? "tick the sample confirmation" : "", moderationNote.trim().length < 12 ? `type a moderation note (${moderationNote.trim().length}/12 characters; the grey text is only an example)` : ""].filter(Boolean).join(" · ")}.</p>}
      </div>
      {batchProgress && <p role="status" className="text-sm">{batchProgress}</p>}
      {queueError && <p role="alert" className="text-sm text-red-700">{queueError}</p>}
      {queue.length > 0 && <><p className="text-sm">{queue.length} uploaded · {queue.filter(r => r.status === "approved").length} approved · {queue.filter(r => r.status !== "approved" && r.flags.some(isCheckFlag)).length} with questions to check · {queue.filter(r => r.status !== "approved" && r.status !== "unprocessed" && !r.flags.some(isCheckFlag)).length} with nothing to check · {queue.filter(r => r.status === "unprocessed").length} unprocessed</p>
        <div className="max-h-72 overflow-auto"><table className="w-full text-left text-xs"><thead><tr><th className="border p-2"><label className="flex items-center gap-1"><input type="checkbox" aria-label="Select all eligible scripts" disabled={queueBusy || !queue.some(r => eligible(r))} checked={queue.some(r => eligible(r)) && queue.filter(r => eligible(r)).every(r => bulkSelected.includes(`${r.paperId}_${r.candidateCode}`))} onChange={e => setBulkSelected(e.target.checked ? queue.filter(r => eligible(r)).map(r => `${r.paperId}_${r.candidateCode}`) : [])} />All</label></th><th className="border p-2">Candidate</th><th className="border p-2">Paper</th><th className="border p-2">Status</th><th className="border p-2">Review warnings</th><th className="border p-2">Open</th></tr></thead><tbody>{queue.map(item => <tr key={`${item.paperId}_${item.candidateCode}`}><td className="border p-2"><input type="checkbox" aria-label={`Select ${item.candidateCode} ${item.paperId} for bulk approval`} disabled={!eligible(item) || queueBusy} checked={bulkSelected.includes(`${item.paperId}_${item.candidateCode}`)} onChange={e => setBulkSelected(old => e.target.checked ? [...old, `${item.paperId}_${item.candidateCode}`].slice(0, 20) : old.filter(k => k !== `${item.paperId}_${item.candidateCode}`))} /></td><td className="border p-2">{item.candidateCode}</td><td className="border p-2">{item.paperId}</td><td className="border p-2">{item.status}</td><td className="border p-2">{item.flags.length ? <details><summary className={`cursor-pointer ${item.status === "approved" ? "text-slate-500" : ""}`}>{item.status === "approved" ? `Approved · ${groupedFlags(item.flags)}` : <>{item.flags.some(isCheckFlag) ? <strong className="text-amber-900">Check: {groupedFlags(item.flags.filter(isCheckFlag))}</strong> : <span className="text-emerald-800">Nothing to check</span>}{item.flags.some(f => !isCheckFlag(f)) && <span className="block text-slate-500">For information: {groupedFlags(item.flags.filter(f => !isCheckFlag(f)))}</span>}</>}</summary><ul className="mt-1 list-disc pl-4 text-slate-600">{item.flags.map((f, i) => <li key={i}>Q{f.questionId}: {f.code === "UNCERTAIN" ? f.detail : f.detail || f.code}</li>)}</ul></details> : "No automated flags (teacher verification still required)"}</td><td className="border p-2"><button type="button" className="text-indigo-700 underline" disabled={queueBusy} onClick={() => void previewScript({ paperId: item.paperId, candidateCode: item.candidateCode, filename: item.filename, size: 0, uploadedAt: null })}>Review</button></td></tr>)}</tbody></table></div>
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
            : preview.extraction.visionUsed
              ? `Handwriting transcribed by AI vision (${preview.extraction.pages} page(s)). Compare every answer with the original script, especially any question shown as missing or incomplete.`
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
        <p className="text-sm text-amber-800">AI marks are provisional. Check the original PDF and approved criteria before approving. Answers from handwritten scripts are AI transcriptions, so check them against the original PDF.</p>
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
          {(() => {
            const checkIds = new Set(panelFlags.filter(isCheckFlag).map(f => f.questionId));
            const needs = review.marks.filter(m => checkIds.has(m.questionId) || checkIds.has("*")).length;
            return <label className="flex items-start gap-2 rounded bg-indigo-50 p-2 text-sm"><input type="checkbox" className="mt-1" checked={focusReview} onChange={e => setFocusReview(e.target.checked)} /><span><strong>Focus on questions to check</strong> ({needs} of {review.marks.length}). Routine questions are folded: open any of them to check or change the mark.</span></label>;
          })()}
          {review.marks.map((mark, index) => {
            const checks = panelFlags.filter(flag => (flag.questionId === mark.questionId || flag.questionId === "*") && isCheckFlag(flag));
            const max = preview.approvedQuestions.find(q => q.id === mark.questionId)?.maxMarks;
            const body = <>
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
            {panelFlags.filter(flag => flag.questionId === mark.questionId || flag.questionId === "*").map((flag, flagIndex) => <p key={`${flag.code}_${flagIndex}`} className={`rounded p-2 text-xs ${isCheckFlag(flag) ? "bg-amber-50 text-amber-900" : "bg-slate-50 text-slate-600"}`}>{isCheckFlag(flag) ? "Check" : "For information"} ({flagLabel(flag)}): {flag.detail}</p>)}
            <p className="text-xs text-slate-600">Evidence: {mark.evidence || "Not supplied"} · Confidence: {mark.confidence}{mark.needsReview ? " · Requires review" : ""}</p>
            </>;
            if (focusReview && checks.length === 0) return <details key={mark.questionId} className="rounded border p-2"><summary className="cursor-pointer text-sm">Question {mark.questionId} · {mark.awardedMarks}/{max} · <span className="text-slate-600">{(mark.feedback || "").slice(0, 110)}{(mark.feedback || "").length > 110 ? "…" : ""}</span></summary><div className="mt-2 space-y-2">{body}</div></details>;
            return <div key={mark.questionId} className={`space-y-2 rounded border p-3 ${checks.length ? "border-2 border-amber-400" : ""}`}>{body}</div>;
          })}
          {review.status !== "approved" && !review.stale && <div className="flex flex-wrap gap-2">
            <button type="button" disabled={reviewBusy} className="rounded border px-3 py-2 text-sm" onClick={() => void reviewAction("save")}>Save teacher edits</button>
            <button type="button" disabled={reviewBusy} className="rounded bg-emerald-700 px-3 py-2 text-sm text-white" onClick={() => { if (window.confirm("Confirm you checked the original script, every mark, feedback and improvement guidance? Approval locks this review.")) void reviewAction("approve"); }}>Approve final marks</button>
          </div>}
        {reviewBusy && <p role="status" className="text-sm text-slate-700">Saving…</p>}
        {reviewMessage && <p role="status" className="rounded bg-green-50 p-2 text-sm text-green-800">{reviewMessage}</p>}
        {reviewError && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{reviewError}</p>}
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
        <p className="text-sm">Maximum: {results.maximum} · {results.rows.filter(r => r.status === "approved").length} / {results.rows.length} candidates have approved results{results.rows.some(r => r.status === "provisional") ? ` · ${results.rows.filter(r => r.status === "provisional").length} provisional (AI marks awaiting your approval, shown in italics)` : ""} · Grading {results.grading.ready ? (results.grading.mode === "official" ? "official verified" : "internal estimate") : "not configured"}</p>
        <div className="max-h-80 overflow-auto"><table className="w-full border-collapse text-left text-xs"><thead><tr><th className="border p-2">Candidate</th>{results.papers.map(p => <th key={p.id} className="border p-2">{p.title}</th>)}<th className="border p-2">Total</th><th className="border p-2">Grade</th><th className="border p-2">Feedback report</th></tr></thead><tbody>{results.rows.map(r => <tr key={r.candidateCode}><td className="border p-2">{r.candidateCode}</td>{results.papers.map(p => <td key={p.id} className="border p-2">{r.paperScores[p.id] ?? (r.provisionalScores?.[p.id] != null ? <span className="italic text-amber-800" title="AI proposal, not yet approved">{r.provisionalScores[p.id]} (provisional)</span> : "Pending")}</td>)}<td className="border p-2">{r.total ?? (r.provisionalTotal != null ? <span className="italic text-amber-800" title="AI proposal, not yet approved">{r.provisionalTotal} (provisional)</span> : "Pending")}</td><td className="border p-2">{r.grade ?? (r.provisionalGrade ? <span className="italic text-amber-800" title="Based on unapproved AI marks">{r.provisionalGrade} (provisional)</span> : "—")}</td><td className="border p-2"><button type="button" className="rounded border px-2 py-1 text-indigo-700" onClick={() => void downloadReport("pdf", r.candidateCode)}>PDF</button></td></tr>)}</tbody></table></div>
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
