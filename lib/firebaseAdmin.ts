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

function initialiseFirebaseAdmin(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();

  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
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

  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
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

function getAdminAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(
      initialiseFirebaseAdmin(),
    );
  }

  return cachedAuth;
}

function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(
      initialiseFirebaseAdmin(),
    );
  }

  return cachedDb;
}

/*
 * Lazy proxies are deliberate.
 *
 * API routes can import adminAuth/adminDb during `next build`
 * without immediately initialising Firebase Admin. Credentials
 * are required only when a route actually performs an Admin SDK
 * operation at request time.
 */
export const adminAuth =
  new Proxy(
    {} as Auth,
    {
      get(
        _target,
        property,
      ) {
        const auth =
          getAdminAuth();

        const value =
          Reflect.get(
            auth,
            property,
            auth,
          );

        if (
          typeof value ===
          "function"
        ) {
          return value.bind(
            auth,
          );
        }

        return value;
      },
    },
  );

export const adminDb =
  new Proxy(
    {} as Firestore,
    {
      get(
        _target,
        property,
      ) {
        const db =
          getAdminDb();

        const value =
          Reflect.get(
            db,
            property,
            db,
          );

        /*
         * Firebase Admin methods depend on the real
         * Firestore instance as `this`.
         *
         * Returning an unbound method through a Proxy can
         * cause internal Admin SDK state errors such as:
         *
         * "Client is not yet ready to issue requests."
         */
        if (
          typeof value ===
          "function"
        ) {
          return value.bind(
            db,
          );
        }

        return value;
      },
    },
  );