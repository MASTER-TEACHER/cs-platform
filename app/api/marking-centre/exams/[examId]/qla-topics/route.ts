import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, requireCentreTeacher } from "@/lib/marking/centre";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
async function owned(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request); requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("INVALID");
  const ref = centreCollection.doc(examId); const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("NOT_FOUND");
  return { ref, snap, actor };
}
function fail(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  const status = code.startsWith("AUTH_") ? 401 : code === "CENTRE_FORBIDDEN" ? 403 : code === "NOT_FOUND" ? 404 : 400;
  return NextResponse.json({ error: "Unable to access or save QLA topics." }, { status, headers });
}
export async function GET(request: Request, context: Context) {
  try {
    const { snap } = await owned(request, context);
    return NextResponse.json({ mappings: snap.data()?.qlaTopicMappings ?? {}, revision: Number(snap.data()?.qlaTopicRevision ?? 0) }, { headers });
  } catch (error) { return fail(error); }
}
export async function PUT(request: Request, context: Context) {
  try {
    const { ref, actor } = await owned(request, context);
    const body = await request.json() as { mappings?: Record<string, string>; expectedRevision?: number };
    if (!body || !Number.isInteger(body.expectedRevision) || !body.mappings || typeof body.mappings !== "object" || Array.isArray(body.mappings) || Object.keys(body.mappings).length > 1500) throw new Error("INVALID");
    const papers = (await ref.get()).data()?.papers as { id: string }[] | undefined;
    if (!Array.isArray(papers)) throw new Error("INVALID");
    const structures = await Promise.all(papers.map(p => ref.collection("paperStructures").doc(p.id).get()));
    const allowed = new Set<string>();
    papers.forEach((p, i) => { for (const q of (structures[i].data()?.questions ?? []) as { id: string }[]) allowed.add(`${p.id}::${q.id}`); });
    if (Object.entries(body.mappings).some(([k, v]) => !allowed.has(k) || typeof v !== "string" || v.length > 150)) throw new Error("INVALID");
    await ref.firestore.runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (snap.data()?.ownerId !== actor.uid || Number(snap.data()?.qlaTopicRevision ?? 0) !== body.expectedRevision) throw new Error("CONFLICT");
      tx.update(ref, { qlaTopicMappings: body.mappings, qlaTopicRevision: body.expectedRevision! + 1, updatedAt: FieldValue.serverTimestamp() });
      tx.set(ref.collection("resultsAudit").doc(), { action: "qla_topic_mapping_updated", actorId: actor.uid, at: FieldValue.serverTimestamp(), revision: body.expectedRevision! + 1, mappings: body.mappings });
    });
    return NextResponse.json({ ok: true, revision: body.expectedRevision! + 1 }, { headers });
  } catch (error) { return fail(error); }
}
