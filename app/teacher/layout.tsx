import type { ReactNode } from "react";

import TeacherAccessGate from "@/components/teacher/TeacherAccessGate";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <TeacherAccessGate>{children}</TeacherAccessGate>;
}
