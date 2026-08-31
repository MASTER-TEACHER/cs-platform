import Card from "@/components/ui/Card";
import { type TopicPerformance } from "@/hooks/useTeacherDashboard";

type TeacherInsightsProps = {
  averageScore: number;
  completionRate: number;
  activeAssignments: number;
  atRiskCount: number;
  strongestTopic: TopicPerformance | null;
  weakestTopic: TopicPerformance | null;
};

export default function TeacherInsights({
  averageScore,
  completionRate,
  activeAssignments,
  atRiskCount,
  strongestTopic,
  weakestTopic,
}: TeacherInsightsProps) {
  const insights: {
    icon: string;
    title: string;
    text: string;
  }[] = [];

  if (atRiskCount > 0) {
    insights.push({
      icon: "🔎",
      title: "Score snapshot requires review",
      text: `${atRiskCount} student${
        atRiskCount === 1 ? " is" : "s are"
      } currently below the dashboard score threshold. Confirm priority, evidence confidence and next action in Teacher Intelligence before opening a formal intervention.`,
    });
  } else {
    insights.push({
      icon: "✅",
      title: "No learners below the score snapshot threshold",
      text: "No students with recorded quiz results are currently below 50%. Continue to use Teacher Intelligence for evidence-weighted priority decisions.",
    });
  }

  if (weakestTopic) {
    insights.push({
      icon: "🎯",
      title: "Measured topic to inspect",
      text: `${weakestTopic.topic} is currently the weakest score-based dashboard area at ${weakestTopic.averageScore}%. Use the Knowledge Map and Teacher Intelligence before deciding whether reteaching is required.`,
    });
  }

  if (completionRate < 70) {
    insights.push({
      icon: "📋",
      title: "Review assignment completion",
      text: `The current completion rate is ${completionRate}%. Incomplete work can reduce confidence in attainment conclusions, so review outstanding work before escalating curriculum concerns.`,
    });
  } else {
    insights.push({
      icon: "📈",
      title: "Strong assignment engagement",
      text: `Students have completed ${completionRate}% of expected assignment submissions.`,
    });
  }

  return (
    <Card className="border-0 bg-slate-900 text-white">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
        Operational snapshot
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Supporting dashboard context
      </h2>

      <p className="mt-2 text-slate-300">
        These score and completion indicators provide context only. Teacher
        Intelligence remains the source of truth for formal learner priority,
        intervention and curriculum decisions.
      </p>

      <div className="mt-6 space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="rounded-2xl border border-slate-700 bg-slate-800 p-5"
          >
            <div className="flex gap-3">
              <span className="text-2xl">{insight.icon}</span>

              <div>
                <p className="font-bold text-white">{insight.title}</p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {insight.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-teal-500/10 p-5">
        <p className="font-bold text-teal-200">Current operational snapshot</p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Average score: {averageScore}% · Active assignments:{" "}
          {activeAssignments}
          {strongestTopic
            ? ` · Strongest measured area: ${strongestTopic.topic}`
            : ""}
        </p>
      </div>
    </Card>
  );
}
