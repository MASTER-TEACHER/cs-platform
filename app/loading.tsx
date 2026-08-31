export default function RootLoading() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 p-6"
      role="status"
      aria-live="polite"
      aria-label="Loading CS Master"
    >
      <span className="sr-only">Loading...</span>
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-200" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
    </div>
  );
}