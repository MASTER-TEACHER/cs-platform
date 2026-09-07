import fs from "node:fs";
import process from "node:process";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

function argValue(name) {
  const index = process.argv.indexOf(name);

  return index >= 0
    ? String(process.argv[index + 1] || "").trim()
    : "";
}

const listSchools = process.argv.includes("--list-schools");
const schoolId = argValue("--school-id");
const confirmation = argValue("--confirm");

const CONFIRMATION =
  "GRANT-COMPLIMENTARY-SCHOOL-ACCESS";

function initialiseFirebaseAdmin() {
  if (getApps().length > 0) {
    return;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  const privateKeyBase64 =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;

  if (projectId && clientEmail && privateKeyBase64) {
    const privateKey = Buffer.from(
      privateKeyBase64,
      "base64",
    ).toString("utf8");

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });

    console.log(
      "Firebase Admin: using FIREBASE_ADMIN_* credentials.",
    );

    return;
  }

  const credentialPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (
    credentialPath &&
    fs.existsSync(credentialPath)
  ) {
    initializeApp({
      credential: applicationDefault(),
      ...(projectId ? { projectId } : {}),
    });

    console.log(
      "Firebase Admin: using GOOGLE_APPLICATION_CREDENTIALS.",
    );

    return;
  }

  console.error("");
  console.error(
    "Firebase Admin credentials could not be found.",
  );
  console.error("");
  console.error(
    "Use either FIREBASE_ADMIN_* environment variables",
  );
  console.error(
    "or set GOOGLE_APPLICATION_CREDENTIALS to your existing",
  );
  console.error(
    "Firebase service-account JSON file.",
  );

  process.exit(1);
}

initialiseFirebaseAdmin();

const db = getFirestore();

/*
 * READ-ONLY SCHOOL LIST
 */
if (listSchools) {
  const snapshot = await db
    .collection("schools")
    .get();

  console.log("");
  console.log("CS MASTER SCHOOLS");
  console.log("-----------------");

  if (snapshot.empty) {
    console.log("No schools found.");
    process.exit(0);
  }

  const schools = snapshot.docs
    .map((document) => {
      const data = document.data() || {};

      return {
        id: document.id,
        name:
          typeof data.name === "string" &&
          data.name.trim()
            ? data.name.trim()
            : "Unnamed school",
      };
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name),
    );

  for (const school of schools) {
    console.log(`${school.name}  ${school.id}`);
  }

  process.exit(0);
}

/*
 * WRITE MODE SAFETY CHECKS
 */
if (!schoolId) {
  console.error(
    "Missing --school-id <Firestore school document ID>.",
  );

  process.exit(1);
}

if (confirmation !== CONFIRMATION) {
  console.error("");
  console.error("No changes were made.");
  console.error("");
  console.error(
    "Safety confirmation required:",
  );
  console.error(
    `--confirm ${CONFIRMATION}`,
  );

  process.exit(1);
}

const schoolRef =
  db.collection("schools").doc(schoolId);

const schoolSnapshot =
  await schoolRef.get();

if (!schoolSnapshot.exists) {
  console.error(
    `School not found: ${schoolId}`,
  );

  process.exit(1);
}

const school =
  schoolSnapshot.data() || {};

const schoolName =
  typeof school.name === "string"
    ? school.name
    : schoolId;

const subscriptionRef =
  db
    .collection("schoolSubscriptions")
    .doc(schoolId);

const existingSnapshot =
  await subscriptionRef.get();

const existing =
  existingSnapshot.exists
    ? existingSnapshot.data() || {}
    : {};

/*
 * Never overwrite a Stripe-managed school subscription.
 */
if (
  existing.stripeSubscriptionId ||
  existing.stripeCustomerId
) {
  console.error("");
  console.error(
    "REFUSED: this school already has Stripe billing data.",
  );
  console.error(
    "No changes were made.",
  );

  process.exit(1);
}

const now =
  FieldValue.serverTimestamp();

await subscriptionRef.set(
  {
    schoolId,

    planKey: "pro",

    status: "active",
    active: true,

    seatLimit: 1000,

    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,

    stripeCustomerId: null,
    stripeSubscriptionId: null,

    billingAccessBlocked: false,
    billingAccessBlockReason: null,

    complimentaryAccess: true,

    complimentaryAccessReason:
      "Permanent school pilot / internal CS Master access",

    complimentaryAccessGrantedAt: now,

    updatedAt: now,

    createdAt:
      existingSnapshot.exists &&
      existing.createdAt
        ? existing.createdAt
        : now,
  },
  {
    merge: true,
  },
);

console.log("");
console.log(
  "COMPLIMENTARY SCHOOL ACCESS GRANTED",
);
console.log("-----------------------------------");
console.log(`School: ${schoolName}`);
console.log(`School ID: ${schoolId}`);
console.log(
  "Access: Permanent complimentary school licence",
);
console.log(
  "Capacity: School Pro / 1,000 student seats",
);
console.log("Expiry: None");
console.log("Stripe subscription: None");
console.log("");
console.log(
  "Other schools continue using the normal",
);
console.log(
  "14-day trial and Stripe subscription flow.",
);