type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function AchievementToast({ icon, title, description }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-yellow-300 bg-yellow-50 p-5 shadow-xl">
      <div className="text-5xl">{icon}</div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">
          Achievement Unlocked
        </p>

        <h3 className="mt-1 text-lg font-bold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}