# CS MASTER — P1 Production & Deployment Hardening

Generated from the P1 production audit.

## What this package changes
- P1A/P1B: preserves the existing lazy Firebase Admin implementation and existing server-side role verification; production credentials are supplied at runtime, not committed.
- P1C: adds `firestore.indexes.json` and connects it to `firebase.json`.
- P1D: strengthens secret exclusions and adds a production environment contract containing variable names only.
- P1E: preserves the audited AI failure/demo safeguards and documents production demo-mode settings.
- P1F: adds a Node-runtime `/api/health` readiness endpoint without exposing secret values.
- P1G: health/readiness and controlled failure checks are included in the acceptance gate.
- P1H: adds automated acceptance, rollback, cleanup and manual smoke-test sign-off.

## Apply
From the CS Master project root:

```powershell
powershell -ExecutionPolicy Bypass -File "PATH\TO\CS-MASTER-P1-PRODUCTION\APPLY-P1.ps1" -ProjectRoot .
```

Then configure production environment values in the hosting provider and Firebase Admin credentials.

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "PATH\TO\CS-MASTER-P1-PRODUCTION\tools\TEST-P1.ps1" -ProjectRoot .
```

Do not call P1 complete until the automated gate passes and every manual test in `P1-SIGN-OFF.md` is checked.
