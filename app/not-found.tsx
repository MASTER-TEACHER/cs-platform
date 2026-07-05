import Link from "next/link";
import Card from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="max-w-xl text-center">
        <div className="text-6xl">🧭</div>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-slate-600">
          This page does not exist or may have moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </Card>
    </div>
  );
}