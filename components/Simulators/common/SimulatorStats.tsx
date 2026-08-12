type Props = {
  attempts: number;
  correct: number;
  accuracy: number;
  xp: number;
  streak: number;
};

export default function SimulatorStats({
  attempts,
  correct,
  accuracy,
  xp,
  streak,
}: Props) {
  const stats = [
    {
      label: "Questions",
      value: attempts.toString(),
    },
    {
      label: "Correct",
      value: correct.toString(),
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
    },
    {
      label: "XP",
      value: xp.toString(),
    },
    {
      label: "Streak",
      value: `🔥 ${streak}`,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950">
            {stat.value}
          </p>
        </article>
      ))}
    </section>
  );
}
