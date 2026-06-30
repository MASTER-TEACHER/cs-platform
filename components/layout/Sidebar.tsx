import Link from "next/link";
import LogoutButton from "@/components/layout/LogoutButton";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/visualisers", label: "Visualisers" },
  { href: "/exam", label: "Exam Mode" },
  { href: "/teacher", label: "Teacher" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">CS Master</h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <LogoutButton />
    </aside>
  );
}