# iMedia urgent fix — scoped implementation

Changes teacher AI quiz form, OCR J834-specific generation, and saved-quiz subject metadata. It also makes the saved quiz picker retain iMedia qualification.

IMPORTANT: This is not the complete assignment-wizard/secure-assignment integration or deletion implementation. The current assignment wizard still coerces saved iMedia qualification to GCSE; do not assign an iMedia quiz to students until this is resolved and end-to-end tests pass. The Computer Science demo generator is disabled for iMedia.

Use RUN-IMEDIA-FIX.ps1 in the project root. Backups are created before file copies. Stop if the source files have diverged. Do not deploy without checking typecheck, lint, build and actual teacher-to-student flow.
