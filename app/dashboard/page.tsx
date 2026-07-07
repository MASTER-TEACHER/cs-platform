import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-200">
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

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">🧠</div>
            <h2 className="mt-4 text-xl font-bold">Interactive Lessons</h2>
            <p className="mt-2 text-slate-300">
              Learn binary, hexadecimal and core GCSE topics through structured
              lesson pathways.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">🎮</div>
            <h2 className="mt-4 text-xl font-bold">Live Simulators</h2>
            <p className="mt-2 text-slate-300">
              Practise with binary and hexadecimal simulators that make abstract
              concepts visual and interactive.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">🏆</div>
            <h2 className="mt-4 text-xl font-bold">XP and Badges</h2>
            <p className="mt-2 text-slate-300">
              Earn XP, unlock achievements, complete missions and track your
              progress over time.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Built for Computer Science learning.</h2>

          <p className="mt-4 max-w-3xl text-blue-100">
            CS Master is designed to support students with clear explanations,
            practice questions, exam-style content and personalised learning
            journeys.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">2+</p>
              <p className="text-blue-100">Live Topics</p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">XP</p>
              <p className="text-blue-100">Progress System</p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">🎯</p>
              <p className="text-blue-100">Daily Missions</p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">👩‍🏫</p>
              <p className="text-blue-100">Teacher Tools Coming</p>
            </div>
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