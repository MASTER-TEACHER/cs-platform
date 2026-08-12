import type {
  ClassKnowledgeMap,
  ClassKnowledgeMapTopic,
} from "@/types/knowledgeMap";

function barClass(value: number) {
  if (value < 40) return "bg-red-500";
  if (value < 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function Row({
  topic,
  studentCount,
}: {
  topic: ClassKnowledgeMapTopic;
  studentCount: number;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className="p-4">
        <p className="font-black text-slate-950">{topic.topicTitle}</p>
        <p className="mt-1 text-xs text-slate-500">{topic.unitTitle}</p>
      </td>

      <td className="p-4">
        <div className="min-w-[220px]">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>{topic.classAverage}%</span>
            <span className="text-slate-500">
              {topic.assessedStudents}/{studentCount}
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${barClass(topic.classAverage)}`}
              style={{ width: `${topic.classAverage}%` }}
            />
          </div>
        </div>
      </td>

      <td className="p-4 font-bold">{topic.averageConfidence}%</td>
      <td className="p-4 font-bold text-red-700">{topic.priorityStudents}</td>
      <td className="p-4 font-bold text-emerald-700">{topic.secureStudents}</td>
    </tr>
  );
}

export default function ClassHeatMap({ map }: { map: ClassKnowledgeMap }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b bg-slate-50 text-left">
            <th className="p-4">Topic</th>
            <th className="p-4">Class mastery</th>
            <th className="p-4">Confidence</th>
            <th className="p-4">Priority students</th>
            <th className="p-4">Secure students</th>
          </tr>
        </thead>

        <tbody>
          {map.topics.map((topic) => (
            <Row
              key={topic.topicId}
              topic={topic}
              studentCount={map.studentCount}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
