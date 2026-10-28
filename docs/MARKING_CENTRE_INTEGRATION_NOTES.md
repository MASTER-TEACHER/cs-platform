# Marking Centre integration — release safety notes

This package includes a navigation entry in the CS Master teacher sidebar and clearer workflow labels. The existing subject-agnostic Marking Centre, teacher-only API ownership checks, QLA, approved-only results and reports remain intact.

## Not yet implemented (do not claim completed)

1. **Student grade and feedback distribution** requires an authenticated, school-scoped candidate-code-to-student-UID association with explicit teacher confirmation. The current Marking Centre stores pseudonymous EX-... codes; its results cannot be safely delivered to a particular student without verified mapping. Do not match on filenames, names, or email strings.
2. **Teacher analytics integration** needs a server-side publish operation that writes only approved results to the existing CS Master analytics model, supports idempotent revisions, preserves original source exam/paper IDs, and handles revocation/corrections. No student-visible write was added here.
3. **Mark-all managed queue and risk-based sample review** are not implemented by this navigation update. The current 'Generate next 5 AI proposals' process remains. Batch approval continues to require teacher authorisation; flags still require individual review.
4. **Standalone other-subject teacher onboarding** needs account-type-specific routing/navigation and authorisation verification. Existing teacher API is subject-agnostic, but registration and dashboard isolation have not been regression tested.
5. **QLA topic dropdown** and independent second-pass marking verification are not implemented by this navigation update.

## Required release tests

- Computer Science teacher: sidebar access, existing exams, approved-only report exports, cross-school isolation.
- Other subject teacher: marking-only navigation and no Computer Science curriculum/student tools.
- Student: cannot access teacher APIs; can view only results explicitly published to their verified UID.
- Publishing: no accidental disclosure, no publication of unapproved or flagged results, no stale mark overwrites, audit of corrections.
- Batch: 100+ candidate resumability, retries, QA sample selection, audit and approved-only exports.
