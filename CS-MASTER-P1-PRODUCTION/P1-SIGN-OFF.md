# P1 FINAL SIGN-OFF

## Automated gate
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Firestore rules and index config detected
- [ ] Secret-safety checks pass
- [ ] `/api/health` exists

## Production configuration
- [ ] Firebase client variables configured in hosting environment
- [ ] `OPENAI_API_KEY` configured server-side
- [ ] Firebase Admin credentials configured server-side
- [ ] `AI_STUDENT_TUTOR_DEMO_MODE=false`
- [ ] `AI_MARKING_DEMO_MODE=false`
- [ ] No real secret values committed to Git

## Smoke tests
- [ ] Student can sign in and reaches student dashboard
- [ ] Teacher can sign in and reaches teacher dashboard
- [ ] Admin can sign in and reaches admin area
- [ ] Suspended teacher is blocked as designed
- [ ] Teacher cannot access another school's protected data
- [ ] Student cannot access teacher/admin data
- [ ] Lesson/course progress loads
- [ ] Quiz assignment and submission work
- [ ] Exam assignment/submission and integrity monitoring work
- [ ] Teacher markbook/results load
- [ ] AI Tutor live request works, or gives controlled unavailable response
- [ ] AI marking live request works, or gives controlled unavailable response
- [ ] `/api/health` returns `ready` after all production credentials are configured
- [ ] Firestore rules deploy successfully
- [ ] Firestore indexes deploy successfully
- [ ] Production deployment starts without server credential/build-time failure

## Sign-off rule
P1 is successful only when the automated gate passes and all applicable smoke tests above pass.
