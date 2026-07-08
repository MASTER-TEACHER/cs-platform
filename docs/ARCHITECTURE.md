# CS Master Architecture

## Overview

CS Master is a GCSE Computer Science learning platform built with:

- Next.js
- TypeScript
- Firebase Authentication
- Firestore
- Tailwind CSS
- Vercel

The platform supports student authentication, personalised dashboards, interactive lessons, simulators, XP, badges and progress tracking.

---

## User Flow

```text
Landing Page
    ↓
Register / Login
    ↓
Onboarding
    ↓
Dashboard
    ↓
Lessons
    ↓
Practice Questions
    ↓
Simulators
    ↓
Lesson Completion
    ↓
XP + Badges
    ↓
Firestore Progress Update
```

---

## Main Routes

```text
/                 Public landing page
/login            Login page
/register         Registration page
/onboarding       Course selection
/dashboard        Student dashboard
/profile          Student profile
/learn            Learning area
/learn/[topicId]  Dynamic lesson page
/quiz             Quiz area
/teacher          Teacher portal placeholder
```

---

## Key Folders

```text
app/          Next.js routes
components/   Reusable UI and feature components
contexts/     Auth and progress context
data/         Curriculum and achievement data
hooks/        Reusable React hooks
lib/          Engines and Firebase setup
services/     Firebase service functions
types/        TypeScript interfaces
public/       Logo and static assets
docs/         Project documentation
```

---

## Core Engines

### Lesson Engine

The lesson engine loads topic and lesson data from:

```text
data/curriculum/topics/
```

Each topic contains:

- title
- description
- difficulty
- estimated time
- lessons
- simulator type

Each lesson contains:

- objectives
- explanation
- worked example
- practice questions
- exam question
- XP reward

---

### Progress Engine

The progress system tracks:

- completed lessons
- XP
- badges
- course progress

Progress is saved in Firestore under the user document.

---

### Achievement Engine

The achievement engine checks whether the student has unlocked badges based on:

- XP totals
- completed lessons
- specific lesson completion

---

### Mission Engine

The mission engine finds the next incomplete lesson and presents it as the student’s daily mission.

---

## Firebase Data Flow

```text
Student completes lesson
    ↓
completeLesson()
    ↓
Firestore user document updated
    ↓
XP incremented
    ↓
Completed lesson saved
    ↓
Achievements checked
    ↓
Dashboard reflects updated progress
```

---

## Authentication

Firebase Authentication handles:

- registration
- login
- logout
- current user state

The app uses `AuthContext` to provide the authenticated user across the platform.

---

## Deployment

CS Master is deployed through:

```text
GitHub
   ↓
Vercel
   ↓
Production Website
```

Every push to the main branch triggers a new deployment.

---

## Future Architecture

Planned future systems include:

- Quiz Engine
- Leaderboard Engine
- Certificate Generator
- Teacher Analytics
- AI Tutor
- Adaptive Learning Recommendations

---

## Version

CS Master v1.0 Public Beta