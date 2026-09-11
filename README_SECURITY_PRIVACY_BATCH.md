# CS Master v1.1 Security / Privacy / GDPR Batch

This package is designed for the current CS Master source collection generated on 9 September 2026.

It adds:
- data-rights request workflow;
- admin privacy request queue;
- expanded privacy and security pages;
- safer server authentication/admin error handling;
- defensive HTTP header hardening;
- Firestore protection for server-managed privacy/audit records;
- DPIA, data map, retention, provider, incident-response and school DPA working documents;
- targeted release-test checklist.

## Apply

From PowerShell, run the included installer with a one-time execution-policy bypass if your machine blocks unsigned local scripts:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\APPLY-CS-MASTER-SECURITY-PRIVACY-GDPR.ps1" -ProjectRoot "C:\Users\cr7ri\cs-platform-clean"
```

This does not permanently change Windows execution policy.

## Then

```powershell
cd C:\Users\cr7ri\cs-platform-clean
npm run verify
```

Do not commit yet. After verification, deploy Firestore rules and run only `SECURITY_PRIVACY_RELEASE_TESTS.md`. Then clean old package files, inspect `git status`, and commit the coordinated batch.

## Important

Do not add secrets to the package or repository. Do not describe this engineering package as legal certification or proof of GDPR compliance. The checklist deliberately records operational/legal items that still require validation.
