import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PublicInformationPage
      eyebrow="Terms"
      title="Platform terms"
      intro="These platform rules describe acceptable use of CS Master. Commercial school agreements may contain additional terms."
      sections={[
        {
          title: "Appropriate use",
          content: (
            <p>
              Use CS Master for legitimate learning, teaching and administration. Do not
              attempt to gain unauthorised access, interfere with other users, bypass
              assessment-integrity controls, extract hidden assessment material or misuse
              another person&apos;s account.
            </p>
          ),
        },
        {
          title: "Assessment and AI",
          content: (
            <p>
              Automated marking, predicted performance, recommendations and AI tutor
              responses are educational support, not official awarding-body results.
              Teachers and schools retain responsibility for consequential assessment
              decisions.
            </p>
          ),
        },
        {
          title: "Accounts",
          content: (
            <p>
              Users are responsible for keeping sign-in credentials secure and for using
              the correct account. Access may be restricted where an account is suspended,
              a school membership ends, or platform security requires intervention.
            </p>
          ),
        },
        {
          title: "Availability",
          content: (
            <p>
              The service may occasionally be unavailable for maintenance, provider
              outages or security work. Features that depend on third-party services,
              including AI, email and payments, may also be affected by those providers.
            </p>
          ),
        },
      ]}
    />
  );
}