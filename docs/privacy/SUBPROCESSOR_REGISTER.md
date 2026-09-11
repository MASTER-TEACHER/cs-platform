# CS Master Operational Subprocessor / Provider Register

Validate the exact legal entity, service configuration, processing location, DPA and transfer mechanism before issuing this as a contractual register.

| Provider/service | Function in CS Master | Likely data involved | Review items |
|---|---|---|---|
| Vercel | Next.js hosting, API execution, CDN/HTTPS | request metadata and data processed by server routes | DPA, regions/logging, subprocessors, transfer terms |
| Google Firebase / Google Cloud | Authentication, Firestore, platform data | account, school, learning and assessment data | DPA, chosen regions, security, deletion, transfer terms |
| Stripe | individual and school billing | payer/contact and billing/subscription metadata | Stripe DPA/privacy, finance retention, webhook security |
| Resend | transactional email infrastructure | email address, message/delivery metadata | DPA, retention, subprocessors, transfer terms |
| OpenAI API | selected AI tutor/generation/marking support | prompt and task-relevant learning/assessment context | DPA/business terms, retention configuration, minimisation, transfer terms |
| Cloudflare | DNS and email routing configuration | DNS/request or routed-email metadata depending on enabled service | exact enabled products, DPA/privacy, logging |

## Provider review rule

Before adding a provider that will receive personal data, document:
1. purpose and fields shared;
2. processor/controller position;
3. DPA/contract;
4. processing/storage locations;
5. international transfer mechanism where applicable;
6. retention/deletion;
7. security controls;
8. subprocessors;
9. incident notification obligations.
