import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const flags = read("../lib/marking/reviewFlags.ts");
const review = read("../app/api/marking-centre/exams/[examId]/scripts/review/route.ts");
const marking = read("../lib/marking/proposeMarks.ts");
const results = read("../app/api/marking-centre/exams/[examId]/results/route.ts");
const context = read("../lib/marking/reviewContext.ts");
const queue = read("../app/api/marking-centre/exams/[examId]/scripts/queue/route.ts");

// These structural checks are NOT a replacement for authenticated API/emulator tests.
const checks = [
  [flags, /export function isExplicitNonAnswer/, "explicit non-answer detection"],
  [flags, /export function unsupportedWorkingClaim/, "unsupported working detector"],
  [flags, /ARITHMETIC_CONFLICT/, "arithmetic contradiction warnings"],
  [marking, /safeMark = explicitNonAnswer \? 0/, "zero credit for explicit non-answer"],
  [marking, /Never invent evidence or infer missing working/, "evidence-grounding prompt"],
  [review, /if \(unsupportedMethod\) throw new Error\("CENTRE_EVIDENCE"\)/, "approval rejects unsupported method claims"],
  [review, /originalProposalMarks/, "original proposed marks retained"],
  [review, /current\.revision !== body\.expectedRevision/, "optimistic revision guard"],
  [review, /stored\.answerText !== mark\.answerText/, "immutable extracted answer"],
  [review, /tx\.set\(ctx\.reviewRef\.collection\("audit"\)\.doc\(\)/, "revision audit entries"],
  [context, /exam\.data\(\)\?\.ownerId !== actor\.uid/, "review owner isolation"],
  [context, /script\.data\(\)\?\.path !== expectedPath/, "script storage path binding"],
  [queue, /exam\.data\(\)\?\.ownerId !== actor\.uid/, "queue owner isolation"],
  [results, /status === "approved"/, "approved-only results"],
];
for (const [source, pattern, name] of checks) {
  assert.match(source, pattern, `Missing structural safeguard: ${name}`);
  console.log(`PASS ${name}`);
}
console.log(`Marking Centre structural checks passed (${checks.length}).`);
