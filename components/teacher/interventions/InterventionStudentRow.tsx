import Link from "next/link";
import type { InterventionCandidate } from "@/services/interventionAnalyticsService";
export default function InterventionStudentRow({
  candidate,
  onCreate,
}: {
  candidate: InterventionCandidate;
  onCreate: (candidate: InterventionCandidate) => void;
}) {
  const tone =
    candidate.priority === "high"
      ? "bg-red-100 text-red-700"
      : candidate.priority === "medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";
  return (
    <tr className="border-b align-top">
      <td className="p-4">
        <p className="font-black">{candidate.student.name}</p>
        <p className="text-xs text-slate-500">{candidate.student.email}</p>
        <p className="text-xs text-slate-500">{candidate.className}</p>
      </td>
      <td className="p-4">
        <p className="font-black">{candidate.combinedAverage}%</p>
        <p className="text-xs text-slate-500">
          Grade {candidate.predictedGrade}
        </p>
      </td>
      <td className="p-4">
        <p className="font-bold">{candidate.priorityTopic}</p>
        <p className="text-xs text-slate-500">
          {candidate.priorityTopicScore}%
        </p>
      </td>
      <td className="p-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${tone}`}
        >
          {candidate.priority}
        </span>
        <p className="mt-2 text-xs text-slate-500">
          Trend {candidate.improvementTrend >= 0 ? "+" : ""}
          {candidate.improvementTrend}%
        </p>
      </td>
      <td className="p-4">
        <p className="text-sm">{candidate.recommendation}</p>
        <p className="mt-2 text-xs text-slate-500">
          {candidate.overdueAssignments} overdue · {candidate.awaitingMarking}{" "}
          awaiting marking
        </p>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onCreate(candidate)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
          >
            Create Intervention
          </button>
          <Link
            href={`/teacher/students/${candidate.student.uid}`}
            className="rounded-xl border px-4 py-2 text-center text-sm font-bold"
          >
            View Analytics
          </Link>
        </div>
      </td>
    </tr>
  );
}
