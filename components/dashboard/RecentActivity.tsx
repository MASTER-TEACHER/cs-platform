const activities = [
  "Completed Binary Quiz",
  "Started Sorting Algorithms",
  "Scored 8/10 on CPU Quiz",
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Recent Activity
      </h2>

      <ul className="mt-4 space-y-3">
        {activities.map((activity) => (
          <li key={activity} className="text-sm text-slate-600">
            ✅ {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}