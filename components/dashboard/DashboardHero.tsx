import Card from "@/components/ui/Card";

type DashboardHeroProps = {
  name: string;
  xp: number;
  streak: number;
  badges: number;
};

export default function DashboardHero({
  name,
  xp,
  streak,
  badges,
}: DashboardHeroProps) {
  return (
    <Card className="border-0 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 text-white">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-blue-200 font-semibold">
            Welcome back 👋
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            {name}
          </h1>

          <p className="mt-3 max-w-xl text-blue-100">
            Continue your Computer Science journey and keep building your XP.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">

          <div className="rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-sm text-blue-200">
              ⭐ XP
            </p>

            <p className="mt-2 text-3xl font-bold">
              {xp}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-sm text-blue-200">
              🔥 Streak
            </p>

            <p className="mt-2 text-3xl font-bold">
              {streak}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-sm text-blue-200">
              🏆 Badges
            </p>

            <p className="mt-2 text-3xl font-bold">
              {badges}
            </p>
          </div>

        </div>
      </div>
    </Card>
  );
}