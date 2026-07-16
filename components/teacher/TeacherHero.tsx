import Card from "@/components/ui/Card";

type TeacherHeroProps = {
  name: string;
};

export default function TeacherHero({
  name,
}: TeacherHeroProps) {
  return (
    <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
      <p className="font-semibold text-emerald-100">
        👩‍🏫 Teacher Dashboard
      </p>

      <h1 className="mt-3 text-4xl font-extrabold">
        Welcome back, {name}
      </h1>

      <p className="mt-4 max-w-2xl text-emerald-100">
        Monitor student progress, analyse quiz performance and support learners
        with targeted interventions.
      </p>
    </Card>
  );
}