import type {
  TeacherActionCentreInput,
  TeacherActionCentreSummary,
  TeacherActionItem,
  TeacherActionPriority,
} from "@/types/teacherActionCentre";

const priorityRank: Record<TeacherActionPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function uniqueActions(actions: TeacherActionItem[]): TeacherActionItem[] {
  const seen = new Set<string>();

  return actions.filter((action) => {
    const key = `${action.kind}:${action.href}:${action.studentId || ""}:${action.topic || ""}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export function buildTeacherActionCentre(
  input: TeacherActionCentreInput,
): TeacherActionCentreSummary {
  const actions: TeacherActionItem[] = [];

  if (input.classCount === 0) {
    actions.push({
      id: "create-first-class",
      kind: "class_setup",
      priority: "critical",
      title: "Create your first class",
      description:
        "Teacher intelligence cannot become meaningful until students are organised into a class.",
      href: "/teacher/classes",
      actionLabel: "Open classes",
    });
  }

  if (input.studentCount === 0 && input.classCount > 0) {
    actions.push({
      id: "add-students",
      kind: "class_setup",
      priority: "critical",
      title: "Add students to your classes",
      description:
        "There are currently no students contributing learning or assessment evidence.",
      href: "/teacher/classes",
      actionLabel: "Manage enrolment",
    });
  }

  input.atRiskStudents.forEach((student, index) => {
    const critical = student.averageScore < 30;

    actions.push({
      id: `student-support-${student.id}`,
      kind: "student_support",
      priority: critical ? "critical" : "high",
      title: `${student.name} needs targeted support`,
      description:
        student.recommendedAction ||
        `Current average is ${student.averageScore}%. Review the learner's evidence and decide whether an intervention is required.`,
      href: `/teacher/analytics/${encodeURIComponent(student.id)}`,
      actionLabel: "Review student",
      studentId: student.id,
      studentName: student.name,
      topic: student.weakTopic,
      metric: `${student.averageScore}%`,
    });

    if (index < 3) {
      actions.push({
        id: `student-intervention-${student.id}`,
        kind: "student_support",
        priority: critical ? "high" : "medium",
        title: `Consider an intervention for ${student.name}`,
        description: `Focus the review on ${
          student.weakTopic || "the learner's weakest recent evidence"
        }.`,
        href:
          `/teacher/interventions?studentId=${encodeURIComponent(student.id)}` +
          `&topic=${encodeURIComponent(
            student.weakTopic || "Recent Quiz Performance",
          )}&source=teacher-dashboard`,
        actionLabel: "Open Intervention Centre",
        studentId: student.id,
        studentName: student.name,
        topic: student.weakTopic,
      });
    }
  });

  const assessedTopics = input.classPerformance.filter((topic) =>
    Number.isFinite(topic.averageScore),
  );

  const weakestTopic =
    assessedTopics.length > 0
      ? [...assessedTopics].sort(
          (first, second) => first.averageScore - second.averageScore,
        )[0]
      : null;

  if (weakestTopic && weakestTopic.averageScore < 50) {
    actions.push({
      id: `reteach-${weakestTopic.id}`,
      kind: "topic_reteach",
      priority: weakestTopic.averageScore < 30 ? "high" : "medium",
      title: `Reteach ${weakestTopic.topic}`,
      description: `Current class performance is ${weakestTopic.averageScore}%. Open the class Knowledge Map before assigning follow-up work.`,
      href: `/teacher/knowledge-map?topic=${encodeURIComponent(
        weakestTopic.topic,
      )}&source=teacher-dashboard`,
      actionLabel: "Open Knowledge Map",
      topic: weakestTopic.topic,
      metric: `${weakestTopic.averageScore}%`,
    });
  }

  if (
    input.studentCount > 0 &&
    input.assignmentCount > 0 &&
    input.completionRate < 60
  ) {
    actions.push({
      id: "completion-critical",
      kind: "completion",
      priority: input.completionRate < 40 ? "high" : "medium",
      title: "Assignment completion requires attention",
      description: `Overall completion is ${input.completionRate}%. Review outstanding work before drawing strong attainment conclusions.`,
      href: "/teacher/assignments",
      actionLabel: "Review assignments",
      metric: `${input.completionRate}%`,
    });
  } else if (
    input.studentCount > 0 &&
    input.assignmentCount > 0 &&
    input.completionRate < 80
  ) {
    actions.push({
      id: "completion-monitor",
      kind: "completion",
      priority: "low",
      title: "Monitor assignment completion",
      description: `Completion is currently ${input.completionRate}%. A stronger completion rate will improve the quality of teacher analytics.`,
      href: "/teacher/assignments",
      actionLabel: "View assignments",
      metric: `${input.completionRate}%`,
    });
  }

  if (
    input.studentCount > 0 &&
    input.averageScore > 0 &&
    input.averageScore < 50
  ) {
    actions.push({
      id: "class-attainment",
      kind: "evidence",
      priority: input.averageScore < 35 ? "high" : "medium",
      title: "Class attainment is below the review threshold",
      description: `The current dashboard average is ${input.averageScore}%. Use class analytics to separate topic gaps, student priorities and evidence-quality issues.`,
      href: "/teacher/analytics",
      actionLabel: "Open class analytics",
      metric: `${input.averageScore}%`,
    });
  }

  if (input.activeAssignmentCount === 0 && input.studentCount > 0) {
    actions.push({
      id: "no-active-assignments",
      kind: "assessment",
      priority: "low",
      title: "No active assignments",
      description:
        "Create a targeted task, quiz or written assessment when you need fresh evidence.",
      href: "/teacher/assignment-wizard",
      actionLabel: "Create assignment",
    });
  }

  if (input.studentCount > 0 && assessedTopics.length === 0) {
    actions.push({
      id: "limited-topic-evidence",
      kind: "evidence",
      priority: "medium",
      title: "More assessed evidence is needed",
      description:
        "No topic-performance evidence is available yet. Assign assessed work before relying on class-level mastery decisions.",
      href: "/teacher/assignment-wizard",
      actionLabel: "Create assessed work",
    });
  }

  const sorted = uniqueActions(actions).sort((first, second) => {
    const difference =
      priorityRank[first.priority] - priorityRank[second.priority];

    return difference !== 0
      ? difference
      : first.title.localeCompare(second.title);
  });

  const criticalCount = sorted.filter(
    (action) => action.priority === "critical",
  ).length;
  const highCount = sorted.filter(
    (action) => action.priority === "high",
  ).length;
  const mediumCount = sorted.filter(
    (action) => action.priority === "medium",
  ).length;
  const lowCount = sorted.filter(
    (action) => action.priority === "low",
  ).length;

  const headline =
    criticalCount > 0
      ? `${criticalCount} urgent action${
          criticalCount === 1 ? "" : "s"
        } require teacher attention`
      : highCount > 0
        ? `${highCount} high-priority action${
            highCount === 1 ? "" : "s"
          } to review`
        : mediumCount > 0
          ? "Your next teaching actions are ready"
          : sorted.length > 0
            ? "No urgent issues — continue monitoring"
            : "No immediate teacher actions detected";

  return {
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalCount: sorted.length,
    headline,
    actions: sorted,
  };
}
