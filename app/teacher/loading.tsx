export default function TeacherLoading() {
  return (
    <div className="space-y-6" aria-label="Loading teacher workspace">
      <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-200" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
    </div>
  );
}
