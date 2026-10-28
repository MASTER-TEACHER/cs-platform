
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";

import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import {
  centreCollection,
  centreError,
  requireCentreTeacher,
} from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

type Context = {
  params: Promise<{ examId: string; paperId: string }>;
};

const allowed = new Set([
  "questionPaper",
  "markScheme",
  "gradeBoundaries",
]);

const MAX_SIZE = 12 * 1024 * 1024;

let cachedStorage: Storage | null = null;

function getMarkingStorage(): Storage {
  if (cachedStorage) return cachedStorage;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

  const encodedKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();

  if (projectId && clientEmail && encodedKey) {
    const privateKey = Buffer.from(
      encodedKey,
      "base64",
    ).toString("utf8");

    cachedStorage = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    return cachedStorage;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    cachedStorage = new Storage({
      projectId:
        projectId ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT,
    });

    return cachedStorage;
  }

  throw new Error("CENTRE_STORAGE_UNAVAILABLE");
}

export async function POST(
  request: Request,
  context: Context,
) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);

    const { examId, paperId } = await context.params;

    if (
      !/^[\w-]{1,128}$/.test(examId) ||
      !/^paper-\d{1,2}$/.test(paperId)
    ) {
      throw new Error("CENTRE_NOT_FOUND");
    }

    const ref = centreCollection.doc(examId);
    const snap = await ref.get();

    if (
      !snap.exists ||
      snap.data()?.ownerId !== actor.uid
    ) {
      throw new Error("CENTRE_NOT_FOUND");
    }

    const papers = snap.data()?.papers;

    if (
      !Array.isArray(papers) ||
      !papers.some((paper) => paper.id === paperId)
    ) {
      throw new Error("CENTRE_NOT_FOUND");
    }

    const structureSnap = await ref.collection("paperStructures").doc(paperId).get();
    if (structureSnap.data()?.status === "approved") {
      return NextResponse.json(
        { error: "Approved paper structures are locked. Documents cannot be replaced." },
        { status: 409, headers },
      );
    }

    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");

    if (
      typeof kind !== "string" ||
      !allowed.has(kind) ||
      !(file instanceof File)
    ) {
      throw new Error("CENTRE_INVALID");
    }

    if (
      file.size === 0 ||
      file.size > MAX_SIZE ||
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      throw new Error("CENTRE_INVALID");
    }

    const bytes = Buffer.from(
      await file.arrayBuffer(),
    );

    if (
      bytes.subarray(0, 5).toString("ascii") !== "%PDF-"
    ) {
      throw new Error("CENTRE_INVALID");
    }

    const bucketName =
      process.env.FIREBASE_ADMIN_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!bucketName) {
      throw new Error("CENTRE_STORAGE_UNAVAILABLE");
    }

    const path =
      `marking-centre/${actor.uid}/` +
      `${examId}/${paperId}/${kind}.pdf`;

    const storage = getMarkingStorage();
    const object = storage.bucket(bucketName).file(path);

    try {
      await object.save(bytes, {
        resumable: false,
        contentType: "application/pdf",
        metadata: {
          cacheControl: "private, no-store",
        },
      });
    } catch (storageError) {
      console.error(
        "[Marking Centre] Storage upload failed",
        storageError,
      );

      const code = (
        storageError as { code?: number | string }
      )?.code;

      if (code === 404 || code === "404") {
        throw new Error("CENTRE_BUCKET_NOT_FOUND");
      }

      if (code === 403 || code === "403") {
        throw new Error("CENTRE_BUCKET_PERMISSION");
      }

      throw new Error("CENTRE_STORAGE_FAILURE");
    }

    await ref
      .collection("paperDocuments")
      .doc(`${paperId}_${kind}`)
      .set({
        paperId,
        kind,
        path,
        originalName: file.name.slice(0, 180),
        size: file.size,
        uploadedAt: FieldValue.serverTimestamp(),
      });

    await ref.update({
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        paperId,
        kind,
        filename: file.name,
        size: file.size,
      },
      { status: 201, headers },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CENTRE_BUCKET_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "Firebase Storage bucket not found.",
        },
        { status: 503, headers },
      );
    }

    if (
      error instanceof Error &&
      error.message === "CENTRE_BUCKET_PERMISSION"
    ) {
      return NextResponse.json(
        {
          error:
            "Server cannot write to Firebase Storage.",
        },
        { status: 503, headers },
      );
    }

    if (
      error instanceof Error &&
      error.message === "CENTRE_STORAGE_FAILURE"
    ) {
      return NextResponse.json(
        {
          error:
            "PDF storage failed. Check the server terminal.",
        },
        { status: 503, headers },
      );
    }

    if (
      error instanceof Error &&
      error.message === "CENTRE_STORAGE_UNAVAILABLE"
    ) {
      return NextResponse.json(
        {
          error:
            "Firebase Storage is not configured.",
        },
        { status: 503, headers },
      );
    }

    const result = centreError(error);

    return NextResponse.json(
      { error: result.error },
      { status: result.status, headers },
    );
  }
}

export async function GET(
  request: Request,
  context: Context,
) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);

    const { examId, paperId } = await context.params;

    if (
      !/^[\w-]{1,128}$/.test(examId) ||
      !/^paper-\d{1,2}$/.test(paperId)
    ) {
      throw new Error("CENTRE_NOT_FOUND");
    }

    const ref = centreCollection.doc(examId);
    const snap = await ref.get();

    if (
      !snap.exists ||
      snap.data()?.ownerId !== actor.uid
    ) {
      throw new Error("CENTRE_NOT_FOUND");
    }

    const docs = await ref
      .collection("paperDocuments")
      .where("paperId", "==", paperId)
      .get();

    return NextResponse.json(
      {
        documents: docs.docs.map((doc) => ({
          kind: doc.data().kind,
          filename: doc.data().originalName,
          size: doc.data().size,
        })),
      },
      { headers },
    );
  } catch (error) {
    const result = centreError(error);

    return NextResponse.json(
      { error: result.error },
      { status: result.status, headers },
    );
  }
}
