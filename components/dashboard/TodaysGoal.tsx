import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function TodaysGoal() {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Today's Goal
      </p>

      <h2 className="mt-3 text-2xl font-bold text-slate-900">
        Complete 2 Binary Challenges
      </h2>

      <p className="mt-3 text-slate-600">
        Finish today's goal to earn an extra
        <span className="font-semibold text-blue-600"> +100 XP</span>.
      </p>

      <div className="mt-6">
        <Button>
          Start Learning →
        </Button>
      </div>
    </Card>
  );
}