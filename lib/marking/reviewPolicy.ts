// Review policy: which flags need the teacher's eye, which questions the AI is weak on
// (learned from the teacher's own individually approved scripts), and whether a
// paper has passed sample moderation. Pure functions, shared by server and browser.

import { qualityFlags, type FlagMark, type FlagQuestion } from "./reviewFlags";

export type PolicyFlag = { questionId: string; code: string; detail: string };
type Mark = { questionId: string; awardedMarks: number };
export type ApprovedReview = { paperId?: string; candidateCode?: string; status?: string; approvalMethod?: string; marks?: Mark[]; originalProposalMarks?: Mark[] };

/** An extended-answer question: any disagreement there matters. */
export const EXTENDED_MARKS = 6;
/** Questions the AI matched the teacher on less often than this are always checked. */
export const WATCH_AGREEMENT = 0.8;
export const WATCH_MIN_COMPARED = 3;
/** A sampled script passes when its total is within this many marks of the AI's. */
export const SAMPLE_TOLERANCE = 2;
export const SAMPLE_HARD_LIMIT = 4;

export type WatchEntry = { paperId: string; questionId: string; compared: number; agreed: number };

/** Approved by the teacher one at a time (not bulk): the only real evidence of agreement. */
export function individuallyApproved(review: ApprovedReview): boolean {
  return review.status === "approved" && !(typeof review.approvalMethod === "string" && review.approvalMethod.startsWith("teacher_confirmed_bulk"))
    && Array.isArray(review.marks) && Array.isArray(review.originalProposalMarks)
    && review.marks.length > 0 && review.marks.length === review.originalProposalMarks.length;
}

function totals(review: ApprovedReview) {
  let ai = 0, teacher = 0;
  for (const mark of review.marks ?? []) {
    const original = review.originalProposalMarks?.find(o => o.questionId === mark.questionId);
    if (!original) continue;
    ai += Number(original.awardedMarks) || 0;
    teacher += Number(mark.awardedMarks) || 0;
  }
  return { ai, teacher, difference: ai - teacher };
}

/** Per question agreement between the AI's first proposal and the teacher's approved mark. */
export function watchList(reviews: ApprovedReview[]): WatchEntry[] {
  const stats = new Map<string, WatchEntry>();
  for (const review of reviews) {
    if (!individuallyApproved(review) || !review.paperId) continue;
    for (const mark of review.marks!) {
      const original = review.originalProposalMarks!.find(o => o.questionId === mark.questionId);
      if (!original) continue;
      const key = `${review.paperId}:${mark.questionId}`;
      const entry = stats.get(key) ?? { paperId: review.paperId, questionId: mark.questionId, compared: 0, agreed: 0 };
      entry.compared++;
      if (original.awardedMarks === mark.awardedMarks) entry.agreed++;
      stats.set(key, entry);
    }
  }
  return [...stats.values()].filter(e => e.compared >= WATCH_MIN_COMPARED && e.agreed / e.compared < WATCH_AGREEMENT);
}

/** Adds a "check" flag to every question the AI has been unreliable on for this paper. */
export function watchFlags(paperId: string, marks: { questionId: string }[], watch: WatchEntry[]): PolicyFlag[] {
  return marks.flatMap(mark => {
    const entry = watch.find(w => w.paperId === paperId && w.questionId === mark.questionId);
    return entry ? [{ questionId: mark.questionId, code: "WATCH_QUESTION", detail: `The AI matched your mark on this question in only ${entry.agreed} of ${entry.compared} scripts you checked.` }] : [];
  });
}

/**
 * "check": could mean a wrong mark. "info": shown for transparency only.
 * Small (1 mark) marker disagreements on short questions are resolved by the
 * moderator's mark; auto-check corrections are already applied.
 */
export function flagTier(flag: { code: string; detail: string }, maxMarks: number | undefined): "check" | "info" {
  if (flag.code === "MISSING_FEEDBACK" || flag.code === "MISSING_GUIDANCE") return "info";
  if (flag.code !== "UNCERTAIN") return "check";
  const detail = flag.detail.toLowerCase();
  const extended = (maxMarks ?? 0) >= EXTENDED_MARKS;
  if (detail.includes("could not mark")) return "check";
  const disagreed = detail.match(/markers disagreed \((\d+) vs (\d+)\)/);
  if (disagreed && (Math.abs(Number(disagreed[1]) - Number(disagreed[2])) >= 2 || extended)) return "check";
  if (detail.includes("moderation unavailable") && extended) return "check";
  return "info";
}

