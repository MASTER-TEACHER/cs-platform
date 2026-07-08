import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="CS Master Logo"
            width={56}
            height={56}
            priority
            className="rounded-xl"
          />
          <div>
            <p className="text-lg font-extrabold tracking-wide">CS MASTER</p>
            <p className="text-xs text-slate-400">Learn • Practice • Master</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex">
          <Link href="/login" className="hover:text-white">
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >
            Start Learning
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-5 inline-flex w-fit rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-200">
            🚀 CS Master v1.0 Public Beta
          </p>

          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            Master GCSE Computer Science.
          </h1>

          <p className="mt-6 text-xl leading-8 text-slate-300">
            Interactive lessons, live simulators, XP, badges, progress tracking
            and personalised learning journeys for Computer Science students.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-8 py-4 text-center font-bold text-white transition hover:bg-blue-700"
            >
              Start Learning
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-8 py-4 text-center font-bold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/10 p-6 shadow-2xl">
          <Image
            src="/logo.png"
            alt="CS Master preview"
            width={640}
            height={640}
            priority
            className="rounded-[1.5rem]"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 md:grid-cols-3">
        <FeatureCard
          icon="🧠"
          title="Interactive Lessons"
          text="Learn binary, hexadecimal and GCSE Computer Science topics through structured lesson pathways."
        />

        <FeatureCard
          icon="🎮"
          title="Live Simulators"
          text="Practise using binary and hexadecimal simulators that make abstract ideas visual."
        />

        <FeatureCard
          icon="🏆"
          title="XP and Badges"
          text="Earn XP, unlock achievements, complete missions and track your learning progress."
        />
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/10 px-6 py-8 text-sm text-slate-400">
        <p>CS Master — GCSE Computer Science Learning Platform</p>
        <p className="mt-2">Built by Chris Brown · Version 1.0 Public Beta</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-6">
      <div className="text-4xl">{icon}</div>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-300">{text}</p>
    </div>
  );
}