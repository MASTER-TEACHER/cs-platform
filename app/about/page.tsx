import Link from "next/link";

const supportUrl = "https://donate.stripe.com/8x24gAgim71A55E0Vg4Vy00";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/landing" className="text-sm font-bold text-blue-200 hover:text-white">← Back to CS Master</Link>
          <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">About CS Master</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">Built to help students learn Computer Science — and teachers teach it.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">CS Master is a Computer Science learning, practice, assessment and teacher-intelligence platform designed for secondary education.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">What CS Master is about</h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-700">CS Master brings curriculum learning, retrieval practice, programming, exam preparation and progress information into one place. Students can follow GCSE and A-level Computer Science pathways aligned to their selected exam board, while teachers can set work, review evidence, identify gaps and support students from a dedicated teacher workspace.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2">
          <Info title="For students" items={["Structured GCSE and A-level curriculum pathways", "Lessons, quizzes and exam-style practice", "Programming practice and visual learning tools", "Adaptive learning, revision planning and knowledge mapping", "AI-supported learning and detailed progress insight", "Exam Mode and assessment preparation"]} />
          <Info title="For teachers and schools" items={["Classes, students and assignment workflows", "Quiz, lesson, programming and written-exam assignments", "Analytics, knowledge maps and intervention tools", "Curriculum and exam-board visibility", "AI-assisted resource and quiz workflows", "School licensing with centralised teacher tools"]} />
        </div>

        <article className="rounded-3xl border border-indigo-200 bg-indigo-50 p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Why it was created</p>
          <h2 className="mt-2 text-2xl font-black">Computer Science deserves a platform built around the subject.</h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-700">CS Master has been developed by a Computer Science teacher to bring together the tools students and teachers repeatedly need: clear curriculum pathways, meaningful practice, programming, assessment, feedback and actionable progress information. The Public Beta will continue to improve as the platform is used in real learning and teaching contexts.</p>
        </article>

        <article id="support" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Support CS Master</p>
          <h2 className="mt-2 text-3xl font-black">Help support continued development.</h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-700">CS Master is being independently developed to provide high-quality Computer Science learning, assessment and teaching tools. If you find the platform useful and would like to support its continued development and running costs, you can make an optional contribution.</p>
          <p className="mt-3 max-w-4xl font-semibold leading-7 text-slate-700">Support payments are entirely voluntary. They do not purchase Premium, change your subscription, provide additional platform access or replace a school licence.</p>
          <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-black text-white transition hover:bg-emerald-800">Support CS Master via Stripe →</a>
        </article>

        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white">Create an account</Link>
          <Link href="/pricing" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black">View pricing</Link>
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black">Existing user login</Link>
        </div>
      </section>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">{title}</h2><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-slate-700"><span className="font-black text-emerald-600">✓</span><span>{item}</span></li>)}</ul></article>;
}
