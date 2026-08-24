import Link from "next/link";

export default function TeacherNotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-600">Teacher workspace</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The teacher page or record you requested is unavailable.</p>
      <Link href="/teacher" className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 font-black text-white">
        Back to teacher dashboard
      </Link>
    </div>
  );
}
