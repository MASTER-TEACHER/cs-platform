import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Props = {
  name: string;
};

export default function WelcomeBanner({ name }: Props) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
      <Badge>🔥 3 Day Streak</Badge>

      <h1 className="mt-5 text-4xl font-bold">
        Welcome back, {name}!
      </h1>

      <p className="mt-3 text-blue-100 text-lg">
        Ready to master Computer Science today?
      </p>
    </Card>
  );
}