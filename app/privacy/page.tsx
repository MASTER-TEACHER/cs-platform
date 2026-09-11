import Link from "next/link";
import type { Metadata } from "next";

import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PublicInformationPage
      eyebrow="Privacy"
      title="Privacy information"
      intro="This notice explains the main personal information CS Master may process, why it is used, who may receive it and how privacy requests can be made."
      sections={[
        {
          title: "Who this information is for",
          content: (
            <>
              <p>
                CS Master supports individual learners and school-managed users. The legal
                role CS Master and a school each perform can depend on the particular
                processing activity and the purposes actually determined by each party.
              </p>
              <p>
                Where a school determines why learner information is processed through CS
                Master for teaching, assessment or school administration, the school may
                be the appropriate first contact. CS Master may also be responsible for
                processing it determines for its own platform, security, account,
                subscription or direct-to-consumer purposes.
              </p>
            </>
          ),
        },
        {
          title: "Information used by the platform",
          content: (
            <p>
              Depending on account type and enabled features, this may include account
              identity and contact details; school, staff and class membership; curriculum
              choices; assignments; learning progress; quiz, programming and written-exam
              responses; marks and feedback; teacher interventions; AI prompts and
              learning context when an AI feature is used; assessment-integrity events;
              support/feedback information; and subscription or entitlement status.
            </p>
          ),
        },
        {
          title: "Why information is processed",
          content: (
            <p>
              Information is processed to authenticate accounts, deliver curriculum and
              learning features, save progress, support teaching and school workflows,
              operate assessments, provide feedback and analytics, protect service and
              assessment integrity, administer subscriptions, respond to users and improve
              reliability and security. The applicable lawful basis depends on the
              processing context and whether the user is school-managed or uses CS Master
              directly.
            </p>
          ),
        },
        {
          title: "AI-supported features",
          content: (
            <>
              <p>
                When an AI feature is deliberately used, the information required for that
                request may be sent to the configured AI provider. This can include the
                prompt, relevant curriculum or assessment context and, for marking or
                feedback features, the response being evaluated.
              </p>
              <p>
                Users should not place unnecessary personal, safeguarding, medical or
                confidential information in AI prompts. AI outputs are educational support
                and should not be treated as an official examination result or as the sole
                basis for a significant decision about a learner.
              </p>
            </>
          ),
        },
        {
          title: "Assessment integrity and visibility events",
          content: (
            <p>
              Where a teacher enables monitored Exam Mode, CS Master may record events
              such as leaving required fullscreen mode, page visibility changes, time and
              question position. This evidence is provided to support proportionate
              teacher review. It is not intended to establish wrongdoing automatically.
            </p>
          ),
        },
        {
          title: "Service providers",
          content: (
            <p>
              CS Master uses specialist providers for hosting and delivery, authentication
              and application data, payments, email and selected AI functionality. Only
              information reasonably required for the relevant service should be shared.
              The current operational subprocessor register is maintained as part of the
              CS Master privacy and security documentation.
            </p>
          ),
        },
        {
          title: "Retention and deletion",
          content: (
            <p>
              Personal information should be retained only for an identified learning,
              school-management, account, security, contractual or legal purpose. Different
              records require different periods rather than a single indefinite retention
              rule. School offboarding and account/data requests must also account for
              records the school controls, financial/legal records, security evidence and
              information that has already been validly anonymised.
            </p>
          ),
        },
        {
          title: "Security and access",
          content: (
            <p>
              CS Master uses authenticated accounts, role checks, server-side privileged
              operations and school-scoped permissions. Production traffic is served over
              HTTPS and security controls are reviewed as the service develops. No online
              service can guarantee absolute security.
            </p>
          ),
        },
        {
          title: "Children and young people",
          content: (
            <p>
              CS Master is designed for secondary education and therefore expects children
              and young people to use the service. Privacy information and default
              processing should be proportionate to that context, minimise unnecessary
              information and avoid using educational data in ways that conflict with the
              learner&apos;s reasonable expectations or best interests.
            </p>
          ),
        },
        {
          title: "Your data protection rights",
          content: (
            <>
              <p>
                Depending on the circumstances, UK data protection law can provide rights
                relating to access, correction, erasure, restriction, objection and data
                portability. These rights are not absolute in every situation and identity
                may need to be verified.
              </p>
              <p>
                Signed-in users can use the{" "}
                <Link href="/data-rights" className="font-bold text-blue-700 underline">
                  CS Master data-rights request form
                </Link>
                . You can also use the privacy contact published on the Contact page. For
                school-managed processing, CS Master may need to coordinate the request
                with the relevant school.
              </p>
            </>
          ),
        },
        {
          title: "Questions and complaints",
          content: (
            <p>
              Privacy questions should be sent to the privacy contact on the Contact page.
              Individuals may also have the right to complain to the UK Information
              Commissioner&apos;s Office. A concern should normally be raised with the
              organisation first so it has an opportunity to investigate and respond.
            </p>
          ),
        },
      ]}
    />
  );
}
