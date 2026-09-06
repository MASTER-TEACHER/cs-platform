/**
 * CS Master production test-data cleanup AUDIT.
 *
 * SAFE BY DESIGN: this script contains no delete/update/write operations.
 * It inventories Firebase Auth test accounts and Firestore references so a
 * later cleanup can be reviewed before any destructive action is enabled.
 *
 * Usage:
 *   node scripts/test-data-cleanup-audit.mjs
 *   node scripts/test-data-cleanup-audit.mjs --email newstudent1@test.com
 *   node scripts/test-data-cleanup-audit.mjs --all-test-accounts
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
]);

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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
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
  const privateKeyBase64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (!projectId || !clientEmail || !privateKeyBase64) {
    throw new Error("Firebase Admin credentials are not available. Expected FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY_BASE64 in .env.local or the shell environment.");
  }
  const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");
  return initializeApp({ projectId, credential: cert({ projectId, clientEmail, privateKey }) });
}

function containsUid(value, uid) {
  if (value === uid) return true;
  if (Array.isArray(value)) return value.some((item) => containsUid(item, uid));
  if (value && typeof value === "object") return Object.values(value).some((item) => containsUid(item, uid));
  return false;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf("--email");
  return {
    email: emailIndex >= 0 ? args[emailIndex + 1]?.trim().toLowerCase() : null,
    allTestAccounts: args.includes("--all-test-accounts"),
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

async function scanCollection(collectionRef, uid, hits, visited, depth = 0) {
  if (depth > 8) return;
  const snapshot = await collectionRef.get();
  for (const doc of snapshot.docs) {
    const key = doc.ref.path;
    if (!visited.has(key)) {
      visited.add(key);
      const data = doc.data();
      if (doc.id === uid || containsUid(data, uid)) hits.push(doc.ref.path);
    }
    const children = await doc.ref.listCollections();
    for (const child of children) await scanCollection(child, uid, hits, visited, depth + 1);
  }
}

async function findFirestoreReferences(db, uid) {
  const hits = [];
  const visited = new Set();
  const collections = await db.listCollections();
  for (const collectionRef of collections) {
    await scanCollection(collectionRef, uid, hits, visited);
  }
  return [...new Set(hits)].sort();
}

async function main() {
  const { email, allTestAccounts } = parseArgs();
  const app = initialiseAdmin();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const allUsers = await listAllAuthUsers(auth);
  const testUsers = allUsers.filter((user) => user.email?.toLowerCase().endsWith("@test.com"));

  let targets;
  if (email) {
    targets = allUsers.filter((user) => user.email?.toLowerCase() === email);
    if (!targets.length) throw new Error(`No Firebase Auth user found for ${email}.`);
  } else if (allTestAccounts) {
    targets = testUsers;
  } else {
    console.log("\nCS Master production test-account inventory");
    console.log("===========================================");
    console.log(`Firebase Auth users: ${allUsers.length}`);
    console.log(`@test.com accounts: ${testUsers.length}\n`);
    for (const user of testUsers.sort((a, b) => (a.email || "").localeCompare(b.email || ""))) {
      const protectedAccount = PROTECTED_EMAILS.has(user.email?.toLowerCase() || "");
      console.log(`${protectedAccount ? "PROTECTED" : "REVIEW   "}  ${user.email || "(no email)"}  ${user.uid}`);
    }
    console.log("\nNo Firestore scan was performed.");
    console.log("Audit one account: node scripts/test-data-cleanup-audit.mjs --email <email>");
    console.log("Audit every @test.com account: node scripts/test-data-cleanup-audit.mjs --all-test-accounts");
    console.log("\nThis utility is READ-ONLY. It cannot delete or modify Firebase data.\n");
    return;
  }

  console.log("\nCS Master test-data cleanup DRY RUN");
  console.log("===================================");
  console.log(`Accounts selected: ${targets.length}`);
  console.log("Mode: READ-ONLY / NO DELETIONS\n");

  for (const user of targets) {
    const normalizedEmail = user.email?.toLowerCase() || "";
    const protectedAccount = PROTECTED_EMAILS.has(normalizedEmail);
    console.log("------------------------------------------------------------");
    console.log(`Email: ${user.email || "(none)"}`);
    console.log(`UID: ${user.uid}`);
    console.log(`Protection: ${protectedAccount ? "PROTECTED - paid lifecycle QA; DO NOT DELETE" : "REVIEW"}`);
    console.log("Scanning Firestore references...");
    const refs = await findFirestoreReferences(db, user.uid);
    console.log(`Firestore documents referencing UID: ${refs.length}`);
    for (const ref of refs) console.log(`  - ${ref}`);
    if (!refs.length) console.log("  (none found)");
    console.log();
  }

  console.log("Audit complete. Nothing was deleted or modified.");
  console.log("Do not delete accounts until this report has been reviewed.\n");
}

main().catch((error) => {
  console.error("\nAudit failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
