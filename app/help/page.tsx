import type { Metadata } from "next";
import Link from "next/link";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <PublicInformationPage
      eyebrow="Help centre"
      title="Using CS Master"
      intro="Quick guidance for account access, curriculum setup, learning activities and teacher-managed work."
      sections={[
        {
          title: "Signing in and account access",
          content: (
            <p>
              Use the <Link className="font-bold text-blue-700 underline" href="/login">sign-in page</Link>.
              If you cannot remember your password, use the password-reset option there.
              Teacher access may require school verification and platform approval.
            </p>
          ),
        },
        {
          title: "Curriculum and progress",
          content: (
            <p>
              Student curriculum content is selected using the qualification and exam
              board saved to the account. Progress, mastery and recommendations depend
              on the evidence available for that learner.
            </p>
          ),
        },
        {
          title: "AI and automated feedback",
          content: (
            <p>
              Treat automated marking, recommendations and tutor responses as learning
              support. Check important assessment decisions against teacher guidance and
              official awarding-body materials.
            </p>
          ),
        },
        {
          title: "Something is not working",
          content: (
            <p>
              Sign out and back in, refresh the page, and confirm that your browser is
              current. If the problem continues, use the Contact page and include the
              page you were using, what you expected to happen and the error message.
            </p>
          ),
        },
      ]}
    />
  );
}