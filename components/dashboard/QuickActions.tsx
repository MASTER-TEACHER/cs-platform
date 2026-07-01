import Card from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card>
      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 space-y-4">

        <button className="w-full rounded-xl border p-4 text-left hover:bg-slate-50 transition">
          📚 Continue Last Lesson
        </button>

        <button className="w-full rounded-xl border p-4 text-left hover:bg-slate-50 transition">
          📝 Take a Quiz
        </button>

        <button className="w-full rounded-xl border p-4 text-left hover:bg-slate-50 transition">
          🎮 Practice Binary
        </button>

      </div>
    </Card>
  );
}