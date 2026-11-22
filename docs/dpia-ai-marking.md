# Data protection impact assessment (DPIA): starting notes for AI examination marking

This is a starting point, not legal advice. Complete it with your school's Data Protection Officer.

## What the processing is
- Teachers upload candidate exam scripts (PDF scans) to the CS Master AI Examination Marking Centre.
- Scripts are sent to AI providers to transcribe handwriting and propose marks against the teacher's approved mark scheme.
- A teacher reviews and approves every mark before it becomes a result.

## Data involved
- Candidate answers (images and transcribed text), the question paper and mark scheme.
- Candidate codes (pseudonymous). Names are not sent to AI providers. The school holds the link between codes and students.
- Approved marks, feedback and improvement guidance.
- Data subjects are typically students under 18.

## Who processes it
| Role | Organisation | Purpose |
|---|---|---|
| Controller | The school | Assessment of students |
| Processor | CS Master | Platform hosting and marking workflow |
| Sub-processor | Anthropic (Claude API) | Handwriting transcription and marking |
| Sub-processor | OpenAI (API) | Answer alignment / marking (depending on configuration) |
| Sub-processor | Google Firebase / Cloud Storage | Data and file storage |
| Sub-processor | Vercel | Hosting |

## Lawful basis (typical for schools)
- Public task (UK GDPR Article 6(1)(e)) for assessment of students. Confirm with your DPO.

## International transfers
- AI providers may process data in the United States. Check that each provider offers appropriate safeguards (e.g. UK International Data Transfer Addendum or UK Extension to the EU–US Data Privacy Framework) and record this.

## Risks and controls
| Risk | Control in CS Master |
|---|---|
| Identification of students by AI providers | Candidate codes instead of names |
| Inaccurate AI marks affecting students | Teacher approval required; flags for uncertain readings; accuracy check before bulk approval |
| Data kept longer than needed | Scripts and transcripts deleted automatically after MARKING_SCRIPT_RETENTION_DAYS (default 365) |
| Unauthorised access | Authenticated teacher accounts, per-teacher ownership checks, server-side access only, HTTPS |
| Provider using data for training | Providers' API terms state API data is not used for training by default (verify current terms) |
| Unexpected costs | Monthly spending cap (MARKING_MONTHLY_BUDGET_USD) |

## Actions for the school
1. Add AI marking providers to the school's privacy notice for students and parents.
2. Record the lawful basis and transfer safeguards.
3. Agree a retention period and set MARKING_SCRIPT_RETENTION_DAYS to match.
4. Review this assessment annually or when providers change.
