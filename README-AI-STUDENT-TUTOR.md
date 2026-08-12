# AI Student Tutor

## Add to `.env.local`

AI_STUDENT_TUTOR_DEMO_MODE=true

This forces demo mode and uses no API quota.

For live testing:

AI_STUDENT_TUTOR_DEMO_MODE=false
OPENAI_STUDENT_TUTOR_MODEL=gpt-4.1-mini

The route uses the existing OPENAI_API_KEY. If live AI fails or quota is unavailable, it automatically falls back to demo mode.

## Firestore

Merge `firestore-student-tutor-rules.txt` into your existing rules and publish.

## Test

1. Student login.
2. Open **AI Tutor**.
3. Ask: `Create a revision plan for my weakest topic.`
4. Confirm the response uses the student's analytics.
5. Clear the conversation.
