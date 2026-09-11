# CS Master Personal Data Map

This map records the principal processing visible in the current application architecture. Validate it whenever a new Firestore collection, third-party integration or feature is added.

| Data category | Examples | Main purpose | Typical recipients/access | Retention approach |
|---|---|---|---|---|
| Account identity | UID, name, email, role | authentication, account operation | user, authorised staff/admin, Firebase | account life + justified post-closure period |
| School membership | schoolId, membership role/status | tenancy, school access | school staff, platform admin | membership life + audit/offboarding needs |
| Class membership | class/student IDs | teaching, assignment targeting | class teacher, learner, authorised school staff | school/class lifecycle |
| Curriculum profile | qualification, board, progress | learning pathway | learner, authorised teachers | account/school lifecycle |
| Assignment data | title, recipients, due dates, instructions | teaching/assessment | assigned learners, teacher | educational need + school retention |
| Assessment responses | quiz/exam answers, scores, marks | feedback, progress, evidence | learner, teacher, authorised staff | defined educational retention period |
| Programming evidence | code/submission/results | practice/assessment | learner, teacher | educational retention period |
| Analytics/interventions | mastery, gaps, interventions | teaching support | learner/teacher as appropriate | derived educational retention |
| Exam integrity | fullscreen/visibility events, timestamps, question | assessment review | learner where shown, teacher, authorised admin | short, assessment-linked period unless dispute/security need |
| AI request data | prompt, relevant task context, response | requested AI support | configured AI provider + authorised user | minimise; provider terms + local record policy |
| Feedback/support | report text, account context, page URL | support/quality | platform admin/support | resolve + limited audit period |
| Privacy requests | request type/details/status | data-rights administration | privacy/admin personnel, school if required | legal/accountability period |
| Billing metadata | customer/subscription IDs, plan/status | entitlement/billing | Stripe, authorised admin | finance/contract requirements |
| Email metadata | addresses and delivery information | transactional communication | email provider | provider/configured retention |

## Data minimisation rules

1. Do not collect date of birth, home address, medical, safeguarding or special-category information unless a future feature has a documented need, lawful basis, DPIA update and access model.
2. AI prompts should not include names/emails unless genuinely necessary.
3. Integrity events should record only what is needed to describe the event.
4. Avoid storing duplicate copies of the same personal field across collections unless needed for performance/audit and kept consistent.
5. New collections containing personal data must be added to this map before release.
