import Card from "@/components/ui/Card";

type AtRiskStudent = {
  id: string;
  name: string;
  weakTopic: string;
  averageScore: number;
  recommendedAction: string;
};

type AtRiskStudentsProps = {
  students: AtRiskStudent[];
};

export default function AtRiskStudents({
  students,
}: AtRiskStudentsProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
        Intervention
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Students Needing Support
      </h2>

      {students.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No students currently need targeted support.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-red-200 bg-red-50 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {student.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Weak topic:{" "}
                    <span className="font-semibold text-red-700">
                      {student.weakTopic}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-white px-4 py-2 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Average Score
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-700">
                    {student.averageScore}%
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Recommended action
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {student.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}