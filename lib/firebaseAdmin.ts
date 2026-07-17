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

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyBase64 =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;

  const runningOnVercel = Boolean(process.env.VERCEL);

  if (runningOnVercel) {
    const missingVariables = [
      !projectId && "FIREBASE_ADMIN_PROJECT_ID",
      !clientEmail && "FIREBASE_ADMIN_CLIENT_EMAIL",
      !privateKeyBase64 && "FIREBASE_ADMIN_PRIVATE_KEY_BASE64",
    ].filter(Boolean);

    if (missingVariables.length > 0) {
      throw new Error(
        `Missing Firebase Admin variables: ${missingVariables.join(", ")}`
      );
    }

    const privateKey = Buffer.from(
      privateKeyBase64!,
      "base64"
    ).toString("utf8");

    if (
      !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !privateKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error(
        "FIREBASE_ADMIN_PRIVATE_KEY_BASE64 did not decode to a valid PEM key."
      );
    }

    return initializeApp({
      credential: cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey,
      }),
    });
  }

  return initializeApp({
    credential: applicationDefault(),
  });
}

const adminApp = initialiseFirebaseAdmin();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);