# CS Master v1.1 Production Hygiene

This batch makes the sidebar text-only and adds a UTF-8/mojibake guard.

## Apply

If you extracted the ZIP inside:

C:\Users\cr7ri\cs-platform-clean

run:

```powershell
cd C:\Users\cr7ri\cs-platform-clean

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\CS-MASTER-V1-1-PRODUCTION-HYGIENE\APPLY-CS-MASTER-V1-1-PRODUCTION-HYGIENE.ps1 `
  -ProjectRoot "C:\Users\cr7ri\cs-platform-clean"
```

## Test

```powershell
npm run encoding:audit
npm run verify
```

If `encoding:audit` reports other files, do not deploy. Send the output so those exact files can be cleaned.

## Browser smoke test

Check student, teacher and admin sidebars:
- text only
- links still work
- active link highlighting works
- scrolling works
- mobile menu opens/closes
- Upgrade to Premium is text only
- logout still works
