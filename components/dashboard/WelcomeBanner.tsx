import Card from "@/components/ui/Card";

type Props = {
  name: string;
};

export default function WelcomeBanner({ name }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
        🔥 3 Day Streak
      </div>

      <h1 className="mt-6 text-4xl font-bold">Welcome back, {name}!</h1>

      <p className="mt-3 text-lg text-blue-100">
        Keep building your Computer Science mastery today.
      </p>
    </Card>
  );
}