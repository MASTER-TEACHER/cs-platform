import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

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
              For class assignments, school access or assessment questions, contact your
              teacher or school first. They can resolve school-managed issues and escalate
              platform problems when needed.
            </p>
          ),
        },
        {
          title: "Teachers and school administrators",
          content: (
            <p>
              Include your school name, the affected page, a concise description of the
              issue and any non-sensitive error message. Never send passwords, authentication
              tokens, private keys or full student datasets.
            </p>
          ),
        },
        {
          title: "Platform support",
          content: supportEmail ? (
            <p>
              Email{" "}
              <a className="font-bold text-blue-700 underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              . Do not include passwords or other secrets.
            </p>
          ) : (
            <p>
              The public support email has not yet been configured. Before production
              launch, set NEXT_PUBLIC_SUPPORT_EMAIL in the deployment environment.
            </p>
          ),
        },
      ]}
    />
  );
}