import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = process.cwd();
const read = p => readFileSync(resolve(root, p), 'utf8');
const bulk = read('app/api/marking-centre/exams/[examId]/scripts/bulk-approve/route.ts');
const queue = read('app/api/marking-centre/exams/[examId]/scripts/queue/route.ts');
const topics = read('app/api/marking-centre/exams/[examId]/qla-topics/route.ts');
const reports = read('app/api/marking-centre/exams/[examId]/reports/route.ts');
const ui = read('components/marking-centre/CandidateScriptManager.tsx');
const review = read('app/api/marking-centre/exams/[examId]/scripts/review/route.ts');
const checks = {
  'bulk teacher identity': /requireAuthenticatedUser/.test(bulk) && /requireCentreTeacher/.test(bulk),
  'bulk exam ownership': /ownerId !== actor.uid/.test(bulk),
  'bulk original PDF source verification': /loadReviewContext/.test(bulk) && /scriptHash !== ctx.scriptHash/.test(bulk),
  'bulk current question structure': /structureHash !== ctx.structureHash/.test(bulk),
  'bulk optimistic revision': /data.revision !== selection.expectedRevision/.test(bulk),
  'bulk blocks quality flags': /qualityFlags\(/.test(bulk),
  'bulk preserves original proposal marks': /originalProposalMarks/.test(bulk),
  'bulk audit and teacher note': /collection\("audit"\)/.test(bulk) && /moderationNote/.test(bulk),
  'bulk explicit teacher confirmation': /body.confirmed !== true/.test(bulk) && /window.confirm/.test(ui),
  'bulk bounded batch': /selections.length > 20/.test(bulk),
  'queue conservative eligibility': /bulkEligible/.test(queue),
  'teacher topic mapping and revision': /qlaTopicMappings/.test(topics) && /qlaTopicRevision/.test(topics),
  'subject QLA export': /format === "qla-xlsx"/.test(reports),
  'per-paper and combined QLA': /Combined Overview/.test(reports) && / QLA/.test(reports),
  'grade and next grade': /Marks to next grade/.test(reports) && /Grade Boundaries/.test(reports),
  'teacher feedback conflict guard': /CENTRE_FEEDBACK_CONFLICT/.test(review),
};
let failed = 0;
for (const [name, ok] of Object.entries(checks)) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${Object.keys(checks).length - failed}/${Object.keys(checks).length} static checks passed`);
if (failed) process.exitCode = 1;
