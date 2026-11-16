import "server-only";

import { NextResponse } from "next/server";
import { requireStudent, studentError } from "@/lib/question-bank/studentAccess";
import { getStudentCatalogue } from "@/lib/question-bank/studentCatalogue";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireStudent(request);

    const url = new URL(request.url);
    const subject = url.searchParams.get("subject") || "";
    const qualification = url.searchParams.get("qualification") || "";
    const examBoard = url.searchParams.get("examBoard") || "";
    const topic = url.searchParams.get("topic") || "";

    const catalogue = getStudentCatalogue();

    const filtered = catalogue.filter(q =>
      (!subject || q.subject === subject) &&
      (!qualification || q.qualification === qualification) &&
      (!examBoard || q.examBoard === examBoard) &&
      (!topic || q.topic === topic)
    );

    return NextResponse.json(
      { questions: filtered, count: filtered.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const result = studentError(error);
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }
}