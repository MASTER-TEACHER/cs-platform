import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT = 'demo-cs-master';
const PORT = 3137;
const BASE = `http://127.0.0.1:${PORT}`;
for (const [key, expected] of Object.entries({
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  GCLOUD_PROJECT: PROJECT,
  FIREBASE_ADMIN_PROJECT_ID: PROJECT,
})) assert.equal(process.env[key], expected, `Unsafe environment: ${key}`);
assert.equal(process.env.CSMASTER_EXAM_DELETE_TEST_APPROVED, 'YES', 'Explicit emulator test approval required');
const app = initializeApp({ projectId: PROJECT }, `exam-delete-${Date.now()}`);
const db = getFirestore(app);
const prefix = `exam-delete-${Date.now()}`;
let server;
let passed = 0;
const pass = label => console.log(`PASS ${++passed}: ${label}`);
async function signup(label) {
  const email = `${prefix}-${label}@example.test`;
  const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'EmulatorOnly!12345', returnSecureToken: true }),
  });
  const data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  return { uid: data.localId, token: data.idToken, email };
}
async function call(id, actor) {
  const response = await fetch(`${BASE}/api/exam-assignments/${encodeURIComponent(id)}/delete`, {
    method: 'DELETE', headers: actor ? { authorization: `Bearer ${actor.token}` } : {},
  });
  return { status: response.status, body: await response.json() };
}
async function ready() {
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited: ${server.exitCode}`);
    }

    try {
      const response = await fetch(`${BASE}/api/health`);
      const data = await response.json();

      if (
        data?.service === 'cs-master' &&
        data?.checks?.app === true &&
        data?.checks?.firebaseClient === true &&
        data?.checks?.firebaseAdmin === true
      ) {
        console.log('Next.js and Firebase are ready.');
        return;
      }
    } catch {
      // Wait while the development server starts.
    }

    await sleep(1000);
  }

  throw new Error('Next.js and Firebase did not become ready');
}
async function main() {
  const schoolId = `${prefix}-school`;
  const classId = `${prefix}-class`;
  const otherClassId = `${prefix}-other-class`;
  const assignmentId = `${prefix}-assignment`;
  const unrelatedId = `${prefix}-unrelated`;
  const teacher = await signup('teacher');
  const otherTeacher = await signup('other-teacher');
  const student = await signup('student');
  for (const [actor, role] of [[teacher,'teacher'],[otherTeacher,'teacher'],[student,'student']]) {
    await db.doc(`users/${actor.uid}`).set({ uid: actor.uid, email: actor.email, role, schoolId, accountType: 'school' });
  }
  await db.doc(`schools/${schoolId}`).set({ name: 'Emulator school' });
  await db.doc(`classes/${classId}`).set({ schoolId, teacherId: teacher.uid, status: 'active' });
  await db.doc(`classes/${otherClassId}`).set({ schoolId, teacherId: otherTeacher.uid, status: 'active' });
  await db.doc(`examAssignments/${assignmentId}`).set({ schoolId, classId, teacherId: teacher.uid, title: 'Delete me', status: 'active', studentIds: [student.uid] });
  await db.doc(`examAssignments/${unrelatedId}`).set({ schoolId, classId: otherClassId, teacherId: otherTeacher.uid, title: 'Preserve me', status: 'active' });
  const collections = ['examSubmissions','examSubmissionAttemptHistory','assignmentProgress','assignmentResults'];
  for (const name of collections) {
    await db.doc(`${name}/${prefix}-${name}-target`).set({ assignmentId, classId, schoolId, studentId: student.uid, score: 15 });
    await db.doc(`${name}/${prefix}-${name}-unrelated`).set({ assignmentId: unrelatedId, classId: otherClassId, schoolId, studentId: student.uid, score: 30 });
  }
  const env = { ...process.env, NEXT_PUBLIC_FIREBASE_USE_EMULATORS: 'true', NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT, FIREBASE_ADMIN_PROJECT_ID: PROJECT, BILLING_ENFORCEMENT_MODE: 'off' };
  server = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d','/s','/c',`npm run dev -- -p ${PORT}`], { env, stdio: 'inherit', windowsHide: true })
    : spawn('npm', ['run','dev','--','-p',String(PORT)], { env, stdio: 'inherit' });
  await ready();
  assert.equal((await call(assignmentId, null)).status, 401); pass('Unauthenticated deletion rejected');
  assert.equal((await call(assignmentId, student)).status, 403); pass('Student deletion rejected');
  assert.equal((await call(assignmentId, otherTeacher)).status, 403); pass('Non-owner deletion rejected');
  const result = await call(assignmentId, teacher);
  assert.equal(result.status, 200, JSON.stringify(result.body)); pass('Owning teacher deletes assignment');
  assert.equal((await db.doc(`examAssignments/${assignmentId}`).get()).exists, false); pass('Assignment removed');
  for (const name of collections) {
    assert.equal((await db.doc(`${name}/${prefix}-${name}-target`).get()).exists, false, `${name} linked record still exists`);
    assert.equal((await db.doc(`${name}/${prefix}-${name}-unrelated`).get()).exists, true, `${name} unrelated record was removed`);
  }
  pass('All four linked record families removed');
  pass('Unrelated student results preserved');
  assert.equal((await db.doc(`examAssignments/${unrelatedId}`).get()).exists, true); pass('Unrelated assignment preserved');
  const audit = (await db.doc(`examAssignmentDeletionAudit/${assignmentId}`).get()).data();
  assert.equal(audit?.state, 'completed'); pass('Completed deletion audit recorded');
  console.log(`\nALL ${passed} EXAM ASSIGNMENT DELETION TESTS PASSED (DEMO EMULATOR ONLY).`);
}
try { await main(); } catch (error) { console.error('EXAM DELETION TEST FAILED:', error); process.exitCode = 1; }
finally {
  if (server) {
    if (process.platform === 'win32') {
      try { execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }); } catch {}
    } else server.kill('SIGTERM');
  }
  await deleteApp(app);
}
