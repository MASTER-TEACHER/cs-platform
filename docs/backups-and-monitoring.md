# Backups and monitoring

## Firestore scheduled backups (recommended)
Firestore can take automatic daily backups that you can restore from.

1. Open the Google Cloud console for your Firebase project → **Firestore** → **Disaster recovery** (or **Backups**).
2. Create a **backup schedule**: Daily, retention 7–14 days.
   - Or with the gcloud CLI:
     `gcloud firestore backups schedules create --database="(default)" --recurrence=daily --retention=14d`
3. Backups are billed for storage; a small database costs very little.

## Error monitoring
- Vercel → your project → **Logs** shows server errors (search for "[Marking Centre]").
- For alerts, connect a log drain or an error-tracking service (e.g. Sentry's Vercel integration) from the Vercel Marketplace.

## CI typecheck
`.github/workflows/typecheck.yml` runs `npm run typecheck` on every push. A red cross on GitHub means fix the type error before merging.
