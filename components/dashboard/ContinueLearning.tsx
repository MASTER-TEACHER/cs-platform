const topics = [
  { title: "Binary Numbers", progress: "80%" },
  { title: "Sorting Algorithms", progress: "65%" },
  { title: "Trace Tables", progress: "40%" },
];

export default function ContinueLearning() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Continue Learning
      </h2>

      <div className="mt-4 space-y-4">
        {topics.map((topic) => (
          <div key={topic.title}>
            <div className="flex justify-between text-sm">
              <span>{topic.title}</span>
              <span>{topic.progress}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: topic.progress }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}