# CS Master Data Protection Impact Assessment (DPIA)

**Status:** Working DPIA for review before/through production use  
**Product:** CS Master  
**Scope:** UK secondary education learning, assessment and school-management platform  
**Review trigger:** material new processing, new AI use, new subject/age group, security incident, significant provider change, or at least annually.

> This document is an engineering and governance working record. It is not a legal certification and should be reviewed with appropriate data-protection/legal expertise for contractual school deployment.

## 1. Why a DPIA is required

CS Master is designed for secondary-school learners and processes educational, assessment and account information. It includes analytics, AI-supported features and monitored assessment-integrity events. Children are therefore expected users and the processing can create meaningful privacy risks if data is excessive, exposed across schools, retained indefinitely, or used for decisions without appropriate human review.

## 2. Processing described

Core processing includes:

- user identity, email, role and account profile;
- school, staff, class and learner membership;
- curriculum selection and progress;
- lessons, quizzes, programming work and written-exam responses;
- marks, feedback, assignment status and learning analytics;
- teacher interventions and knowledge-gap information;
- AI prompts, assessment content and learner responses when an AI feature is intentionally used;
- Exam Mode integrity events, including fullscreen/visibility events, timestamps and question position;
- support/feedback/privacy requests;
- school and individual subscription/entitlement metadata.

## 3. Purposes

- authenticate and secure accounts;
- deliver teaching, curriculum and learning functions;
- save progress and assessment evidence;
- enable teachers to assign work and review learner outcomes;
- provide educational analytics, recommendations and interventions;
- provide user-requested AI support;
- operate monitored assessments;
- administer school/individual subscriptions;
- provide support, security and incident response;
- maintain service reliability and audit evidence.

## 4. Data subjects

- secondary-school learners, including children;
- individual learners;
- teachers;
- school administrators;
- CS Master platform administrators;
- support/privacy requesters.

## 5. Controller/processor position

The legal role must be assessed by processing purpose, not merely by contract labels.

Likely model to validate contractually:

- **school-directed education processing:** school generally determines the educational purpose; CS Master may act as processor where it acts only on documented school instructions;
- **CS Master account, platform security, billing, fraud/abuse, direct-to-consumer and legal-compliance processing:** CS Master may act as an independent controller;
- **product analytics/development using identifiable school/child data:** must not be assumed to fall within processor instructions. Any such use requires a separately justified purpose, lawful basis, transparency and minimisation assessment.

## 6. Necessity and proportionality

Design controls include:

- school-scoped membership and role enforcement;
- explicit assignment-recipient lists;
- server-side verification for privileged API actions;
- Firestore rules restricting client reads/writes;
- server-only privileged credentials;
- no requirement for special-category information in ordinary learning flows;
- privacy requests explicitly warn users not to submit unnecessary sensitive information;
- assessment-integrity signals are presented for teacher review rather than automatic proof of misconduct;
- AI outputs are educational support and should not solely determine significant decisions.

## 7. Main privacy risks and mitigations

| Risk | Potential impact | Mitigation / required control | Residual assessment |
|---|---|---|---|
| Cross-school data exposure | High | tenant-scoped rules, membership checks, assignment targeting, server auth, regression tests | Medium |
| Privilege escalation | High | server-side role verification; no trust in browser role claims; protected admin routes | Low/Medium |
| Excessive collection | Medium/High | data map, field minimisation, avoid sensitive-data collection, review new fields | Medium |
| Indefinite retention | High | retention schedule, offboarding process, deletion/anonymisation review | Medium until automated retention is mature |
| AI receives unnecessary personal information | Medium/High | send only task-relevant context; user warnings; provider/DPA review; avoid unnecessary identifiers | Medium |
| AI marking/recommendation over-reliance | Medium/High | human teacher review, confidence signalling, no sole significant decision based on AI | Low/Medium |
| Exam integrity data interpreted as guilt | High | disclose monitoring; event evidence only; teacher review; configurable proportionate policy | Medium |
| Account/data-rights requests mishandled | Medium/High | authenticated request workflow, admin queue, identity-check status, school coordination | Low/Medium |
| Compromised privileged secrets | High | server-only environment variables, key rotation, least privilege, never commit secrets | Medium |
| Third-party processor change | Medium | subprocessor register and periodic provider review | Low/Medium |
| Security incident involving children | High | incident-response plan, containment, risk assessment and breach escalation | Medium |

## 8. Children’s higher-protection considerations

CS Master should:

- use child-appropriate privacy explanations;
- default to the minimum data and visibility required;
- avoid behavioural advertising/profiling for unrelated commercial purposes;
- avoid detrimental or unexpected reuse of learner data;
- make AI and Exam Mode processing understandable;
- retain meaningful human oversight;
- avoid nudging children to disclose more personal information than required;
- review new features against best-interests and proportionality considerations.

## 9. Consultation and governance

Before broad school rollout, review with:

- school/DPO or data-protection lead representatives;
- teaching staff;
- appropriate child/learner feedback where practical;
- technical/security review;
- legal/data-protection review for final contractual documents.

## 10. Sign-off

Before final sign-off record:

- owner of DPIA;
- date reviewed;
- outstanding high risks;
- legal bases/Article 9 position where relevant;
- controller/processor allocation;
- international-transfer mechanism/provider position;
- retention implementation status;
- DPA/subprocessor acceptance;
- sign-off decision and next review date.
