import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import type { ClassProgressReport } from "@/types/reporting";

export async function buildClassProgressReport({ teacherId, classId }: { teacherId:string; classId:string; }): Promise<ClassProgressReport | null> {
  const portfolio = await getTeacherAnalyticsPortfolio(teacherId);
  const c = portfolio.classes.find(item=>item.classId===classId);
  if (!c) return null;
  const sorted=[...c.topicAnalytics].sort((a,b)=>b.weightedPercentage-a.weightedPercentage);
  return {
    classId:c.classId, className:c.className, generatedAt:new Date(), studentCount:c.studentCount,
    studentsWithEvidence:c.studentsWithEvidence, averageWorkingGrade:c.averageWorkingGrade,
    averageTargetGrade:c.averageTargetGrade, averageWeightedPercentage:c.averageWeightedPercentage,
    averageCompletionRate:c.averageCompletionRate, onOrAboveTargetPercentage:c.onOrAboveTargetPercentage,
    highPriorityCount:c.highPriorityCount, decliningCount:c.decliningCount, lowEvidenceCount:c.lowEvidenceCount,
    strongestTopics:sorted.slice(0,4).map(t=>({topic:t.topic, mastery:t.weightedPercentage})),
    priorityTopics:[...sorted].reverse().slice(0,4).map(t=>({topic:t.topic, mastery:t.weightedPercentage})),
  };
}
