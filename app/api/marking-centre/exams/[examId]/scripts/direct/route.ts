import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

/*
 * Direct-to-storage script upload.
 *
 * Vercel rejects request bodies over ~4.5 MB, and scanned scripts are often
 * bigger. The browser therefore uploads each PDF straight to Cloud Storage
 * with a short-lived signed URL:
 *   1. action "sign":     check exam, paper, candidate and Replace rules,
 *                         return a 15-minute upload URL for that one object;
 *   2. browser PUTs the PDF to that URL;
 *   3. action "complete": check the stored object (size, %PDF- header) and
 *                         record it, exactly like the original upload route.
 * Objects use the same path as before, so marking is unchanged.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };
const MAX_BYTES = 25 * 1024 * 1024;
const CODE = /^(?:[0-9]{4}|[0-9]{6}|[A-Z0-9][A-Z0-9_-]{2,31})$/i;

type Context = { params: Promise<{ examId: string }> };

function storageClient() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) {
    return new Storage({
      projectId,
      credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") },
    });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
  }
  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}

function bucket() {
  const name = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!name) throw new Error("CENTRE_STORAGE_UNAVAILABLE");
  return storageClient().bucket(name);
}

async function owned(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { ref, snap, actor, examId };
}

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "CENTRE_STORAGE_UNAVAILABLE") {
    return NextResponse.json({ error: "Server Storage credentials are unavailable." }, { status: 503, headers });
  }
  if (message === "CENTRE_CONFLICT") {
    return NextResponse.json(
      { error: "A script already exists for this candidate and paper. Select Replace existing to overwrite it." },
      { status: 409, headers }
    );
  }
  if (message === "CENTRE_NOT_UPLOADED") {
    return NextResponse.json({ error: "The file did not reach storage. Try again." }, { status: 400, headers });
  }
  if (message === "CENTRE_NOT_PDF") {
    return NextResponse.json({ error: "The uploaded file is not a valid PDF (or is over 25 MB)." }, { status: 400, headers });
  }
  const result = centreError(error);
  return NextResponse.json({ error: result.error }, { status: result.status, headers });
}

export async function POST(request: Request, context: Context) {
  try {
    const { ref, snap, actor, examId } = await owned(request, context);
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    const action = body?.action;
    const paperId = body?.paperId;
    const rawCode = body?.candidateCode;
    const replace = body?.replace === true;

    const papers = snap.data()?.papers;
    const validPapers = new Set<string>(Array.isArray(papers) ? papers.map((p: { id: string }) => p.id) : []);

    if ((action !== "sign" && action !== "complete") ||
        typeof paperId !== "string" || !validPapers.has(paperId) ||
        typeof rawCode !== "string" || !CODE.test(rawCode)) {
      throw new Error("CENTRE_INVALID");
    }

    const candidateCode = rawCode.toUpperCase();
    const candidate = await ref.collection("candidates").doc(candidateCode).get();
    if (!candidate.exists) throw new Error("CENTRE_INVALID");

    const scriptRef = ref.collection("candidateScripts").doc(`${paperId}_${candidateCode}`);
    const path = `marking-centre/${actor.uid}/${examId}/scripts/${paperId}/${candidateCode}.pdf`;
    const object = bucket().file(path);

    if (action === "sign") {
      const size = body?.size;
      if (typeof size !== "number" || !Number.isFinite(size) || size < 5 || size > MAX_BYTES) {
        throw new Error("CENTRE_INVALID");
      }
      if (!replace && (await scriptRef.get()).exists) throw new Error("CENTRE_CONFLICT");

      const [url] = await object.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: "application/pdf",
      });
      return NextResponse.json({ url }, { headers });
    }

    // complete
    const filename = typeof body?.filename === "string" ? body.filename.slice(0, 180) : `${candidateCode}.pdf`;
    const [exists] = await object.exists();
    if (!exists) throw new Error("CENTRE_NOT_UPLOADED");

    const [metadata] = await object.getMetadata();
    const size = Number(metadata.size ?? 0);
    const [head] = size >= 5 ? await object.download({ start: 0, end: 4 }) : [Buffer.alloc(0)];

    if (size < 5 || size > MAX_BYTES || head.toString("ascii") !== "%PDF-") {
      await object.delete({ ignoreNotFound: true }).catch(() => undefined);
      throw new Error("CENTRE_NOT_PDF");
    }

    await object.setMetadata({ contentType: "application/pdf", cacheControl: "private, no-store" }).catch(() => undefined);
    await scriptRef.set({
      paperId,
      candidateCode,
      path,
      originalName: filename,
      size,
      status: "uploaded",
      uploadedAt: FieldValue.serverTimestamp(),
      uploadedBy: actor.uid,
    });
    await ref.update({ updatedAt: FieldValue.serverTimestamp() });

    return NextResponse.json({ uploaded: { paperId, candidateCode, filename } }, { status: 201, headers });
  } catch (error) {
    console.error("[Marking Centre] Direct script upload failed", error instanceof Error ? error.message : error);
    return failure(error);
  }
}
