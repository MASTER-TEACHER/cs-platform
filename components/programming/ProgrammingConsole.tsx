type Props = {
  stdout: string;
  stderr: string;
  error: string;
  running: boolean;
  durationMs?: number;
};

export default function ProgrammingConsole({
  stdout,
  stderr,
  error,
  running,
  durationMs,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <p className="font-black text-slate-950">Console</p>
        <p className="text-xs font-bold text-slate-500">
          {running
            ? "Running..."
            : typeof durationMs === "number"
              ? `${durationMs} ms`
              : "Ready"}
        </p>
      </div>

      <pre
        aria-live="polite"
        className="min-h-40 whitespace-pre-wrap break-words bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100"
      >
        {running
          ? "Python is running..."
          : error
            ? error
            : stderr
              ? stderr
              : stdout || "Program output will appear here."}
      </pre>
    </section>
  );
}
