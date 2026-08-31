CS MASTER - STUDENT FINAL QA / CURRICULUM ISOLATION
====================================================

This batch closes the QA issues found after changing the test learner
from AQA A-level to OCR GCSE.

FILES REPLACED
--------------
app/dashboard/page.tsx
components/dashboard/DashboardActivity.tsx
components/dashboard/DashboardStats.tsx
components/dashboard/LatestQuizCard.tsx
components/dashboard/QuickActions.tsx
components/dashboard/RecentActivity.tsx
hooks/useRecentQuiz.ts
services/adaptiveLearningService.ts

FIXES
-----
- Latest Quiz is scoped to the active curriculum.
- Adaptive Learning filters historical evidence to the active curriculum.
- Historical lesson IDs from another curriculum no longer influence the
  current adaptive plan.
- Hard-coded Practice Binary is removed.
- Quick Actions now use real links.
- Hard-coded Recent Activity demo text is removed.
- Dashboard lesson count is explicitly labelled Current Curriculum Lessons.
- Historical evidence remains stored; nothing is deleted.

INSTALL
-------
Extract into:
C:\Users\cr7ri\cs-platform-clean

Replace destination files.

TEST
----
npx tsc --noEmit

Then:
npm run build

SMOKE TEST
----------
With OCR GCSE selected:
- Latest Quiz must not show A-level Advanced Programming.
- Adaptive Learning must not show A-level-only Advanced Programming as
  an OCR GCSE current topic/recommendation.
- Quick Actions must work.
- No old hard-coded activity strings.
- Learn, Assignments, Quiz, Python practice and Exam Mode still open.

Then switch back to AQA A-level:
- A-level dashboard/adaptive context may appear again.

No Firestore rule changes or confidential files are included.
