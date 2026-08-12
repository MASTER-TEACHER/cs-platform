type Props = {
  attempts: number;
  correct: number;
  accuracy: number;
  xp: number;
  streak: number;
  bestStreak: number;
};

export default function ProgrammingStats({
  attempts,
  correct,
  accuracy,
  xp,
  streak,
  bestStreak,
}: Props) {
  const stats = [
    ["Attempts", attempts.toString()],
    ["Correct", correct.toString()],
    ["Accuracy", `${accuracy}%`],
    ["XP", xp.toString()],
    ["Streak", `${streak}`],
    ["Best streak", `${bestStreak}`],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {stats.map(([label, value]) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {value}
          </p>
        </article>
      ))}
    </section>
  );
}
