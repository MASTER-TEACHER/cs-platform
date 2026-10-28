import { notFound } from "next/navigation";
import MarkingCentreWorkspace from "@/components/marking-centre/MarkingCentreWorkspace";
const valid = ["setup", "candidates", "structures", "marking", "results"] as const;
export default async function Page({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ examId?: string }> }) {
  const [{ section }, query] = await Promise.all([params, searchParams]);
  if (!valid.some(value => value === section)) notFound();
  return <MarkingCentreWorkspace section={section as typeof valid[number]} initialExamId={query.examId}/>;
}
