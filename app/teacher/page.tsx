
export default function TeacherDashboard() {
  return (
   
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Teacher Dashboard 👨‍🏫
          </h1>
          <p className="mt-2 text-slate-600">
            Manage classes, assignments, and student progress.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Classes</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Students</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Assignments</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>
        </div>
      </div>

  );
}