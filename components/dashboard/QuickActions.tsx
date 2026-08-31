import Link from "next/link";

import Card from "@/components/ui/Card";
import type { StudentJourneyMission } from "@/services/studentJourneyService";

type Props = {
  mission: StudentJourneyMission | null;
};

const actionClass =
  "block w-full rounded-xl border p-4 text-left font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100";

export default function QuickActions({ mission }: Props) {
  return (
    <Card>
      <h2 className="text-2xl font-bold">Quick Actions</h2>

      <p className="mt-2 text-sm text-slate-500">
        Shortcuts follow your active curriculum and current learning plan.
      </p>

      <div className="mt-6 space-y-4">
        <Link
          href={mission?.href || "/learn"}
          className={actionClass}
        >
          📚 {mission ? `Continue ${mission.lesson}` : "Open Learn"}
        </Link>

        <Link href="/quiz" className={actionClass}>
          📝 Take a curriculum quiz
        </Link>

        <Link href="/adaptive-learning" className={actionClass}>
          🎯 Review adaptive learning plan
        </Link>
      </div>
    </Card>
  );
}
