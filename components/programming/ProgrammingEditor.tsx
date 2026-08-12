"use client";

type Props = {
  code: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function ProgrammingEditor({
  code,
  onChange,
  disabled = false,
}: Props) {
  const lineCount = Math.max(1, code.split("\n").length);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div>
          <p className="font-black text-white">Python editor</p>
          <p className="text-xs text-slate-400">
            {lineCount} line{lineCount === 1 ? "" : "s"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">
          Python
        </span>
      </div>

      <textarea
        value={code}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        spellCheck={false}
        aria-label="Python code editor"
        className="min-h-[390px] w-full resize-y bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 outline-none disabled:opacity-60"
      />
    </section>
  );
}
