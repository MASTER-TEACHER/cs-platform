import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ examId: string }> };

async function ownedExam(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { ref, examId };
}

export async function GET(request: Request, context: Context) {
  try {
    const { ref } = await ownedExam(request, context);
    const snapshot = await ref.collection("candidates").limit(1000).get();
    const candidates = snapshot.docs.map(doc => ({ code: doc.id, ...doc.data(), createdAt: undefined }));
    candidates.sort((a, b) => String(a.code).localeCompare(String(b.code)));
    return NextResponse.json({ candidates }, { headers });
  } catch (error) { const result = centreError(error); return NextResponse.json({ error: result.error }, { status: result.status, headers }); }
}

export async function POST(request: Request, context: Context) {
  try {
    const { ref } = await ownedExam(request, context);
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("CENTRE_INVALID");
    }

    const input = body as Record<string, unknown>;
    const imported = input.codes;
    const count = input.count;

    let codes: string[] = [];

    if (Array.isArray(imported)) {
      if (imported.length < 1 || imported.length > 100 ||
          !imported.every(value => typeof value === "string")) {
        throw new Error("CENTRE_INVALID");
      }

      codes = imported.map(value => value.trim().toUpperCase());

      if (codes.some(code =>
          !/^(?:[0-9]{4}|[0-9]{6}|[A-Z0-9][A-Z0-9_-]{2,31})$/.test(code)
      )) {
        throw new Error("CENTRE_INVALID");
      }

      if (new Set(codes).size !== codes.length) {
        throw new Error("CENTRE_INVALID");
      }
    } else {
      const digits = input.digits === undefined ? 6 : input.digits;

      if (digits !== 4 && digits !== 6) {
        throw new Error("CENTRE_INVALID");
      }

      if (typeof count !== "number" ||
          !Number.isInteger(count) ||
          count < 1 || count > 100) {
        throw new Error("CENTRE_LIMIT");
      }

      // Random candidate identifiers, including leading zeros.
      // Candidate uniqueness is enforced by Firestore transactions.
      const maximum = 10 ** digits;
      const generated = new Set<string>();

      while (generated.size < count) {
        generated.add(
          String(randomInt(maximum)).padStart(digits, "0")
        );
      }

      codes = [...generated];
    }

    const importing = Array.isArray(imported);
    let created: string[] = [];
    let skipped: string[] = [];
    await ref.firestore.runTransaction(async transaction => {
      const exam = await transaction.get(ref);

      if (!exam.exists) throw new Error("CENTRE_NOT_FOUND");

      const currentCount = exam.data()?.candidateCount ?? 0;

      const refs = codes.map(code =>
        ref.collection("candidates").doc(code)
      );

      // Read before writing, as required by Firestore transactions.
      const existing = await transaction.getAll(...refs);
      const existingCodes = new Set(existing.filter(doc => doc.exists).map(doc => doc.id));

      // Imported school codes: codes already registered are skipped (never overwritten) and the
      // rest are added. Randomly generated codes must all be new, so a clash asks for a retry.
      if (existingCodes.size && !importing) {
        throw new Error("CENTRE_CONFLICT");
      }
      created = codes.filter(code => !existingCodes.has(code));
      skipped = codes.filter(code => existingCodes.has(code));

      if (currentCount + created.length > 1000) {
        throw new Error("CENTRE_LIMIT");
      }

      for (const code of created) {
        transaction.create(
          ref.collection("candidates").doc(code),
          {
            code,
            status: "awaiting_script",
            createdAt: FieldValue.serverTimestamp()
          }
        );
      }

      if (!created.length) return;
      transaction.update(ref, {
        candidateCount: FieldValue.increment(created.length),
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    return NextResponse.json(
      { codes: created, skipped },
      { status: created.length ? 201 : 200, headers }
    );
  } catch (error) {
    if (error instanceof Error &&
        error.message === "CENTRE_CONFLICT") {
      return NextResponse.json(
        { error: "One or more candidate codes already exist. Try again." },
        { status: 409, headers }
      );
    }

    const result = centreError(error);

    return NextResponse.json(
      { error: result.error },
      { status: result.status, headers }
    );
  }
}
