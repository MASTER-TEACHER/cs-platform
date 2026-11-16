import "server-only";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireStudent, studentError } from "@/lib/question-bank/studentAccess";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await requireStudent(request);

    const snapshot = await adminDb
      .collection("users")
      .doc(actor.uid)
      .collection("questionBankAttempts")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();

    const attempts = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        questionCount: data.questionCount || 0,
        markingStatus: data.markingStatus || "self-review",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json(
      { attempts },
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