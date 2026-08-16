import type {
  TeacherDashboardFocus,
  TeacherDashboardIntegration,
  TeacherDashboardSignal,
} from "@/types/teacherDashboardIntegration";

type TeacherDashboardIntegrationInput = {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  averageScore: number;
  completionRate: number;
  atRiskCount: number;
};

function primaryFocus({
  atRiskCount,
  completionRate,
  averageScore,
  activeAssignmentCount,
}: TeacherDashboardIntegrationInput): TeacherDashboardFocus {
  if (atRiskCount > 0) return "student_support";
  if (completionRate < 70) return "completion";
  if (activeAssignmentCount === 0 || averageScore < 50) return "assessment";
  return "monitoring";
}

function headlineForFocus(focus: TeacherDashboardFocus): string {
  if (focus === "student_support") return "Start with learners requiring support";
  if (focus === "completion") return "Start with assignment completion";
  if (focus === "assessment") return "Collect the next useful assessment evidence";
  return "Review current evidence and keep the cycle moving";
}

function summaryForFocus(focus: TeacherDashboardFocus): string {
  if (focus === "student_support") {
    return "Review the highest-priority learners first, then move into intervention planning or targeted reassessment.";
  }

  if (focus === "completion") {
    return "Outstanding work may be weakening the reliability of current attainment conclusions. Review completion before escalating curriculum concerns.";
  }

  if (focus === "assessment") {
    return "Use the assessment tools to collect stronger evidence, then return to analytics and reports to interpret the results.";
  }

  return "The dashboard is in a monitoring state. Use analytics, reports and the assessment centre to maintain the review cycle.";
}

export function buildTeacherDashboardIntegration(
  input: TeacherDashboardIntegrationInput,
): TeacherDashboardIntegration {
  const focus = primaryFocus(input);

  const signals: TeacherDashboardSignal[] = [
    {
      id: "support",
      label: "Learners requiring support",
      value: String(input.atRiskCount),
      detail:
        input.atRiskCount > 0
          ? "Open the priority workflow before assigning broad follow-up work."
          : "No current dashboard intervention alerts.",
      focus: "student_support",
      href: "#teacher-actions",
      actionLabel: "Review actions",
      severity: input.atRiskCount > 0 ? "high" : "positive",
    },
    {
      id: "completion",
      label: "Assignment completion",
      value: `${input.completionRate}%`,
      detail:
        input.completionRate < 70
          ? "Completion is low enough to affect confidence in the current evidence picture."
          : "Completion is currently supporting a usable evidence picture.",
      focus: "completion",
      href: "/teacher/assignments",
      actionLabel: "Review assignments",
      severity:
        input.completionRate < 50
          ? "high"
          : input.completionRate < 70
            ? "medium"
            : "positive",
    },
    {
      id: "attainment",
      label: "Current average",
      value: `${input.averageScore}%`,
      detail:
        input.averageScore < 50
          ? "Use class analytics to separate curriculum gaps from individual learner issues."
          : "Review class analytics for topic-level strengths and weaknesses.",
      focus: "monitoring",
      href: "/teacher/analytics",
      actionLabel: "Open analytics",
      severity:
        input.averageScore < 40
          ? "high"
          : input.averageScore < 60
            ? "medium"
            : "positive",
    },
    {
      id: "assessment",
      label: "Active assignments",
      value: String(input.activeAssignmentCount),
      detail: `${input.assignmentCount} total assignment${
        input.assignmentCount === 1 ? "" : "s"
      } across ${input.classCount} class${
        input.classCount === 1 ? "" : "es"
      } and ${input.studentCount} learner${
        input.studentCount === 1 ? "" : "s"
      }.`,
      focus: "assessment",
      href: "#assessment-centre",
      actionLabel: "Assessment centre",
      severity: input.activeAssignmentCount === 0 ? "medium" : "low",
    },
  ];

  return {
    headline: headlineForFocus(focus),
    summary: summaryForFocus(focus),
    primaryFocus: focus,
    signals,
  };
}
