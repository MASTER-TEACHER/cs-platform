import Card from "./Card";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import Link from "next/link";

type CourseCardProps = {
  title: string;
  description: string;
  level: string;
  progress: number;
  duration: string;
  difficulty: string;
  href: string;
};

export default function CourseCard({
  title,
  description,
  level,
  progress,
  duration,
  difficulty,
  href
}: CourseCardProps) {
  return (
    <Card className="flex h-full min-h-[340px] flex-col justify-between">

      <div>

        <div className="flex items-start justify-between gap-4">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <Badge text={level} />

        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
  {description}
</p>

        <div className="mt-6 space-y-2">

          <div className="flex justify-between text-sm">

            <span>Progress</span>

            <span>{progress}%</span>

          </div>

          <ProgressBar value={progress} />

        </div>

        <div className="mt-6 flex justify-between text-sm text-slate-500">

          <span>⏱ {duration}</span>

          <span>⭐ {difficulty}</span>

        </div>

      </div>

      <div className="mt-6">

        <Link href={href}>
  <Button>
    Continue Learning →
  </Button>
</Link>

      </div>

    </Card>
  );
}