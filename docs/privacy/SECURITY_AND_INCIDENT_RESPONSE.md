# CS Master Security & Personal Data Incident Response

## Preventive controls

- Firebase Authentication for user authentication.
- Server-side Firebase Admin verification for privileged API routes.
- Firestore security rules for client-side least privilege.
- School/class/recipient scoping.
- Server-only API credentials and provider secrets.
- HTTPS in production and defensive HTTP headers.
- Stripe webhook signature verification.
- Restricted direct client access to server-managed collections.
- Build/type/lint/hardening verification before release.

## Security incident workflow

1. **Detect and record** — time, reporter, affected feature/account/school, indicators and evidence.
2. **Contain** — revoke keys/tokens, disable route/feature, suspend account or provider integration where proportionate.
3. **Preserve evidence** — avoid unnecessary personal-data copying; preserve relevant logs.
4. **Assess scope** — data subjects, categories, volume, schools, confidentiality/integrity/availability impact.
5. **Eradicate and fix** — patch cause, rotate credentials, correct permissions/data.
6. **Assess personal-data breach risk** — determine controller/processor roles and contractual notification path.
7. **Notify/escalate where required** — processors notify the relevant controller without undue delay; controllers assess regulatory/data-subject notification obligations and deadlines.
8. **Recover** — restore safely and verify tenant isolation/permissions.
9. **Post-incident review** — root cause, actions, DPIA/risk register changes, tests added.

## Operational rules

- Never email or paste private keys into support tickets.
- Do not send full learner datasets when a narrow identifier will do.
- Treat suspected cross-school disclosure as high priority.
- Treat exposed Firebase Admin, Stripe, Resend or AI credentials as requiring immediate rotation.
- Record decisions not to notify as well as decisions to notify.
