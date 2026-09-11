import type { Metadata } from "next";

import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <PublicInformationPage
      eyebrow="Trust & Security"
      title="Security at CS Master"
      intro="CS Master uses layered technical and operational controls to protect learning, assessment and school information."
      sections={[
        {
          title: "Authentication and access control",
          content: (
            <p>
              Accounts are authenticated through Firebase Authentication. Application
              roles, school membership and Firestore security rules are used to limit
              access to protected data. Sensitive administrative operations are performed
              by authenticated server routes rather than trusting browser-supplied role
              information.
            </p>
          ),
        },
        {
          title: "School isolation",
          content: (
            <p>
              School membership, class ownership and explicit assignment recipients are
              used to separate learner information. CS Master is designed so a teacher
              should not receive another school&apos;s protected learner data merely because
              they are a teacher on the platform.
            </p>
          ),
        },
        {
          title: "Encryption and providers",
          content: (
            <p>
              Production access is provided over HTTPS. CS Master relies on specialist
              service providers for hosting, authentication/data storage, payments, email
              and selected AI features. Provider access is limited to what is required to
              deliver those services.
            </p>
          ),
        },
        {
          title: "Secrets and privileged credentials",
          content: (
            <p>
              Administrative credentials and API secrets are intended to remain in
              server-only environment variables or provider-managed configuration and
              must never be exposed through NEXT_PUBLIC variables or committed source
              files.
            </p>
          ),
        },
        {
          title: "Assessment integrity",
          content: (
            <p>
              Exam Mode may record assessment-integrity events such as leaving required
              fullscreen mode or page-visibility changes. These signals support teacher
              review; they are not a guaranteed lockdown-browser capability and should not
              be treated as automatic proof of misconduct.
            </p>
          ),
        },
        {
          title: "Reporting a security concern",
          content: (
            <p>
              Do not publish suspected vulnerabilities or personal information in public
              feedback. Report security concerns through the CS Master contact route so
              they can be investigated and contained appropriately.
            </p>
          ),
        },
      ]}
    />
  );
}
