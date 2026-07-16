import Card from "@/components/ui/Card";

type TopStudent = {
  id: string;
  name: string;
  xp: number;
  streak: number;
  badges: number;
};

type TopStudentsProps = {
  students: TopStudent[];
};

export default function TopStudents({ students }: TopStudentsProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
        Leaderboard
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Top Students
      </h2>

      {students.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No leaderboard data is available yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
                  {index + 1}
                </div>

                <div>
                  <p className="font-bold text-slate-900">{student.name}</p>

                  <p className="mt-1 text-sm text-slate-600">
                    ⭐ {student.xp} XP
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-sm font-semibold text-slate-700">
                <span className="rounded-xl bg-white px-3 py-2">
                  🔥 {student.streak}
                </span>

                <span className="rounded-xl bg-white px-3 py-2">
                  🏆 {student.badges}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}