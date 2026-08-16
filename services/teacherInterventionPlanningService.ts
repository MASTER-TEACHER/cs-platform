import type {
  InterventionPlanningGroup,
  InterventionPlanningPriority,
  InterventionPlanningStudent,
  TeacherInterventionPlan,
} from "@/types/teacherInterventionPlanning";

function normaliseTopic(value: string): string {
  const cleaned = value.trim();
  return cleaned || "Combined Assessment Performance";
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function priorityForGroup({
  averageScore,
  lowestScore,
  studentCount,
}: {
  averageScore: number;
  lowestScore: number;
  studentCount: number;
}): InterventionPlanningPriority {
  if (lowestScore < 30 || averageScore < 35 || studentCount >= 4) {
    return "high";
  }

  if (averageScore < 50 || studentCount >= 2) {
    return "medium";
  }

  return "monitor";
}

function rationaleForGroup({
  topic,
  averageScore,
  lowestScore,
  studentCount,
}: {
  topic: string;
  averageScore: number;
  lowestScore: number;
  studentCount: number;
}): string {
  if (lowestScore < 30) {
    return `${studentCount} learner${studentCount === 1 ? "" : "s"} need support in ${topic}; the lowest current score is ${lowestScore}%.`;
  }

  if (averageScore < 50) {
    return `${topic} is a shared weakness for ${studentCount} learner${studentCount === 1 ? "" : "s"}, with an average of ${averageScore}%.`;
  }

  return `${studentCount} learner${studentCount === 1 ? "" : "s"} have been flagged for monitoring in ${topic}.`;
}

export function buildTeacherInterventionPlan(
  students: InterventionPlanningStudent[],
): TeacherInterventionPlan {
  const grouped = new Map<string, InterventionPlanningStudent[]>();

  students.forEach((student) => {
    const topic = normaliseTopic(student.weakTopic);
    const current = grouped.get(topic) || [];

    current.push({
      ...student,
      weakTopic: topic,
    });

    grouped.set(topic, current);
  });

  const groups: InterventionPlanningGroup[] = Array.from(grouped.entries())
    .map(([topic, members]) => {
      const scores = members.map((student) => student.averageScore);
      const averageScore = average(scores);
      const lowestScore = scores.length ? Math.min(...scores) : 0;
      const priority = priorityForGroup({
        averageScore,
        lowestScore,
        studentCount: members.length,
      });

      return {
        id:
          topic
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "support-group",
        topic,
        studentCount: members.length,
        students: [...members].sort(
          (first, second) => first.averageScore - second.averageScore,
        ),
        averageScore,
        lowestScore,
        priority,
        rationale: rationaleForGroup({
          topic,
          averageScore,
          lowestScore,
          studentCount: members.length,
        }),
        knowledgeMapHref: `/teacher/knowledge-map?topic=${encodeURIComponent(
          topic,
        )}&source=intervention-planner`,
        assignmentHref: `/teacher/assignment-wizard?topic=${encodeURIComponent(
          topic,
        )}&source=intervention-planner`,
        interventionHref: `/teacher/interventions?topic=${encodeURIComponent(
          topic,
        )}&source=intervention-planner`,
      };
    })
    .sort((first, second) => {
      const priorityRank = {
        high: 0,
        medium: 1,
        monitor: 2,
      };

      const difference =
        priorityRank[first.priority] - priorityRank[second.priority];

      if (difference !== 0) return difference;
      if (first.averageScore !== second.averageScore) {
        return first.averageScore - second.averageScore;
      }

      return second.studentCount - first.studentCount;
    });

  return {
    totalStudentsRequiringSupport: students.length,
    highPriorityGroups: groups.filter((group) => group.priority === "high").length,
    groupedTopics: groups.length,
    groups,
  };
}
