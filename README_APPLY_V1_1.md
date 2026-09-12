# CS Master v1.1 batch

## Included
- Authenticated Feedback / Report a Problem form.
- Admin Feedback & Issues dashboard with status, priority and internal notes.
- Student assignment notification centre generated from live unified assignments.
- Stronger public privacy transparency covering retention, security and rights.
- Privacy/security/DPIA/retention/incident-response working documents.
- Manage Classes quick Archive / Restore / Delete controls.
- Permanent class deletion remains deliberately restricted to empty classes. The class document is deleted from Firestore; classes with pupils or assignment history must be archived so educational history is not accidentally destroyed.
- Firestore explicitly denies direct client access to feedbackReports; feedback uses authenticated server routes.
- Targeted v1.1 acceptance checks appended to the existing test matrix.

## Apply from project root (PowerShell)
Expand-Archive -Path .\CS-MASTER-V1-1-UPDATE.zip -DestinationPath .\CS-MASTER-V1-1-UPDATE -Force
Copy-Item -Path .\CS-MASTER-V1-1-UPDATE\* -Destination . -Recurse -Force

## Then verify
npm run verify

## Firestore rules
Because firestore.rules changed, deploy the rules after verify succeeds using your existing Firebase CLI project configuration:
firebase deploy --only firestore:rules

## Targeted runtime acceptance only
1. Submit one Feedback report as a student or teacher.
2. Open Admin > Feedback & Issues and change its status/priority.
3. Open student Notifications and confirm outstanding assignments appear.
4. In Teacher > Classes archive/restore one test class; create/delete one empty test class.
5. Open /privacy and confirm the new sections render.

Do not repeat the full v1.0 assignment/exam/quiz regression suite unless npm run verify or one of these targeted checks exposes a regression.
