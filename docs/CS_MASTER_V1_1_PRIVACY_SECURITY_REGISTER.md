# CS Master v1.1 — Privacy & Security Register

This is an operational engineering register, not legal advice or a completed DPIA/DPA.

## Data categories currently visible in the application
- Account identity and role
- School and class membership
- Qualification and exam-board settings
- Learning progress, quiz/exam/programming activity
- Assignments, submissions, teacher feedback and analytics
- Exam integrity incidents
- Subscription/licensing state
- User-submitted feedback reports

## v1.1 controls
- Authenticated role-based access
- School-scoped Firestore rules
- Server-only Firebase Admin credentials
- Server-side admin authorization for feedback review
- Feedback collection denies direct client Firestore access
- Security response headers and no-store API caching
- Class archive preserves educational history
- Permanent class deletion is restricted to empty classes
- Privacy page explains AI use, retention, security and rights
- Feedback form warns users not to submit secrets/payment data

## Before wider school procurement
1. Complete and sign off a formal DPIA with the deploying school/controller context.
2. Finalise controller/processor roles and a school Data Processing Agreement.
3. Publish controller identity/contact details and a complete privacy notice.
4. Record lawful bases, processors/sub-processors and international transfer arrangements.
5. Set documented retention periods by record type and implement scheduled deletion where appropriate.
6. Document DSAR, rectification, erasure, restriction and objection workflows.
7. Complete an incident/breach response procedure and ICO notification decision process.
8. Maintain a processor list for Firebase/Google Cloud, Vercel, OpenAI, Stripe and Resend as actually configured.
9. Run automated Firestore rules tests and API authorization tests in CI.
10. Evaluate Firebase App Check and rate limiting for production abuse resistance.
11. Define backup/restore and disaster-recovery expectations.
12. Commission independent security testing before high-scale deployment.
