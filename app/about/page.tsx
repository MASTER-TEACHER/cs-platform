import type { Metadata } from "next";
import PublicInformationPage from "@/components/legal/PublicInformationPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PublicInformationPage
      eyebrow="About CS Master"
      title="Computer Science learning built around evidence"
      intro="CS Master supports Computer Science teaching, independent practice, revision and assessment across student and teacher workflows."
      sections={[
        {
          title: "What the platform does",
          content: (
            <>
              <p>
                CS Master combines curriculum-aligned lessons, quizzes, programming
                practice, exam preparation, progress information, adaptive learning
                and teacher tools in one learning environment.
              </p>
              <p>
                Curriculum selection is designed to respect qualification and exam-board
                context rather than presenting every learner with the same pathway.
              </p>
            </>
          ),
        },
        {
          title: "Responsible use of AI",
          content: (
            <p>
              AI-supported features are designed as learning and feedback tools. They
              do not replace teacher judgement, official mark schemes or awarding-body
              decisions, and supported activity is kept distinct from independent
              mastery evidence.
            </p>
          ),
        },
        {
          title: "Assessment integrity",
          content: (
            <p>
              Exam Mode uses integrity monitoring and configurable controls. It is not
              presented as a guaranteed lockdown browser, and schools remain responsible
              for their own assessment conditions and supervision.
            </p>
          ),
        },
      ]}
    />
  );
}