import Link from "next/link";

const plans = [
  {
    name: "Teacher Trial",
    description:
      "Explore the teacher workspace, assignments, analytics and CS Master classroom workflows before choosing a school plan.",
    features: [
      "Teacher dashboard",
      "Assignment Centre",
      "Student progress monitoring",
      "Quiz and lesson assignment workflows",
    ],
    action: "Start teacher access",
    href: "/teacher-access",
  },
  {
    name: "School",
    description:
      "For Computer Science departments that want curriculum-aligned learning, assessment and teacher intelligence in one workspace.",
    features: [
      "Teacher and student accounts",
      "Curriculum and exam-board pathways",
      "Interactive lessons and quizzes",
      "Assignment and markbook workflows",
      "Teacher analytics and interventions",
      "Exam and programming tools",
    ],
    action: "Explore teacher access",
    href: "/teacher-access",
    featured: true,
  },
  {
    name: "Multi-class / Department",
    description:
      "Designed for departments that need CS Master across multiple classes and year groups.",
    features: [
      "Multiple classes",
      "Centralised teacher workflows",
      "Progress and attainment intelligence",
      "Assignment reporting",
      "Curriculum coverage visibility",
    ],
    action: "Get started",
    href: "/teacher-access",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-bold text-blue-200 transition hover:text-white"
          >
            ← Back to CS Master
          </Link>

          <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            CS Master for schools
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
            Computer Science learning, assessment and teacher intelligence in
            one platform.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            Choose the level of access that fits your department. School
            licensing and final commercial arrangements can be confirmed
            before activation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-3xl border bg-white p-7 shadow-sm ${
                plan.featured
                  ? "border-indigo-400 ring-2 ring-indigo-100"
                  : "border-slate-200"
              }`}
            >
              {plan.featured && (
                <span className="mb-5 w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-indigo-700">
                  School workspace
                </span>
              )}

              <h2 className="text-2xl font-black text-slate-950">
                {plan.name}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm font-semibold text-slate-700"
                  >
                    <span
                      className="mt-0.5 text-emerald-600"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-black transition ${
                  plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                {plan.action}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-7">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            School licensing
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Need access for your department?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-700">
            CS Master can support individual Computer Science classes through
            to wider departmental use. Final plan configuration and licensing
            can be agreed around the number of teachers, students and classes
            required.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/teacher-access"
              className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
            >
              Teacher access →
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-blue-300 bg-white px-6 py-3 font-black text-blue-700 transition hover:bg-blue-100"
            >
              Existing user login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}