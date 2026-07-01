import Card from "@/components/ui/Card";

type Props = {
  title: string;
  value: string;
  icon: string;
};

export default function StatCard({ title, value, icon }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
        </div>

        <div className="text-4xl">{icon}</div>
      </div>
    </Card>
  );
}