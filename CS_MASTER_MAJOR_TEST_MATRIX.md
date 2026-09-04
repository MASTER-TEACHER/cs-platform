# CS Master — Major Post-Hardening Test Matrix

Run this after extracting the hardening ZIP and passing the command-line verification.

## Command-line gate

From `C:\Users\cr7ri\cs-platform-clean`:

```powershell
npm run verify
```

If `npm run verify` stops at a step, run the failing command separately and record the exact error.

## A. Assignment Wizard — all resource types

Use one teacher test account and one known student test account.

### A1. Existing Lesson

- Assign one exact lesson to one individual student.
- Student sees only that assignment.
- Start opens the exact assigned lesson even if the student's normal curriculum differs.
- Complete the lesson.
- Assignment becomes Completed automatically.
- Teacher completion count updates.
- Review reopens the lesson without awarding duplicate completion/XP.

### A2. Existing Quiz

- Assign one built-in quiz to one student.
- Test Practice mode.
- Complete it and confirm score, percentage and XP.
- Review Quiz opens read-only review and creates no new attempt.
- Teacher markbook matches the student result.
- Close the assignment and confirm a completed student can still review it.
- Create a second fresh quiz assignment, close it before the student starts, and confirm it cannot start a new attempt.

### A3. AI Quiz

- Create/save an AI quiz as the teacher.
- Assign it through Assignment Wizard to one student.
- Confirm Step 4 shows the saved quiz metadata and delivery mode.
- Student opens the exact AI quiz through the protected quiz player.
- Complete it and confirm score/XP persistence.
- Review opens read-only mode and does not restart the timer or attempt.
- Confirm another student who was not selected cannot open the assignment by URL.

### A4. Exam Paper

- Assign one saved Question Bank paper to one student.
- Confirm title/topic/question count/marks on Step 4.
- Student enters Exam Mode and answers autosave.
- Test full-screen exit countdown and return before five seconds.
- Test a separate disposable attempt where the five-second countdown expires and auto-submission occurs.
- Submit normally on another attempt.
- Teacher sees Awaiting Marking.
- Teacher marks/finalises and student sees final result.

### A5. Teaching Resource

- Assign one published teaching resource to one student.
- Student opens the exact resource.
- Draft/archived resources must not be available to students.
- Student marks the assignment complete only after finishing the resource.
- Teacher completion count updates once only.
- Reopening the completed resource must not increment completion again.

### A6. Programming Challenge

- Assign one exact challenge to one student.
- Student opens the exact challenge.
- Submit a failing attempt; assignment remains In progress.
- Submit a passing attempt; assignment becomes Completed.
- Teacher programming results show attempts and percentage.
- Try another submission after completion; it must be rejected rather than adding another attempt.

## B. Recipient and tenancy regression

- Whole-class assignment reaches every currently enrolled student.
- Individual mode reaches only selected students.
- A student in the same class but not selected cannot open an individually targeted quiz.
- A teacher cannot assign into another teacher's class.
- Remove a student from a class before pressing final Assign; the assignment should reject stale recipients rather than silently targeting them.

## C. Student regression

- Login / logout.
- Forgot-password page opens.
- Dashboard loads XP, curriculum, badges and recommendations.
- Learn page respects selected qualification/exam board during normal browsing.
- Assigned lesson override still opens the teacher-assigned lesson.
- Quiz Centre normal browsing still respects the student's curriculum.
- Assignments page filters and counts remain correct.
- Adaptive Learning, Knowledge Map, Analytics, Revision Plan and Programming routes open without application errors.

## D. Teacher regression

- Teacher login and dashboard.
- Classes and student membership.
- Assignment Centre totals.
- Quiz markbook.
- Written Exam markbook.
- Programming assignment results.
- Analytics / individual student analytics.
- Interventions and intervention reassessment entry into Assignment Wizard.
- Content Hub / Resource Library.
- Reports.
- Pricing page from View school plans.

## E. Production/navigation regression

Run a production server:

```powershell
npm run build
npm start
```

Check:

- `/`
- `/login`
- `/forgot-password`
- `/pricing`
- `/dashboard`
- `/assignments`
- `/quiz`
- `/teacher`
- `/teacher/assignments`
- `/teacher/assignment-wizard`

Ignore only the already-isolated Chrome DevTools `VM... reportAllChanges / startTime` instrumentation error. Record any application error that points to CS Master source, `_next` application chunks, Firebase permissions, a missing route, or a failed network request.

## F. Firestore rules regression

After deploying the new rules to the correct Firebase project:

- Teacher can still create/read/update own assignments.
- Student can start/complete own resource assignment.
- Student cannot create progress for an assignment they did not receive.
- Teacher can read own generated AI quizzes.
- Student cannot directly read a generated quiz document from Firestore, while the protected assigned AI quiz still works through `/api/quiz/secure`.
- Exam assignment creation and student submission still work.

## Exit criteria

Hardening can be closed when:

- `npm run verify` passes.
- All six Assignment Wizard resource types pass end-to-end.
- No new permissions regressions are introduced after Firestore rules deployment.
- No genuine CS Master console/network errors remain in the production smoke test.
- Teacher/student results and completion counts agree across both sides.
