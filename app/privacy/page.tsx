import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PublicInformationPage
      eyebrow="Privacy"
      title="Privacy information"
      intro="This page explains the main categories of information CS Master may process to provide learning, assessment and school-management features."
      sections={[
        {
          title: "Information used by the platform",
          content: (
            <p>
              Depending on account type and enabled features, this may include account
              details, school and class membership, curriculum choices, learning progress,
              quiz and exam submissions, programming activity, teacher feedback, integrity
              incidents and subscription status.
            </p>
          ),
        },
        {
          title: "Why information is processed",
          content: (
            <p>
              Information is used to authenticate users, provide curriculum and learning
              features, save progress, support teacher workflows, operate assessments,
              protect platform integrity, administer subscriptions and improve reliability.
            </p>
          ),
        },
        {
          title: "AI-supported features",
          content: (
            <p>
              When an AI feature is used, relevant learning context and the user&apos;s
              submitted prompt or response may be sent to the configured AI service to
              produce the requested learning support. Users should not enter unnecessary
              personal or confidential information into AI prompts.
            </p>
          ),
        },
        {
          title: "Schools and learner information",
          content: (
            <p>
              Schools using CS Master should ensure that their own notices, permissions,
              retention practices and lawful-basis decisions are appropriate for their use
              of the service and the learners they manage.
            </p>
          ),
        },
        {
          title: "Requests and questions",
          content: (
            <p>
              Privacy requests should be made through the contact route published by the
              platform or, for a school-managed account, through the relevant school where
              appropriate. Identity may need to be verified before account information is
              disclosed or changed.
            </p>
          ),
        },
      ]}
    />
  );
}