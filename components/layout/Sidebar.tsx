import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/layout/LogoutButton";

const links = [
  { href: "/dashboard", label: "🏠 Dashboard" },
  { href: "/learn", label: "📚 Learn" },
  { href: "/quiz", label: "📝 Quiz" },
  { href: "/visualisers", label: "🧠 Visualisers" },
  { href: "/exam", label: "🎯 Exam Mode" },
  { href: "/teacher", label: "👩‍🏫 Teacher" },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-900 text-white shadow-2xl">

      {/* Logo */}
      <div className="border-b border-slate-800 p-6">

        <Link href="/dashboard">

          <div className="flex cursor-pointer flex-col items-center">

            <Image
              src="/logo.png"
              alt="CS Master Logo"
              width={180}
              height={180}
              priority
              className="rounded-xl"
            />

            <h1 className="mt-4 text-2xl font-extrabold tracking-wide">
              CS MASTER
            </h1>

            <p className="mt-1 text-center text-sm text-slate-400">
              Learn • Practice • Master
            </p>

          </div>

        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6">

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all hover:bg-blue-600 hover:text-white"
          >
            {link.label}
          </Link>
        ))}

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-6">

        <LogoutButton />

        <p className="mt-6 text-center text-xs text-slate-500">
          CS Master v1.0
        </p>

      </div>

    </aside>
  );
}