export type SampleStatus = {
  paperId: string;
  scripts: number;
  required: number;
  reviewed: number;
  withinTolerance: number;
  worst: number;
  passed: boolean;
  failed: boolean;
  outliers: string[];
  suggested: string[];
};

/** Sample size: 10% of the scripts on the paper, at least 3. */
export function sampleSize(scripts: number): number {
  return Math.min(scripts, Math.max(3, Math.ceil(scripts * 0.1)));
}

/**
 * Sample moderation for one paper. Passed when enough scripts were approved one at a
 * time, at least 90% have totals within ±2 of the AI and none is more than 4 out.
 * Suggested scripts to review are spread across the AI's total marks (low, high, middle).
 */
export function sampleStatus(
  paperId: string,
  reviews: ApprovedReview[],
  pending: { candidateCode: string; aiTotal: number }[],
  scriptCount: number,
): SampleStatus {
  const sampled = reviews.filter(r => r.paperId === paperId && individuallyApproved(r));
  const differences = sampled.map(r => ({ code: r.candidateCode ?? "", diff: Math.abs(totals(r).difference) }));
  const within = differences.filter(d => d.diff <= SAMPLE_TOLERANCE).length;
  const worst = differences.reduce((n, d) => Math.max(n, d.diff), 0);
  const required = sampleSize(scriptCount);
  const enough = sampled.length >= required;
  const failed = sampled.length > 0 && (worst > SAMPLE_HARD_LIMIT || (enough && within / sampled.length < 0.9));
  const passed = enough && !failed;
  // Evenly spaced across the AI totals, so low, middle and high scripts are all checked.
  const sorted = [...pending].sort((a, b) => a.aiTotal - b.aiTotal || a.candidateCode.localeCompare(b.candidateCode));
  const need = passed || failed ? 0 : Math.min(sorted.length, required - sampled.length);
  const suggested = [...new Set(Array.from({ length: need }, (_, i) => sorted[need === 1 ? Math.floor(sorted.length / 2) : Math.round((i * (sorted.length - 1)) / (need - 1))].candidateCode))];
  return {
    paperId, scripts: scriptCount, required, reviewed: sampled.length, withinTolerance: within, worst,
    passed, failed,
    outliers: differences.filter(d => d.diff > SAMPLE_TOLERANCE).map(d => d.code),
    suggested,
  };
}

export type TieredFlag = PolicyFlag & { tier: "check" | "info" };

/**
 * Quality flags plus watched-question flags, each labelled check or info.
 * Questions the teacher has already checked (in "Check by question") become info.
 */
export function tieredFlags(paperId: string, marks: FlagMark[], questions: FlagQuestion[], alignmentWarnings: string[], watch: WatchEntry[], checked: string[] = []): TieredFlag[] {
  const flags = [...qualityFlags(marks, questions, alignmentWarnings), ...watchFlags(paperId, marks, watch)];
  return flags.map(flag => ({ ...flag, tier: checked.includes(flag.questionId) ? "info" : flag.code === "WATCH_QUESTION" ? "check" : flagTier(flag, questions.find(q => q.id === flag.questionId)?.maxMarks) }));
}

/**
 * Marks still match the AI's proposal, except on questions the teacher checked and
 * changed with a recorded reason. Anything else changed needs individual approval.
 */
export function onlyCheckedChanges(marks: { questionId: string; awardedMarks: number; teacherJustification?: string }[], originals: unknown, checked: string[] = []): boolean {
  if (!Array.isArray(originals) || !marks.length || originals.length !== marks.length) return false;
  return marks.every(m => {
    const original = (originals as { questionId: string; awardedMarks: number }[]).find(o => o.questionId === m.questionId);
    if (!original) return false;
    return original.awardedMarks === m.awardedMarks || (checked.includes(m.questionId) && Boolean(m.teacherJustification?.trim()));
  });
}
