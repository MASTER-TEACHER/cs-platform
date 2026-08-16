export type TeacherDashboardFocus =
  | "student_support"
  | "completion"
  | "assessment"
  | "monitoring";

export type TeacherDashboardSignal = {
  id: string;
  label: string;
  value: string;
  detail: string;
  focus: TeacherDashboardFocus;
  href: string;
  actionLabel: string;
  severity: "high" | "medium" | "low" | "positive";
};

export type TeacherDashboardIntegration = {
  headline: string;
  summary: string;
  primaryFocus: TeacherDashboardFocus;
  signals: TeacherDashboardSignal[];
};
