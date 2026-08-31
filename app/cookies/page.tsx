import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Cookies and browser storage" };

export default function CookiesPage() {
  return (
    <PublicInformationPage
      eyebrow="Cookies"
      title="Cookies and browser storage"
      intro="CS Master uses browser storage where it is needed for authentication, security, preferences and reliable application behaviour."
      sections={[
        {
          title: "Essential storage",
          content: (
            <p>
              Essential storage may be used by authentication and application services
              to maintain a signed-in session, protect requests, remember necessary
              preferences and keep the platform functioning.
            </p>
          ),
        },
        {
          title: "CS Master cookie notice",
          content: (
            <p>
              The cookie notice stores a small local acknowledgement so it does not need
              to appear on every visit. This acknowledgement is not used for advertising.
            </p>
          ),
        },
        {
          title: "Non-essential analytics",
          content: (
            <p>
              The current notice does not grant consent for non-essential analytics or
              advertising cookies. If those technologies are introduced later, the consent
              mechanism and this information should be updated before they are enabled.
            </p>
          ),
        },
        {
          title: "Browser controls",
          content: (
            <p>
              Browsers allow users to clear or restrict stored site data. Blocking
              essential authentication or application storage may prevent parts of CS
              Master from working correctly.
            </p>
          ),
        },
      ]}
    />
  );
}