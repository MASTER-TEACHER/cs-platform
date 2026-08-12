import KnowledgeMapLegend from "@/components/knowledge-map/KnowledgeMapLegend";
import KnowledgeMapNode from "@/components/knowledge-map/KnowledgeMapNode";
import type { KnowledgeMap as KnowledgeMapType } from "@/types/knowledgeMap";

export default function KnowledgeMap({ map }: { map: KnowledgeMapType }) {
  return (
    <div className="space-y-10">
      <KnowledgeMapLegend />

      {map.units.map((unit) => (
        <section key={unit.id}>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
            Curriculum unit
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {unit.title}
          </h2>

          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {unit.topics.map((topic) => (
              <KnowledgeMapNode key={topic.definition.id} topic={topic} />
            ))}
          </div>
        </section>
      ))}

      {map.unclassifiedTopics.length > 0 && (
        <section>
          <h2 className="text-2xl font-black text-slate-950">Other evidence</h2>
          <p className="mt-2 text-sm text-slate-600">
            These labels could not yet be matched to the curriculum registry.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {map.unclassifiedTopics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="font-black text-slate-950">{topic.topic}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Mastery {topic.masteryScore}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
