import "server-only";
import { createHash } from "node:crypto";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";
import { visionCacheVersion, VISION_PREFIX, type Extraction, type TranscriptCache } from "@/lib/marking/visionPdf";

/**
 * Stores one vision transcription per candidate script under the exam document
 * (markingCentreExams/{examId}/transcripts/{paperId}_{candidateCode}). Server-only:
 * Firestore rules give clients no access to markingCentreExams.
 *
 * The cache is keyed by the SHA-256 of the PDF and the vision settings, so a replaced
 * script or a changed model always produces a fresh transcription.
 */
export function transcriptCache(examRef: DocumentReference, paperId: string, candidateCode: string, bytes: Buffer, scriptHash?: string): TranscriptCache {
  const hash = scriptHash ?? createHash("sha256").update(bytes).digest("hex");
  const ref = examRef.collection("transcripts").doc(`${paperId}_${candidateCode}`);
  const version = visionCacheVersion();
  return {
    async get(): Promise<Extraction | null> {
      const snap = await ref.get();
      const data = snap.data();
      if (!data || data.scriptHash !== hash || data.version !== version) return null;
      if (typeof data.text !== "string" || !data.text.startsWith(VISION_PREFIX) || !Number.isInteger(data.pages)) return null;
      return { text: data.text, pages: data.pages, truncated: false, visionUsed: true };
    },
    async set(value: Extraction): Promise<void> {
      if (!value.visionUsed) return;
      await ref.set({ paperId, candidateCode, scriptHash: hash, version, text: value.text, pages: value.pages, createdAt: FieldValue.serverTimestamp() });
    },
  };
}
