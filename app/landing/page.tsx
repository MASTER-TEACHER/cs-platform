import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
        <p className="mb-4 inline-flex w-fit rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-200">
          🚀 CS Master v1.0 Public Beta
        </p>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
          Master GCSE Computer Science.
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
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

          <Link
            href="/"
            className="rounded-xl border border-white/20 px-8 py-4 text-center font-bold text-white transition hover:bg-white/10"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
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
        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
          <h2 className="text-3xl font-bold">
            Built for Computer Science learning.
          </h2>

          <p className="mt-4 max-w-3xl text-blue-100">
            CS Master supports students with clear explanations, practice
            questions, exam-style content, interactive challenges and
            personalised learning journeys.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Stat label="Live Topics" value="2+" />
            <Stat label="Progress System" value="XP" />
            <Stat label="Daily Missions" value="🎯" />
            <Stat label="Teacher Tools Coming" value="👩‍🏫" />
          </div>
        </div>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-slate-400">
          <p>CS Master — GCSE Computer Science Learning Platform</p>
          <p className="mt-2">Built by Chris Brown · Version 1.0 Public Beta</p>
        </footer>
      </section>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-blue-100">{label}</p>
    </div>
  );
}