export default function ProgrammingPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Live programming practice
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Python Programming
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          The browser-based Python editor, test cases, debugging challenges and
          auto-marked programming exercises are being prepared.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-8 text-center">
          <div className="text-5xl">💻</div>

          <h2 className="mt-4 text-2xl font-black text-blue-950">
            Programming workspace coming soon
          </h2>

          <p className="mt-3 text-blue-800">
            This area will support running Python code, console input and
            output, visible tests, hidden tests and saved submissions.
          </p>
        </div>
      </section>
    </div>
  );
}
