import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

/*
 * Estimated AI spend per teacher per month, so the Marking Centre can show
 * costs before a batch and stop at a monthly cap.
 *
 * Figures are ESTIMATES from token counts and the price table below (US
 * dollars per million tokens). Your provider's billing page is the source of
 * truth. Override prices with MARKING_PRICES_JSON, e.g.
 *   {"claude-sonnet-5-5":[3,15],"gpt-4.1":[2,8]}
 * Set the cap with MARKING_MONTHLY_BUDGET_USD (default 25; 0 = no cap).
 */
const DEFAULT_PRICES: [RegExp, number, number][] = [
  [/claude.*opus/i, 5, 25],
  [/claude.*haiku/i, 1, 5],
  [/claude/i, 3, 15],
  [/gpt-4\.1-nano/i, 0.1, 0.4],
  [/gpt-4\.1-mini/i, 0.4, 1.6],
  [/gpt-4\.1/i, 2, 8],
  [/gpt-4o-mini/i, 0.15, 0.6],
  [/gpt-4o/i, 2.5, 10],
];
const FALLBACK_PRICE: [number, number] = [3, 15];
export const DEFAULT_COST_PER_SCRIPT_USD = 0.4;

function priceFor(model: string): [number, number] {
  try {
    const custom = JSON.parse(process.env.MARKING_PRICES_JSON || "{}") as Record<string, [number, number]>;
    const match = custom[model];
    if (Array.isArray(match) && match.length === 2 && match.every(n => typeof n === "number" && n >= 0)) return match;
  } catch { /* ignore invalid JSON and use defaults */ }
  const found = DEFAULT_PRICES.find(([pattern]) => pattern.test(model));
  return found ? [found[1], found[2]] : FALLBACK_PRICE;
}

export function monthlyBudgetUsd(): number {
  const raw = process.env.MARKING_MONTHLY_BUDGET_USD?.trim();
  if (raw === undefined || raw === "") return 25;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : 25;
}

const monthKey = () => new Date().toISOString().slice(0, 7); // YYYY-MM (UTC)
const usageDoc = (uid: string) => adminDb.collection("markingCentreUsage").doc(`${uid}_${monthKey()}`);

const scope = new AsyncLocalStorage<{ uid: string }>();

export type UsageSummary = {
  month: string;
  costUsd: number;
  budgetUsd: number;
  scriptsMarked: number;
  calls: number;
  averageCostPerScriptUsd: number;
};

export async function getUsage(uid: string): Promise<UsageSummary> {
  const data = (await usageDoc(uid).get()).data() ?? {};
  const costUsd = Number(data.costUsd) || 0;
  const scriptsMarked = Number(data.scriptsMarked) || 0;
  return {
    month: monthKey(),
    costUsd,
    budgetUsd: monthlyBudgetUsd(),
    scriptsMarked,
    calls: Number(data.calls) || 0,
    averageCostPerScriptUsd: scriptsMarked >= 3 ? costUsd / scriptsMarked : DEFAULT_COST_PER_SCRIPT_USD,
  };
}

/**
 * Call at the start of any route that uses AI. Throws CENTRE_BUDGET when the
 * teacher has reached this month's cap, then records usage for the rest of
 * the request.
 */
export async function beginUsage(uid: string): Promise<void> {
  const budget = monthlyBudgetUsd();
  if (budget > 0) {
    const { costUsd } = await getUsage(uid);
    if (costUsd >= budget) throw new Error("CENTRE_BUDGET");
  }
  scope.enterWith({ uid });
}

/**
 * Cost tracking for a shared pool (e.g. "studentPractice") instead of one teacher.
 * Returns false (and records nothing) when the pool's cap is reached.
 */
export async function beginScopedUsage(poolId: string, budgetUsd: number): Promise<boolean> {
  if (budgetUsd > 0) {
    const costUsd = Number((await usageDoc(poolId).get()).data()?.costUsd) || 0;
    if (costUsd >= budgetUsd) return false;
  }
  scope.enterWith({ uid: poolId });
  return true;
}

type TokenUsage = {
  input_tokens?: number; output_tokens?: number;
  cache_creation_input_tokens?: number; cache_read_input_tokens?: number;
  prompt_tokens?: number; completion_tokens?: number;
} | undefined | null;

/** Record one AI call. Safe to call anywhere; it does nothing outside beginUsage. */
export function recordUsage(model: string, usage: TokenUsage): void {
  const store = scope.getStore();
  if (!store || !usage) return;
  const input = (usage.input_tokens ?? usage.prompt_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0);
  const output = usage.output_tokens ?? usage.completion_tokens ?? 0;
  const [inPrice, outPrice] = priceFor(model);
  const cost = (input * inPrice + output * outPrice) / 1_000_000;
  void usageDoc(store.uid).set({
    uid: store.uid,
    month: monthKey(),
    costUsd: FieldValue.increment(cost),
    inputTokens: FieldValue.increment(input),
    outputTokens: FieldValue.increment(output),
    calls: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true }).catch(error => console.error("[Marking Centre] usage write failed", error));
}

/** Count a fully proposed script, used for the cost-per-script estimate. */
export function noteScriptMarked(uid: string): void {
  void usageDoc(uid).set({ scriptsMarked: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() }, { merge: true })
    .catch(error => console.error("[Marking Centre] usage write failed", error));
}
