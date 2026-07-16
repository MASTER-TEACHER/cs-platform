import StatCard from "@/components/dashboard/StatCard";

type TeacherStatsProps = {
  students: number;
  averageScore: number;
  lessonsCompleted: number;
  atRiskStudents: number;
};

export default function TeacherStats({
  students,
  averageScore,
  lessonsCompleted,
  atRiskStudents,
}: TeacherStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Students"
        value={students.toString()}
        icon="👨‍🎓"
      />

      <StatCard
        title="Average Quiz"
        value={`${averageScore}%`}
        icon="📊"
      />

      <StatCard
        title="Lessons Completed"
        value={lessonsCompleted.toString()}
        icon="📚"
      />

      <StatCard
        title="Students At Risk"
        value={atRiskStudents.toString()}
        icon="⚠️"
      />
    </div>
  );
}