# CS Master Release Hardening

This batch adds the final application-level release baseline without changing
curriculum, assessment algorithms, billing logic, Firebase credentials or exam
integrity rules.

## Added
- Global route error boundary
- Global fatal error boundary
- Root loading state
- Public About, Help, Contact, Privacy, Terms and Cookies pages
- Essential-storage cookie notice
- Security response headers
- Deployment-configurable metadata URL
- Deployment-configurable public support email

## Production environment checklist
Set these in the production deployment:
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_SUPPORT_EMAIL
- Existing Firebase public configuration
- Existing Firebase Admin/server credentials
- Existing Stripe variables if billing is enabled
- Existing Resend/email variables if teacher verification email is enabled
- OPENAI_API_KEY and model variables if live AI is enabled

Do not commit .env files or service-account private keys.

## Required validation
Run:
1. npx tsc --noEmit
2. npm run build
3. npm run lint

Then test:
- signed-out public routes
- student login/onboarding/dashboard
- teacher login/dashboard/class workflows
- admin login/teacher administration
- suspended/unauthorised account behaviour
- Exam Mode start/fullscreen exit/5-second termination/submission
- AI Tutor integrity boundaries
- Adaptive Learning empty/loading/populated states
- billing redirects if billing is enabled
- mobile navigation and keyboard focus
- 404, route error and public legal/help pages

## Before commercial launch
Have the Privacy, Terms and Cookies text reviewed against the actual organisation,
contracts, data flows, retention periods, subprocessors and legal obligations.
The pages supplied here are a technically integrated baseline, not legal advice.