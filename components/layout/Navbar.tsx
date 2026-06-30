import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">CS Master</h1>

      <div className="flex gap-6 text-sm">
        <Link href="/">Dashboard</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/quiz">Quiz</Link>
      </div>
    </nav>
  );
}