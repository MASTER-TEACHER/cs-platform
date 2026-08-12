# Adaptive Learning Engine

## New route

`/adaptive-learning`

## New intelligence

The engine combines:

- independent quiz results
- assigned quiz results
- marked written exams
- completed lessons
- intervention progress

It calculates:

- topic mastery
- confidence
- priority score
- recent trend
- forgetting risk
- recommended difficulty
- next review date
- next learning action
- exam readiness
- predicted grade

## Installation

Copy the folders into the project root.

Allow replacement of:

- `app/dashboard/page.tsx`
- `components/layout/Sidebar.tsx`

All other files are new.

## Firestore

No rules update is required for this read-only version.

## Build

```powershell
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
npm run build
```

## Test

1. Sign in as a student with quiz and written-exam evidence.
2. Open Dashboard and confirm the adaptive card appears.
3. Open Adaptive Learning.
4. Confirm the weakest topic has the highest priority.
5. Confirm a recommended difficulty is displayed.
6. Confirm secure topics receive a longer review interval.
7. Confirm the next-action button opens lesson, quiz or exam practice.
