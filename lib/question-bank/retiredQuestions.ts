/**
 * Older catalogue questions that repeat another question in the bank.
 * They are hidden from teachers and students; the better-worded
 * duplicate is kept. Saved papers that already contain them are unaffected.
 */
export const RETIRED_QUESTION_KEYS = new Set<string>([
  "catalogue-v1-0003", // switch on a LAN (repeat of catalogue-expanded-0004)
  "catalogue-v1-0026", // De Morgan NOT(A AND B) (repeat of catalogue-batch4-0060)
  "catalogue-v2-0004", // phishing compromise (repeat of catalogue-expanded-0005)
  "catalogue-v2-0019", // A AND (A OR B) (repeat of catalogue-batch4-0059)
  "catalogue-large-0066", // adjacency list for sparse graphs (repeat of catalogue-batch4-0087)
  "catalogue-batch4-0061", // DNS failure (repeat of catalogue-expanded-0012)
]);

export function isRetiredQuestion(key: string | undefined): boolean {
  return Boolean(key && RETIRED_QUESTION_KEYS.has(key));
}
