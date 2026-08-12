CS Master Playwright Simulator QA

INSTALL
-------
Copy these files into the CS Master project root, preserving folders:

playwright.config.ts
tests\auth.setup.ts
tests\simulator-smoke.spec.ts
tests\simulator-standard.spec.ts
tests\algorithms.spec.ts
scripts\test-simulators.ps1

Then append the lines in PLAYWRIGHT-GITIGNORE.txt to your existing .gitignore.

RUN
---
From C:\Users\cr7ri\cs-platform:

powershell -ExecutionPolicy Bypass -File .\scripts\test-simulators.ps1

The script prompts for the student test account email and password.
The password is read as a SecureString, converted only inside the current
PowerShell process for Playwright authentication, and removed afterward.
It is not written into test source code or reports.

OPTIONAL REPORT
---------------
powershell -ExecutionPolicy Bypass -File .\scripts\test-simulators.ps1 -OpenReport

FIRST VERSION SCOPE
-------------------
This package provides the first browser QA layer:
- authenticates as a student
- discovers topics from /learn
- discovers lesson links where exposed
- finds simulator pages
- exercises Foundation / Intermediate / Higher where present
- toggles Hint and Show Working where present
- generates a New Question / New Example where present
- reports browser console errors
- keeps screenshots, video and traces on failures

It intentionally does not guess simulator answers yet. Once this discovery
layer passes on your real curriculum routing, the next QA layer can add
simulator-specific answer/procedural tests.
