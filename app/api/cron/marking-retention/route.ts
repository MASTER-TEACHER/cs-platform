import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { centreCollection } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/*
 * Daily data-retention job (scheduled in vercel.json).
 * Deletes uploaded candidate script PDFs and their saved transcripts once they are
 * older than MARKING_SCRIPT_RETENTION_DAYS (default 365; 0 = never delete).
 * Approved marks, feedback and results are kept so grades remain available.
 * Vercel sends "Authorization: Bearer <CRON_SECRET>"; requests without it are refused.
 */
function retentionDays(): number {
  const raw = process.env.MARKING_SCRIPT_RETENTION_DAYS?.trim();
  if (raw === undefined || raw === "") return 365;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 365;
}

function storageClient(): Storage {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const encodedKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (projectId && clientEmail && encodedKey) {
    return new Storage({ projectId, credentials: { client_email: clientEmail, private_key: Buffer.from(encodedKey, "base64").toString("utf8") } });
  }
  return new Storage({ projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const days = retentionDays();
  if (days === 0) return NextResponse.json({ deleted: 0, retentionDays: 0, note: "Retention deletion disabled." });

  const bucketName = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) return NextResponse.json({ error: "Storage bucket not configured." }, { status: 503 });
  const bucket = storageClient().bucket(bucketName);
  const cutoff = Timestamp.fromMillis(Date.now() - days * 24 * 60 * 60 * 1000);
  const started = Date.now();
  let deleted = 0, failed = 0;

  const exams = await centreCollection.select().get();
  for (const exam of exams.docs) {
    if (Date.now() - started > 240_000) break; // finish the rest tomorrow
    const old = await exam.ref.collection("candidateScripts").where("uploadedAt", "<", cutoff).get();
    for (const script of old.docs) {
      const data = script.data();
      if (data.retentionDeletedAt) continue;
      try {
        if (typeof data.path === "string" && data.path.startsWith("marking-centre/")) {
          await bucket.file(data.path).delete({ ignoreNotFound: true });
        }
        await exam.ref.collection("transcripts").doc(`${data.paperId}_${data.candidateCode}`).delete();
        await script.ref.set({ retentionDeletedAt: FieldValue.serverTimestamp(), status: "deleted_by_retention" }, { merge: true });
        deleted++;
      } catch (error) {
        failed++;
        console.error("[Retention] could not delete script", script.ref.path, error instanceof Error ? error.message : error);
      }
    }
  }
  return NextResponse.json({ deleted, failed, retentionDays: days });
}
