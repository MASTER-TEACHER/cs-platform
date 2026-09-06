import Link from "next/link";

const supportUrl = "https://donate.stripe.com/8x24gAgim71A55E0Vg4Vy00";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link href="/landing" className="text-xl font-black">CS MASTER</Link>
          <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-300">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Support CS Master</a>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
        </nav>

        <div className="flex min-h-[70vh] flex-col justify-center py-20">
          <p className="mb-4 inline-flex w-fit rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-200">🚀 CS Master v1.0 Public Beta</p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">Master Computer Science.</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">Curriculum-aligned learning, quizzes, programming, assessment, adaptive revision and teacher intelligence for GCSE and A-level Computer Science.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/register" className="rounded-xl bg-blue-600 px-8 py-4 text-center font-bold transition hover:bg-blue-700">Start Learning</Link>
            <Link href="/teacher-access" className="rounded-xl border border-white/20 px-8 py-4 text-center font-bold transition hover:bg-white/10">Teacher Access</Link>
            <Link href="/about" className="rounded-xl border border-white/20 px-8 py-4 text-center font-bold transition hover:bg-white/10">About CS Master</Link>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <FeatureCard icon="🧠" title="Learn & Practise" text="Structured curriculum pathways, interactive lessons, quizzes and exam-style practice." />
            <FeatureCard icon="💻" title="Programming & Revision" text="Programming practice, visualisers, revision planning and adaptive learning tools." />
            <FeatureCard icon="👩‍🏫" title="Teacher Intelligence" text="Assignments, assessment, analytics, interventions and curriculum-aware classroom workflows." />
          </div>

          <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
            <h2 className="text-3xl font-bold">One platform for Computer Science learning.</h2>
            <p className="mt-4 max-w-3xl text-blue-100">CS Master brings student learning and teacher workflows together, with exam-board-aware pathways and tools designed specifically for Computer Science.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing" className="rounded-xl bg-white px-6 py-3 font-black text-indigo-700">View pricing</Link>
              <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/30 px-6 py-3 font-black text-white">Support CS Master</a>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-400">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-white">About</Link><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
          <p className="mt-4">CS Master — Computer Science Learning Platform</p>
          <p className="mt-1">Built by Chris Brown · Version 1.0 Public Beta</p>
        </footer>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return <div className="rounded-2xl bg-white/10 p-6"><div className="text-4xl">{icon}</div><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-slate-300">{text}</p></div>;
}
