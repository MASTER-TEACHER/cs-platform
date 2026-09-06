/**
 * CS Master production test-data cleanup - Stage 2.
 *
 * SAFETY:
 * - DRY RUN by default.
 * - Protected paid-lifecycle QA accounts can never be deleted by this script.
 * - Documents that reference any protected account OR any non-test Firebase Auth user
 *   are preserved as shared records.
 * - Firestore documents are deleted deepest-first.
 * - Firebase Auth users are deleted LAST.
 * - Real deletion requires BOTH:
 *     --execute
 *     --confirm DELETE-NONPROTECTED-TEST-DATA
 *
 * Usage:
 *   node scripts/test-data-cleanup.mjs --all-test-accounts
 *   node scripts/test-data-cleanup.mjs --email newstudent1@test.com
 *
 *   # Real cleanup only after reviewing the dry-run report:
 *   node scripts/test-data-cleanup.mjs --all-test-accounts --execute --confirm DELETE-NONPROTECTED-TEST-DATA
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const PROTECTED_EMAILS = new Set([
  "newstudent2@test.com",
  "newstudent3@test.com",
  "admin@csmaster.co.uk",
]);

const PROTECTED_UIDS = new Set([
  "JGZEL80mWlVJJaceIlMX5UrPzlw2",
]);

const EXECUTE_CONFIRMATION = "DELETE-NONPROTECTED-TEST-DATA";

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function initialiseAdmin() {
  loadLocalEnv();

  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKeyBase64 =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();

  if (!projectId || !clientEmail || !privateKeyBase64) {
    throw new Error(
      "Firebase Admin credentials are not available. Expected " +
        "FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and " +
        "FIREBASE_ADMIN_PRIVATE_KEY_BASE64 in .env.local or the shell environment.",
    );
  }

  const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");

  return initializeApp({
    projectId,
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf("--email");
  const confirmIndex = args.indexOf("--confirm");

  const email =
    emailIndex >= 0 ? args[emailIndex + 1]?.trim().toLowerCase() : null;

  return {
    email,
    allTestAccounts: args.includes("--all-test-accounts"),
    execute: args.includes("--execute"),
    confirm:
      confirmIndex >= 0 ? args[confirmIndex + 1]?.trim() ?? null : null,
  };
}

async function listAllAuthUsers(auth) {
  const users = [];
  let pageToken;

  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);

  return users;
}

function collectExactKnownUids(value, knownUids, found = new Set()) {
  if (typeof value === "string") {
    if (knownUids.has(value)) found.add(value);
    return found;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectExactKnownUids(item, knownUids, found);
    return found;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectExactKnownUids(item, knownUids, found);
    }
  }

  return found;
}

function collectExactKnownEmails(value, knownEmails, found = new Set()) {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (knownEmails.has(normalized)) found.add(normalized);
    return found;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectExactKnownEmails(item, knownEmails, found);
    return found;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectExactKnownEmails(item, knownEmails, found);
    }
  }

  return found;
}

function stringContainsAnyUid(value, uidSet) {
  if (typeof value !== "string") return false;
  for (const uid of uidSet) {
    if (value.includes(uid)) return true;
  }
  return false;
}

function valueContainsAnyTarget(value, targetUids, targetEmails) {
  if (typeof value === "string") {
    if (targetUids.has(value)) return true;
    if (targetEmails.has(value.toLowerCase())) return true;

    for (const uid of targetUids) {
      if (value.includes(uid)) return true;
    }

    for (const email of targetEmails) {
      if (value.toLowerCase().includes(email)) return true;
    }

    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      valueContainsAnyTarget(item, targetUids, targetEmails),
    );
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((item) =>
      valueContainsAnyTarget(item, targetUids, targetEmails),
    );
  }

  return false;
}

function pathContainsAnyTarget(docPath, targetUids, targetEmails) {
  const lower = docPath.toLowerCase();

  for (const uid of targetUids) {
    if (docPath.includes(uid)) return true;
  }

  for (const email of targetEmails) {
    if (lower.includes(email)) return true;
  }

  return false;
}

async function walkCollection(collectionRef, visitor, depth = 0) {
  if (depth > 12) {
    throw new Error(
      `Firestore traversal exceeded safety depth at ${collectionRef.path}`,
    );
  }

  const snapshot = await collectionRef.get();

  for (const doc of snapshot.docs) {
    await visitor(doc, depth);

    const children = await doc.ref.listCollections();
    for (const child of children) {
      await walkCollection(child, visitor, depth + 1);
    }
  }
}

async function buildCleanupPlan(db, authUsers, targets) {
  const allKnownUidSet = new Set(authUsers.map((user) => user.uid));
  const allKnownEmailSet = new Set(
    authUsers
      .map((user) => user.email?.trim().toLowerCase())
      .filter(Boolean),
  );

  const targetUidSet = new Set(targets.map((user) => user.uid));
  const targetEmailSet = new Set(
    targets
      .map((user) => user.email?.toLowerCase())
      .filter(Boolean),
  );

  const protectedUsers = authUsers.filter((user) => {
  const normalizedEmail =
    user.email?.trim().toLowerCase() || "";

  return (
    PROTECTED_EMAILS.has(normalizedEmail) ||
    PROTECTED_UIDS.has(user.uid)
  );
});

  const protectedUidSet = new Set(protectedUsers.map((user) => user.uid));
  const protectedEmailSet = new Set(
    protectedUsers
      .map((user) => user.email?.trim().toLowerCase())
      .filter(Boolean),
  );

  const realUserUidSet = new Set(
    authUsers
      .filter((user) => {
        const email = user.email?.toLowerCase() || "";
        return !email.endsWith("@test.com");
      })
      .map((user) => user.uid),
  );

  const realUserEmailSet = new Set(
    authUsers
      .filter((user) => {
        const email = user.email?.trim().toLowerCase() || "";
        return email && !email.endsWith("@test.com");
      })
      .map((user) => user.email.trim().toLowerCase()),
  );

  const deleteDocs = [];
  const preserveShared = [];
  const scanned = [];

  const topCollections = await db.listCollections();

  for (const collectionRef of topCollections) {
    await walkCollection(collectionRef, async (doc, depth) => {
      const data = doc.data();
      const docPath = doc.ref.path;

      const referencesTarget =
        pathContainsAnyTarget(docPath, targetUidSet, targetEmailSet) ||
        valueContainsAnyTarget(data, targetUidSet, targetEmailSet);

      if (!referencesTarget) return;

      const exactKnownRefs = collectExactKnownUids(
        data,
        allKnownUidSet,
        new Set(),
      );
      const exactKnownEmails = collectExactKnownEmails(
        data,
        allKnownEmailSet,
        new Set(),
      );

      // Include known UIDs / emails embedded in IDs or paths as well.
      for (const uid of allKnownUidSet) {
        if (docPath.includes(uid)) exactKnownRefs.add(uid);
      }
      const lowerPath = docPath.toLowerCase();
      for (const knownEmail of allKnownEmailSet) {
        if (lowerPath.includes(knownEmail)) exactKnownEmails.add(knownEmail);
      }

      const protectedRefs = [...exactKnownRefs].filter((uid) =>
        protectedUidSet.has(uid),
      );
      const protectedEmailRefs = [...exactKnownEmails].filter((email) =>
        protectedEmailSet.has(email),
      );

      const realUserRefs = [...exactKnownRefs].filter((uid) =>
        realUserUidSet.has(uid),
      );
      const realUserEmailRefs = [...exactKnownEmails].filter((email) =>
        realUserEmailSet.has(email),
      );

      const item = {
        path: docPath,
        depth,
        knownUidReferences: [...exactKnownRefs].sort(),
        knownEmailReferences: [...exactKnownEmails].sort(),
        protectedUidReferences: protectedRefs.sort(),
        protectedEmailReferences: protectedEmailRefs.sort(),
        realUserUidReferences: realUserRefs.sort(),
        realUserEmailReferences: realUserEmailRefs.sort(),
      };

      scanned.push(item);

      if (
        protectedRefs.length ||
        protectedEmailRefs.length ||
        realUserRefs.length ||
        realUserEmailRefs.length
      ) {
        preserveShared.push({
          ...item,
          reason:
            protectedRefs.length || protectedEmailRefs.length
              ? "References protected paid-lifecycle QA account"
              : "References non-test Firebase Auth user",
        });
        return;
      }

      deleteDocs.push(item);
    });
  }

  // Deepest path first so nested documents disappear before parent docs.
  deleteDocs.sort((a, b) => {
    const depthDiff = b.path.split("/").length - a.path.split("/").length;
    if (depthDiff !== 0) return depthDiff;
    return a.path.localeCompare(b.path);
  });

  preserveShared.sort((a, b) => a.path.localeCompare(b.path));

  return {
    deleteDocs,
    preserveShared,
    scanned,
    protectedUsers: protectedUsers.map((user) => ({
      email: user.email || null,
      uid: user.uid,
    })),
  };
}

function ensureReportDirectory() {
  const dir = path.resolve(process.cwd(), "cleanup-reports");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeReport(report) {
  const dir = ensureReportDirectory();
  const filePath = path.join(
    dir,
    `test-data-cleanup-${timestampForFile()}.json`,
  );

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
  return filePath;
}

async function deleteFirestoreDocuments(db, plannedDocs) {
  let deleted = 0;

  for (const item of plannedDocs) {
    const ref = db.doc(item.path);
    await ref.delete();
    deleted += 1;
    console.log(`DELETE Firestore: ${item.path}`);
  }

  return deleted;
}

async function deleteAuthUsers(auth, targets) {
  let deleted = 0;

  for (const user of targets) {
    const email = user.email?.toLowerCase() || "";

    if (
      PROTECTED_EMAILS.has(email) ||
      PROTECTED_UIDS.has(user.uid)
    ) {
      throw new Error(
        `Safety stop: protected Auth account reached deletion phase: ${
          user.email || "(no email)"
        } (${user.uid})`,
      );
    }

    await auth.deleteUser(user.uid);
    deleted += 1;
    console.log(`DELETE Auth: ${user.email || "(no email)"} (${user.uid})`);
  }

  return deleted;
}

async function main() {
  const { email, allTestAccounts, execute, confirm } = parseArgs();

  if (!email && !allTestAccounts) {
    console.log(`
CS Master production test-data cleanup - Stage 2
================================================

DRY RUN:
  node scripts/test-data-cleanup.mjs --all-test-accounts

ONE ACCOUNT:
  node scripts/test-data-cleanup.mjs --email newstudent1@test.com

REAL EXECUTION (only after reviewing dry run):
  node scripts/test-data-cleanup.mjs --all-test-accounts --execute --confirm ${EXECUTE_CONFIRMATION}
`);
    return;
  }

  if (email && allTestAccounts) {
    throw new Error("Use either --email OR --all-test-accounts, not both.");
  }

  if (execute && confirm !== EXECUTE_CONFIRMATION) {
    throw new Error(
      `Execution blocked. Real deletion requires: --confirm ${EXECUTE_CONFIRMATION}`,
    );
  }

  const app = initialiseAdmin();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const allUsers = await listAllAuthUsers(auth);

/*
 * Permanent safety rule:
 * Any Firebase Auth user whose users/{uid} Firestore profile has
 * role === "admin" is automatically protected from cleanup.
 */
