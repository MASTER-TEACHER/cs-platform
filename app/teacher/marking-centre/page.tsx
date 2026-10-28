import MarkingCentreWorkspace from "@/components/marking-centre/MarkingCentreWorkspace";
export default async function Page({ searchParams }: { searchParams: Promise<{ examId?: string }> }) {
  const query = await searchParams;
  return <MarkingCentreWorkspace section="overview" initialExamId={query.examId}/>;
}
