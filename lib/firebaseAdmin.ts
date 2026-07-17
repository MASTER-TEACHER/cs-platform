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

  /*
   * Vercel uses the Base64 environment variable.
   * Base64 avoids multiline private-key formatting problems.
   */
  if (projectId && clientEmail && privateKeyBase64) {
    const privateKey = Buffer.from(
      privateKeyBase64,
      "base64"
    ).toString("utf8");

    if (
      !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !privateKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error(
        "The decoded Firebase Admin private key is invalid."
      );
    }

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  /*
   * Local development fallback.
   * This uses GOOGLE_APPLICATION_CREDENTIALS.
   */
  return initializeApp({
    credential: applicationDefault(),
  });
}

const adminApp = initialiseFirebaseAdmin();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);