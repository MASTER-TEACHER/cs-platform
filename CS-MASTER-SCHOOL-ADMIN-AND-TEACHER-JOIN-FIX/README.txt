CS MASTER — SCHOOL ADMIN DELETE + APPROVED TEACHER JOIN FIX
==========================================================

WHAT THIS UPDATE DOES
---------------------
1. Admin > School Management
   - Adds Archive school.
   - Adds Restore school.
   - Adds Permanent delete for safe/test schools.
   - Permanent delete detaches linked users instead of deleting their CS Master accounts.
   - Permanent delete is blocked when the school still has classes.
   - Permanent delete is blocked for complimentary-access schools.
   - Permanent delete is blocked when Stripe customer/subscription history is attached.
   - School member subcollections, school invites, non-Stripe school trial records and non-Stripe subscription records are cleaned safely.
   - Admin actions are written to adminAuditLogs.

2. Approved teacher -> existing school
   - Teacher > School now clearly offers TWO choices when the teacher has no school:
       A. Join an existing school
       B. Create a new school organisation
   - Join existing school routes to /join-school.
   - The existing school Invitations tab already generates single-use Teacher Join Codes.
   - /join-school now explains that approved teachers must use a Teacher Join Code.

3. Archived school protection
   - /api/schools/join now verifies that the school exists and is active.
   - An archived/suspended school cannot accept a student or teacher using an old invite code.
   - Archiving a school also revokes its currently active join codes.

FILES
-----
REPLACE:
- app/admin/schools/page.tsx
- app/api/schools/join/route.ts
- app/join-school/page.tsx
- app/teacher/school/page.tsx

NEW:
- app/api/admin/schools/[schoolId]/route.ts

NO FIRESTORE RULES CHANGE IS REQUIRED FOR THIS UPDATE.
The destructive admin operation is server-side and requires requirePlatformAdmin().

HOW TO APPLY
------------
From PowerShell, after extracting this ZIP:

& ".\APPLY-CS-MASTER-SCHOOL-ADMIN-FIX.ps1" -ProjectRoot "C:\Users\cr7ri\cs-platform-clean"

Then:

cd C:\Users\cr7ri\cs-platform-clean
npm run verify

TARGETED TESTS ONLY
-------------------
Do not repeat the full v1 assignment/exam regression suite.

A. Admin deletion
   1. Sign in as CS Master platform admin.
   2. Open /admin/schools.
   3. Use a disposable school with zero classes.
   4. Click Permanently delete.
   5. Type the exact school name.
   6. Confirm it disappears from School Management.
   7. Confirm any linked test user can still sign in as an individual account.

IMPORTANT:
Do NOT use the permanent CS Master QA School for the delete test.
Its complimentary access deliberately protects it from permanent deletion.

B. Approved teacher joins an existing school
   1. Use an approved teacher account with no schoolId.
   2. Open Teacher > School.
   3. Click Enter teacher join code.
   4. From an existing school's Teacher > School > Invitations tab, generate a Teacher Join Code.
   5. Enter that code on /join-school.
   6. The approved teacher should be added to the school and redirected to /teacher/school.
   7. The teacher should appear in the school's Staff directory.

C. Archive protection
   1. Generate a disposable invite for a test school.
   2. Archive that school from /admin/schools.
   3. The old invite should no longer work.
   4. Restore the school and generate a new invite if needed.

EXPECTED TEACHER PROCESS
------------------------
Teacher signs up -> teacher verification -> CS Master approval -> teacher has no school
-> Teacher > School -> Join existing school -> enter Teacher Join Code
-> school membership created -> teacher appears in Staff directory.

School-side process:
School teacher/admin -> Teacher > School -> Invitations -> Generate teacher code
-> share code with the already-approved teacher.
