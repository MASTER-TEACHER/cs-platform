import Link from "next/link";

const studentPlans = [
  { name: "Free Individual", price: "£0", period: "forever", description: "Core Computer Science learning and basic practice with no subscription required.", features: ["Curriculum learning", "Core quizzes and practice", "Exam-board-aware pathways", "Progress tracking"], action: "Create free account", href: "/register" },
  { name: "Student Premium Monthly", price: "£6.99", period: "/month", description: "Flexible monthly access to the complete individual student platform.", features: ["Full GCSE and A-level curriculum", "Adaptive Learning and AI Tutor", "Exam Trainer and Exam Mode", "Full programming practice", "Knowledge Map and revision planning", "Detailed analytics and feedback"], action: "Get Premium", href: "/register", featured: true },
  { name: "Student Premium Annual", price: "£59.99", period: "/year", description: "The complete Premium experience at the best individual value.", features: ["Everything in Student Premium Monthly", "One annual payment", "Equivalent to about £5/month", "Manage or cancel through Stripe Billing Portal"], action: "Get annual Premium", href: "/register" },
];

const schoolPlans = [
  { name: "School Starter", price: "£499", period: "/year", description: "For smaller departments starting with CS Master.", features: ["Up to 100 student seats", "Full Student Premium access for licensed students", "Teacher workspace", "Classes, assignments and analytics", "Curriculum and programming tools"] },
  { name: "School Standard", price: "£999", period: "/year", description: "For most secondary-school Computer Science departments.", features: ["Up to 300 student seats", "Everything in School Starter", "Full teacher intelligence", "Exam Mode and integrity monitoring", "Interventions and reporting", "AI Tutor and adaptive learning"], featured: true },
  { name: "School Pro", price: "£1,499", period: "/year", description: "For larger schools, trusts and high-usage departments.", features: ["Up to 1,000 student seats", "Everything in School Standard", "Full CS Master platform", "Advanced analytics and interventions", "Large-scale licence capacity", "Priority commercial support"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl"><Link href="/landing" className="text-sm font-bold text-blue-200 hover:text-white">← Back to CS Master</Link><p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Simple, transparent access</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">Choose the CS Master access that fits you.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">Start free as an individual student, unlock Premium when you need advanced tools, or license CS Master for your school.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Header eyebrow="Individual students" title="Learn for free. Upgrade when you want more." />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">{studentPlans.map((p) => <Plan key={p.name} {...p} />)}</div>

        <div className="mt-16"><Header eyebrow="Schools" title="Whole-department Computer Science access." /></div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">{schoolPlans.map((p) => <Plan key={p.name} {...p} action="Teacher & school access" href="/teacher-access" />)}</div>

        <div className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-7"><h2 className="text-2xl font-black">Already have an account?</h2><p className="mt-2 text-slate-700">Individual Premium is purchased from the Upgrade page after login. School billing is managed from the authorised teacher workspace.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/login" className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white">Login</Link><Link href="/about" className="rounded-xl border border-blue-300 bg-white px-6 py-3 font-black text-blue-700">About CS Master</Link></div></div>
      </section>
    </main>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) { return <div><p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">{eyebrow}</p><h2 className="mt-2 text-3xl font-black text-slate-950">{title}</h2></div>; }
function Plan({ name, price, period, description, features, action, href, featured = false }: { name: string; price: string; period: string; description: string; features: string[]; action: string; href: string; featured?: boolean }) { return <article className={`flex flex-col rounded-3xl border bg-white p-7 shadow-sm ${featured ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"}`}>{featured && <span className="mb-4 w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase text-indigo-700">Popular</span>}<h3 className="text-xl font-black">{name}</h3><div className="mt-3"><span className="text-4xl font-black">{price}</span><span className="font-bold text-slate-500">{period}</span></div><p className="mt-4 leading-7 text-slate-600">{description}</p><ul className="mt-6 flex-1 space-y-3">{features.map((f) => <li key={f} className="flex gap-3 text-sm font-semibold text-slate-700"><span className="text-emerald-600">✓</span><span>{f}</span></li>)}</ul><Link href={href} className={`mt-8 flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-black ${featured ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-300 hover:bg-slate-50"}`}>{action}</Link></article>; }
