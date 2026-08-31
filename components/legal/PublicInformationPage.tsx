import Link from "next/link";
import type { ReactNode } from "react";

type Section = {
  title: string;
  content: ReactNode;
};

export default function PublicInformationPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <nav
          aria-label="Public information"
          className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-600"
        >
          <Link href="/landing" className="text-blue-700">CS Master</Link>
          <Link href="/about">About</Link>
          <Link href="/help">Help</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-7 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">{intro}</p>
          </header>

          <div className="space-y-8 p-7 sm:p-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black text-slate-950">{section.title}</h2>
                <div className="mt-3 space-y-3 leading-7 text-slate-700">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}