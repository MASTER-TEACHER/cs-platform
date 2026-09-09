import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
    "support@csmaster.co.uk";

  const privacyEmail = "privacy@csmaster.co.uk";
  const billingEmail = "billing@csmaster.co.uk";

  return (
    <PublicInformationPage
      eyebrow="Contact"
      title="Get support"
      intro="Use the appropriate support route for account, school, billing, privacy or technical questions."
      sections={[
        {
          title: "Students",
          content: (
            <p>
              For class assignments, school access or assessment questions,
              contact your teacher or school first. They can resolve
              school-managed issues and escalate platform problems when needed.
            </p>
          ),
        },
        {
          title: "Teachers and school administrators",
          content: (
            <p>
              Include your school name, the affected page, a concise description
              of the issue and any non-sensitive error message. Never send
              passwords, authentication tokens, private keys or full student
              datasets.
            </p>
          ),
        },
        {
          title: "Technical and account support",
          content: (
            <p>
              For technical problems, account questions or general platform
              support, email{" "}
              <a
                className="font-bold text-blue-700 underline"
                href={`mailto:${supportEmail}`}
              >
                {supportEmail}
              </a>
              .
            </p>
          ),
        },
        {
          title: "Privacy and data protection",
          content: (
            <p>
              For privacy questions, personal data requests or data protection
              concerns, email{" "}
              <a
                className="font-bold text-blue-700 underline"
                href={`mailto:${privacyEmail}`}
              >
                {privacyEmail}
              </a>
              .
            </p>
          ),
        },
        {
          title: "Billing and subscriptions",
          content: (
            <p>
              For payment, subscription or billing questions, email{" "}
              <a
                className="font-bold text-blue-700 underline"
                href={`mailto:${billingEmail}`}
              >
                {billingEmail}
              </a>
              .
            </p>
          ),
        },
        {
          title: "Report a problem",
          content: (
            <p>
              Teachers and students who are signed in can also use the{" "}
              <a
                className="font-bold text-blue-700 underline"
                href="/feedback"
              >
                Report a Problem
              </a>{" "}
              page to submit bugs, content issues, accessibility concerns or
              improvement ideas directly to the CS Master team.
            </p>
          ),
        },
        {
          title: "Keeping your information safe",
          content: (
            <p>
              Please do not send passwords, authentication credentials, payment
              card details or unnecessary personal information in support
              messages.
            </p>
          ),
        },
      ]}
    />
  );
}