CS MASTER — AI QUIZ VISIBILITY REPAIR

Replace:
  services/quizAssignmentService.ts

Purpose:
- Keeps targeted quiz assignments visible when optional class/result metadata reads fail.
- Prevents one stale legacy quiz result/class reference from hiding every quiz.
- Applies equally to built-in and AI-generated quiz assignments.
- Does not modify Firestore rules.
- Does not modify assignment creation.

After extraction run:
  npm run verify
  npm run dev

Then refresh the student My Assignments page.
