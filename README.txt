CS Master — Quiz Review + Assignment XP Fix

Replace these 4 files:
1. app/api/quiz/secure/route.ts
2. app/assignments/page.tsx
3. app/quiz/page.tsx
4. services/secureQuizClientService.ts

Fixes:
- Completed quiz assignments now open a read-only saved review instead of creating a new attempt.
- Existing completed assignments can fall back to the saved quizAttempts review when assignmentResults predates review snapshots.
- New assignment results persist the server-marked review snapshot.
- Assignment XP is gated by the assignment result itself, not by an unrelated prior independent quiz result.
- Repeated POSTs/reviews of the same assignment still cannot farm XP.

IMPORTANT TEST NOTE:
- The already-completed assignment that currently shows XP 0 will remain 0 because that result was already persisted before this fix.
- Use that existing completed assignment to test Review Quiz.
- Create ONE fresh quiz assignment to test XP awarding after the four files pass lint/tsc/build.
