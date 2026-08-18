import "server-only";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initialiseFirebaseAdmin() {
  const existingApps = getApps();

  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

  const privateKeyBase64 =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();

  if (
    projectId &&
    clientEmail &&
    privateKeyBase64
  ) {
    const privateKey = Buffer.from(
      privateKeyBase64,
      "base64",
    ).toString("utf8");

    if (
      !privateKey.includes(
        "-----BEGIN PRIVATE KEY-----",
      ) ||
      !privateKey.includes(
        "-----END PRIVATE KEY-----",
      )
    ) {
      throw new Error(
        "FIREBASE_ADMIN_PRIVATE_KEY_BASE64 did not decode to a valid PEM private key.",
      );
    }

    return initializeApp({
      projectId,
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
    return initializeApp({
      credential: applicationDefault(),
      projectId:
        projectId ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT,
    });
  }

  throw new Error(
    [
      "Firebase Admin is not configured.",
      "",
      "For local development, set:",
      "GOOGLE_APPLICATION_CREDENTIALS",
      "",
      "Or configure these server-only variables:",
      "FIREBASE_ADMIN_PROJECT_ID",
      "FIREBASE_ADMIN_CLIENT_EMAIL",
      "FIREBASE_ADMIN_PRIVATE_KEY_BASE64",
      "",
      "Do not prefix Admin variables with NEXT_PUBLIC_.",
    ].join("\n"),
  );
}

const adminApp =
  initialiseFirebaseAdmin();

export const adminAuth =
  getAuth(adminApp);

export const adminDb =
  getFirestore(adminApp);