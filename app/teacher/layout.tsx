import type {
  ReactNode,
} from "react";

import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";
import TeacherAccessGate from "@/components/teacher/TeacherAccessGate";

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TeacherAccessGate>
      <SchoolSubscriptionGate>
        {children}
      </SchoolSubscriptionGate>
    </TeacherAccessGate>
  );
}