const adminProfileUids = new Set();

for (const user of allUsers) {
  const profileSnapshot = await db.collection("users").doc(user.uid).get();

  if (
    profileSnapshot.exists &&
    profileSnapshot.data()?.role === "admin"
  ) {
    adminProfileUids.add(user.uid);
    PROTECTED_UIDS.add(user.uid);

    const normalizedEmail =
      user.email?.trim().toLowerCase();

    if (normalizedEmail) {
      PROTECTED_EMAILS.add(normalizedEmail);
    }
  }
}

const testUsers = allUsers.filter((user) =>
  user.email?.toLowerCase().endsWith("@test.com"),
);

  let requestedTargets;

  if (email) {
    requestedTargets = allUsers.filter(
      (user) => user.email?.toLowerCase() === email,
    );

    if (!requestedTargets.length) {
      throw new Error(`No Firebase Auth user found for ${email}.`);
    }
  } else {
    requestedTargets = testUsers;
  }

 const protectedRequested = requestedTargets.filter((user) => {
  const normalizedEmail =
    user.email?.trim().toLowerCase() || "";

  return (
    PROTECTED_EMAILS.has(normalizedEmail) ||
    PROTECTED_UIDS.has(user.uid)
  );
});

const targets = requestedTargets.filter((user) => {
  const normalizedEmail =
    user.email?.trim().toLowerCase() || "";

  return (
    !PROTECTED_EMAILS.has(normalizedEmail) &&
    !PROTECTED_UIDS.has(user.uid)
  );
});

  if (!targets.length) {
    console.log("\nNo deletable target accounts were selected.");
    if (protectedRequested.length) {
      console.log("Selected account(s) are protected and cannot be deleted:");
      for (const user of protectedRequested) {
        console.log(`  PROTECTED ${user.email} ${user.uid}`);
      }
    }
    return;
  }

  console.log("\nCS Master production test-data cleanup - Stage 2");
  console.log("=================================================");
  console.log(`Mode: ${execute ? "EXECUTE / DESTRUCTIVE" : "DRY RUN / NO WRITES"}`);
  console.log(`Requested Auth accounts: ${requestedTargets.length}`);
  console.log(`Protected accounts skipped: ${protectedRequested.length}`);
  console.log(`Cleanup targets: ${targets.length}\n`);

  console.log("TARGET ACCOUNTS");
  console.log("---------------");
  for (const user of targets.sort((a, b) =>
    (a.email || "").localeCompare(b.email || ""),
  )) {
    console.log(`  ${user.email || "(no email)"}  ${user.uid}`);
  }

  console.log("\nPROTECTED ACCOUNTS");
  console.log("------------------");
  for (const user of allUsers
  .filter((user) => {
    const normalizedEmail =
      user.email?.trim().toLowerCase() || "";

    return (
      PROTECTED_EMAILS.has(normalizedEmail) ||
      PROTECTED_UIDS.has(user.uid)
    );
  })
  .sort((a, b) => (a.email || "").localeCompare(b.email || ""))) {
  console.log(`  PROTECTED  ${user.email || "(no email)"}  ${user.uid}`);
}

  console.log("\nScanning Firestore and building safety plan...");
  const plan = await buildCleanupPlan(db, allUsers, targets);

  const reportBase = {
    generatedAt: new Date().toISOString(),
    mode: execute ? "execute" : "dry-run",
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || null,
    targetAccounts: targets.map((user) => ({
      email: user.email || null,
      uid: user.uid,
    })),
    protectedAccounts: plan.protectedUsers,
    summary: {
      firestoreDocumentsMatched: plan.scanned.length,
      firestoreDocumentsPlannedForDeletion: plan.deleteDocs.length,
      sharedDocumentsPreserved: plan.preserveShared.length,
      authUsersPlannedForDeletion: targets.length,
    },
    plannedFirestoreDeletes: plan.deleteDocs,
    preservedSharedDocuments: plan.preserveShared,
  };

  const preReportPath = writeReport({
    ...reportBase,
    status: execute ? "pre-execution-plan" : "dry-run-complete",
  });

  console.log("\nPLAN SUMMARY");
  console.log("------------");
  console.log(`Matched Firestore docs:        ${plan.scanned.length}`);
  console.log(`Planned Firestore deletions:   ${plan.deleteDocs.length}`);
  console.log(`Shared/protected docs kept:    ${plan.preserveShared.length}`);
  console.log(`Planned Auth deletions:        ${targets.length}`);
  console.log(`Report: ${preReportPath}`);

  if (plan.preserveShared.length) {
    console.log("\nPRESERVED SHARED DOCUMENTS");
    console.log("--------------------------");
    for (const item of plan.preserveShared) {
      console.log(`KEEP: ${item.path}`);
      console.log(`      ${item.reason}`);
    }
  }

  if (!execute) {
    console.log("\nDRY RUN COMPLETE.");
    console.log("Nothing was deleted or modified.");
    console.log(
      `To execute exactly this cleanup class, rerun with --execute --confirm ${EXECUTE_CONFIRMATION}`,
    );
    console.log(
      "Review the generated JSON report before running the destructive command.\n",
    );
    return;
  }

  console.log("\nEXECUTION SAFETY CHECK");
  console.log("----------------------");
  console.log(
    "Protected paid-lifecycle accounts are excluded from Auth deletion and any document referencing them is preserved.",
  );
  console.log(
    "Any document referencing a non-test Firebase Auth UID is also preserved.",
  );
  console.log("Firestore deletion will run before Firebase Auth deletion.\n");

  const firestoreDeleted = await deleteFirestoreDocuments(
    db,
    plan.deleteDocs,
  );

  const authDeleted = await deleteAuthUsers(auth, targets);

  const finalReportPath = writeReport({
    ...reportBase,
    status: "execution-complete",
    execution: {
      firestoreDocumentsDeleted: firestoreDeleted,
      authUsersDeleted: authDeleted,
    },
  });

  console.log("\nCLEANUP COMPLETE");
  console.log("----------------");
  console.log(`Firestore documents deleted: ${firestoreDeleted}`);
  console.log(`Firebase Auth users deleted: ${authDeleted}`);
  console.log(`Final report: ${finalReportPath}`);
  console.log(
    "\nProtected paid-lifecycle QA accounts were not deleted by this script.\n",
  );
}

main().catch((error) => {
  console.error(
    "\nCleanup failed:",
    error instanceof Error ? error.stack || error.message : error,
  );
  process.exitCode = 1;
});
