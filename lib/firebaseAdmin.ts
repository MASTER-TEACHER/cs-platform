
import "server-only";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import { getAuth, type Auth } from "firebase-admin/auth";
import {
  getFirestore,
  type Firestore,
} from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

const DEMO_PROJECT_ID = "demo-cs-master";

function initialiseFirebaseAdmin(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const useEmulators =
    process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === "true";

  if (useEmulators) {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();

    const authHost =
      process.env.FIREBASE_AUTH_EMULATOR_HOST?.trim();

    const firestoreHost =
      process.env.FIRESTORE_EMULATOR_HOST?.trim();

    if (
      projectId !== DEMO_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== DEMO_PROJECT_ID ||
      authHost !== "127.0.0.1:9099" ||
      firestoreHost !== "127.0.0.1:8080"
    ) {
      throw new Error(
        "Unsafe Firebase emulator configuration. " +
          "Expected demo-cs-master with Auth on 9099 and Firestore on 8080.",
      );
    }

    const existingApp = getApps()[0];

    if (existingApp) {
      if (existingApp.options.projectId !== DEMO_PROJECT_ID) {
        throw new Error(
          "Existing Firebase Admin app uses a different project.",
        );
      }

      cachedApp = existingApp;
      return cachedApp;
    }

    // Emulator mode uses a demo project without production credentials.
    cachedApp = initializeApp({
      projectId: DEMO_PROJECT_ID,
    });

    return cachedApp;
  }

  // Prevent emulator hosts from accidentally being used in production mode.
  if (
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST
  ) {
    throw new Error(
      "Firebase emulator host variables are set, but emulator mode is disabled.",
    );
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    cachedApp = existingApp;
    return cachedApp;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

  const privateKeyBase64 =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();

  if (projectId && clientEmail && privateKeyBase64) {
    const privateKey = Buffer.from(
      privateKeyBase64,
      "base64",
    ).toString("utf8");

    if (
      !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !privateKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error(
        "FIREBASE_ADMIN_PRIVATE_KEY_BASE64 did not decode to a valid PEM private key.",
      );
    }

    cachedApp = initializeApp({
      projectId,
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    return cachedApp;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    cachedApp = initializeApp({
      credential: applicationDefault(),
      projectId:
        projectId ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT,
    });

    return cachedApp;
  }

  throw new Error(
    [
      "Firebase Admin is not configured.",
      "Set GOOGLE_APPLICATION_CREDENTIALS or configure:",
      "FIREBASE_ADMIN_PROJECT_ID",
      "FIREBASE_ADMIN_CLIENT_EMAIL",
      "FIREBASE_ADMIN_PRIVATE_KEY_BASE64",
    ].join("\n"),
  );
}

function getAdminAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(initialiseFirebaseAdmin());
  }

  return cachedAuth;
}

function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(initialiseFirebaseAdmin());
  }

  return cachedDb;
}

/*
 * Lazy proxies allow API routes to import Firebase Admin
 * during production builds without initialising credentials.
 */
export const adminAuth = new Proxy({} as Auth, {
  get(_target, property) {
    const auth = getAdminAuth();
    const value = Reflect.get(auth, property, auth);

    return typeof value === "function"
      ? value.bind(auth)
      : value;
  },
});

export const adminDb = new Proxy({} as Firestore, {
  get(_target, property) {
    const db = getAdminDb();
    const value = Reflect.get(db, property, db);

    return typeof value === "function"
      ? value.bind(db)
      : value;
  },
});
