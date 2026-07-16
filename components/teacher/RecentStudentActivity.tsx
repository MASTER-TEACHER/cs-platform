import Card from "@/components/ui/Card";

type StudentActivity = {
  id: string;
  studentName: string;
  activity: string;
  result: string;
  time: string;
};

type RecentStudentActivityProps = {
  activities: StudentActivity[];
};

export default function RecentStudentActivity({
  activities,
}: RecentStudentActivityProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
        Recent Activity
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Student Activity
      </h2>

      {activities.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No recent student activity is available yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {activity.studentName}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {activity.activity}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-bold text-emerald-700">
                  {activity.result}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}