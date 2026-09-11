import type { Metadata } from "next";

import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <PublicInformationPage
      eyebrow="Cookies & Storage"
      title="Browser storage information"
      intro="CS Master currently uses essential browser storage needed for account sessions, application state and a small acknowledgement of this notice."
      sections={[
        {
          title: "Essential storage",
          content: (
            <p>
              Authentication providers and the application may use cookies, IndexedDB,
              local storage or similar browser storage where needed to keep users signed
              in, protect requests, preserve necessary application state and provide the
              service requested by the user.
            </p>
          ),
        },
        {
          title: "Cookie notice acknowledgement",
          content: (
            <p>
              CS Master stores a small local acknowledgement so the browser-storage notice
              does not need to reappear on every visit. It is not used for advertising or
              cross-site tracking.
            </p>
          ),
        },
        {
          title: "Analytics and advertising",
          content: (
            <p>
              The current CS Master notice does not grant consent for non-essential
              analytics, advertising cookies or behavioural advertising. If CS Master
              later introduces non-essential tracking technologies, they should remain
              disabled until the required transparency and consent mechanism has been
              implemented.
            </p>
          ),
        },
        {
          title: "Managing storage",
          content: (
            <p>
              Browsers allow users to inspect, clear or restrict site data. Blocking
              storage that is strictly necessary for authentication or application
              operation may prevent parts of CS Master from working correctly.
            </p>
          ),
        },
      ]}
    />
  );
}
