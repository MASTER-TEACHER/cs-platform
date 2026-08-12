# Intervention and Adaptive Assignment Engine

Copy all folders into the project root.

## Routes

- `/teacher/interventions`
- `/teacher/interventions/[interventionId]`
- `/revision-plan`

## Firestore

Merge `firestore-interventions-rules.txt` into your existing Firestore rules and publish.
Firestore may request composite indexes for:

- interventions: teacherId + createdAt desc
- interventions: studentId + createdAt desc

## Workflow test

1. Teacher opens Interventions.
2. Create a complete pathway for a student.
3. Student opens Revision Plan in a separate browser/incognito session.
4. Complete lesson/review steps and any linked quiz/exam assignments.
5. Teacher opens the intervention and clicks Refresh Impact.

## Important

For automatic quiz/exam step tracking, enter the existing assignment document ID in the creation modal.
Without an assignment ID, the step links to the general quiz or assignments page and is not automatically verified.
