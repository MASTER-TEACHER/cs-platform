CS MASTER - QUIZ RANDOMISATION + PERMANENT SCHOOL ACCESS

CHANGED FILE
1. app/api/quiz/secure/route.ts
   - Randomises multiple-choice/true-false option order before a quiz reaches the student.
   - Shuffle is deterministic for the attempt + question, so React rerenders do not move answers around.
   - Correct-answer marking is unchanged because answers are still stored/marked by their text value.
   - Applies to the current secure quiz delivery route used by built-in and AI-generated quizzes.

NEW FILE
2. scripts/grant-complimentary-school-access.mjs
   - Grants one existing school a permanent complimentary School Pro-capacity entitlement.
   - No expiry.
   - No Stripe customer/subscription is fabricated.
   - Refuses to overwrite a Stripe-managed subscription.
   - Other schools continue normal trial / Stripe behaviour.

INSTALL
Copy the app and scripts folders into the project root, preserving paths.

VERIFY
npm run verify

LIST SCHOOLS SAFELY
node .\\scripts\\grant-complimentary-school-access.mjs --list-schools

GRANT THE CHOSEN SCHOOL PERMANENT ACCESS
node .\\scripts\\grant-complimentary-school-access.mjs --school-id YOUR_SCHOOL_ID --confirm GRANT-COMPLIMENTARY-SCHOOL-ACCESS

Then sign into that school's teacher account and confirm the school workspace opens without the trial/subscription gate.

Suggested commit:
git add app/api/quiz/secure/route.ts scripts/grant-complimentary-school-access.mjs
git commit -m "Randomise quiz answers and add complimentary school access"
git push origin main
