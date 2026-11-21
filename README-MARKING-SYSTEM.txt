CS MASTER MARKING CENTRE - COMPLETE UPDATE (21 Nov 2026, evening)
Contains every change from today. Safe to extract over all earlier updates.

WHAT IS IN IT
- Handwriting reading (Claude vision), page-break handling, saved transcriptions
- Mark schemes read as page images for any subject; structure keeps all Guidance
- Rigorous marking: examiner + moderator (moderator only where needed), quote and term
  checks, printed-code rule, description rule, robust reply reading
- Lower cost: effort settings (VISION_EFFORT, MARKING_EFFORT, MARKING_MODERATOR_EFFORT)
- Meaningful flags with reasons shown in the review queue; free "Re-check flags" button
- Bulk approval of unflagged scripts, and of flagged scripts once you confirm you reviewed
  the flags ("Include flagged scripts"); accepted flags are recorded in the audit log
- AI accuracy report; provisional results on the results page
- Candidate codes: existing codes skipped, staged scripts re-matched automatically
- Delete any examination (type its title to confirm)

.env.local
  OPENAI_API_KEY=...            ANTHROPIC_API_KEY=...
  MARKING_CENTRE_VISION_MODEL=claude-sonnet-5-5
  MARKING_CENTRE_STRUCTURE_MODEL=claude-sonnet-5-5
  MARKING_CENTRE_MARKING_MODEL=claude-sonnet-5-5
  MARKING_CENTRE_ALIGNMENT_MODEL=gpt-4.1
  MARKING_MODERATION=auto       MARKING_EFFORT=low   MARKING_MODERATOR_EFFORT=medium
  VISION_EFFORT=low

INSTALL (PowerShell, project folder)
  tar -xf "$HOME\Downloads\csmaster-complete-evening.zip"
  npm run typecheck
  npm run dev

COMMIT (only these files; .env* stays ignored)
  git add -- "lib/marking/visionPdf.ts" "lib/marking/transcriptCache.ts" "lib/marking/reviewContext.ts" "lib/marking/alignAnswers.ts" "lib/marking/proposeMarks.ts" "lib/marking/autoStructure.ts" "lib/marking/reviewFlags.ts" "app/api/marking-centre/exams/[examId]/route.ts" "app/api/marking-centre/exams/[examId]/accuracy/route.ts" "app/api/marking-centre/exams/[examId]/candidates/route.ts" "app/api/marking-centre/exams/[examId]/results/route.ts" "app/api/marking-centre/exams/[examId]/scripts/extract/route.ts" "app/api/marking-centre/exams/[examId]/scripts/align/route.ts" "app/api/marking-centre/exams/[examId]/scripts/review/route.ts" "app/api/marking-centre/exams/[examId]/scripts/bulk-approve/route.ts" "app/api/marking-centre/exams/[examId]/scripts/queue/route.ts" "app/api/marking-centre/exams/[examId]/scripts/reflag/route.ts" "app/api/marking-centre/exams/[examId]/papers/[paperId]/structure/route.ts" "components/marking-centre/CandidateScriptManager.tsx" "components/marking-centre/PaperStructureManager.tsx" "components/marking-centre/MarkingCentreWorkspace.tsx" "package.json" "next.config.js" "scripts/check-vision-render.mjs" "services/marking-vision-worker/server.mjs" package-lock.json README-MARKING-SYSTEM.txt
