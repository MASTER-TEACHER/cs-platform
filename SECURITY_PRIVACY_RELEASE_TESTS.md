# CS Master v1.1 Security / Privacy / GDPR Targeted Release Tests

Run these after `npm run verify`. Do not repeat the already-passed full assignment suite unless a targeted test reveals a regression.

## Public pages

- `/privacy` loads signed out.
- `/security` loads signed out.
- `/cookies` loads signed out.
- Privacy page links to `/data-rights`.

## Authentication / role tests

- Signed-out `/data-rights` is not usable as an anonymous privacy submission path.
- Student can open `/data-rights` and submit one test request.
- Teacher can open `/data-rights` and submit one test request.
- Student/teacher cannot open the admin privacy queue.
- Admin can open `/admin/privacy-requests`.

## Privacy request workflow

- Submit one non-sensitive test request.
- Admin loads it.
- Admin changes status to `identity_check`, then `in_progress`, then `completed`.
- Admin note persists after reload.
- No privacy request collection can be browsed directly from ordinary client Firestore access.

## Security regression

- Admin dashboard still opens.
- Teacher dashboard and School page still open.
- Student dashboard still opens.
- Feedback submission/admin feedback still works.
- School join route still works for authorised invite flow.
- Stripe webhook endpoint still rejects unsigned/non-Stripe requests.
- AI Tutor/teacher AI route still works for an authorised test account.
- Existing school/class/assignment tenancy protections remain intact.

## Response headers

Using browser Network/DevTools on production, confirm representative HTML responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`

Representative API response should include `Cache-Control: private, no-store, max-age=0`.

## Release exit

- `npm run verify` passes.
- Firestore rules deploy succeeds to the correct Firebase project.
- Targeted tests above pass.
- No new CS Master console/network application errors.
- Clean `git status` contains only intended release files before commit.
