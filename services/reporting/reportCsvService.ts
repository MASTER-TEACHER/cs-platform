import type { ClassProgressReport, StudentProgressReport } from "@/types/reporting";
function esc(v:unknown){const s=v==null?"":String(v);return `"${s.replace(/"/g,'""')}"`;}
export function studentReportToCsv(r:StudentProgressReport):string{
 const rows:unknown[][]=[
  ["CS Master Student Progress Report"],["Student",r.studentName],["Email",r.studentEmail],["Class",r.className],
  ["Working grade",r.workingGrade||"—"],["Target grade",r.targetGrade||"—"],["Working percentage",r.workingPercentage??"—"],
  ["Grade gap",r.gradeGap??"—"],["Next grade",r.nextGrade||"—"],["Marks to next grade",r.marksToNextGrade??"—"],
  ["Trend",r.trend],["Completion rate",`${r.completionRate}%`],["Evidence confidence",r.confidence],[],["Strengths"],
  ...r.strengths.map(x=>[x.topic,`${x.mastery}%`]),[],["Priority areas"],...r.priorities.map(x=>[x.topic,`${x.mastery}%`]),
  [],["Teacher commentary"],...r.teacherCommentary.map(x=>[x]),[],["Student next steps"],...r.studentNextSteps.map(x=>[x])
 ]; return rows.map(row=>row.map(esc).join(',')).join('\n');
}
export function classReportToCsv(r:ClassProgressReport):string{
 const rows:unknown[][]=[
  ["CS Master Class Progress Report"],["Class",r.className],["Students",r.studentCount],["Students with evidence",r.studentsWithEvidence],
  ["Average working grade",r.averageWorkingGrade||"—"],["Average target grade",r.averageTargetGrade||"—"],
  ["Average weighted percentage",r.averageWeightedPercentage??"—"],["Average completion rate",`${r.averageCompletionRate}%`],
  ["On / above target",`${r.onOrAboveTargetPercentage}%`],["High priority students",r.highPriorityCount],["Declining students",r.decliningCount],
  ["Low evidence students",r.lowEvidenceCount],[],["Strongest topics"],...r.strongestTopics.map(x=>[x.topic,`${x.mastery}%`]),
  [],["Priority topics"],...r.priorityTopics.map(x=>[x.topic,`${x.mastery}%`])
 ]; return rows.map(row=>row.map(esc).join(',')).join('\n');
}
