import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT = 'demo-cs-master';
const PORT = 3138;
const BASE = `http://127.0.0.1:${PORT}`;
for (const [key, expected] of Object.entries({
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  GCLOUD_PROJECT: PROJECT,
  FIREBASE_ADMIN_PROJECT_ID: PROJECT,
})) assert.equal(process.env[key], expected, `Unsafe environment: ${key}`);
assert.equal(process.env.CSMASTER_ASSIGNMENT_DELETE_TEST_APPROVED, 'YES', 'Emulator-only approval required');
const app = initializeApp({ projectId: PROJECT }, `assignment-delete-${Date.now()}`);
const db = getFirestore(app);
const prefix = `assignment-delete-${Date.now()}`;
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
async function call(kind, id, actor) {
  const response = await fetch(`${BASE}/api/teacher-assignments/${kind}/${encodeURIComponent(id)}/delete`, {
    method: 'DELETE', headers: actor ? { authorization: `Bearer ${actor.token}` } : {},
  });
  return { status: response.status, body: await response.json() };
}
async function ready() {
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(`Next server exited: ${server.exitCode}`);
    try {
      const response = await fetch(`${BASE}/api/health`);
      if (response.status < 500 || response.status === 503) return;
    } catch {}
    await sleep(1000);
  }
  throw new Error('Next server did not start');
}
async function runKind(kind, teacher, otherTeacher, student, schoolId) {
  const classId = `${prefix}-${kind}-class`;
  const otherClassId = `${prefix}-${kind}-other-class`;
  const assignmentId = `${prefix}-${kind}-assignment`;
  const unrelatedId = `${prefix}-${kind}-unrelated`;
  const collection = kind === 'programming' ? 'classAssignments' : 'assignments';
  const type = kind === 'quiz' ? 'quiz' : kind === 'general' ? 'homework' : 'programming';
  await db.doc(`classes/${classId}`).set({ schoolId, teacherId: teacher.uid, status: 'active', assignmentIds: [assignmentId, unrelatedId] });
  await db.doc(`classes/${otherClassId}`).set({ schoolId, teacherId: otherTeacher.uid, status: 'active', assignmentIds: [unrelatedId] });
  await db.doc(`${collection}/${assignmentId}`).set({ schoolId, classId, teacherId: teacher.uid, type, title: 'Delete me', status: 'active', studentIds: [student.uid] });
  await db.doc(`${collection}/${unrelatedId}`).set({ schoolId, classId: otherClassId, teacherId: otherTeacher.uid, type, title: 'Preserve me', status: 'active' });
  const related = ['examSubmissions', 'examSubmissionAttemptHistory', 'assignmentProgress', 'assignmentResults'];
  for (const name of related) {
    await db.doc(`${name}/${prefix}-${kind}-${name}-target`).set({ assignmentId, classId, schoolId, studentId: student.uid, score: 15 });
    await db.doc(`${name}/${prefix}-${kind}-${name}-unrelated`).set({ assignmentId: unrelatedId, classId: otherClassId, schoolId, studentId: student.uid, score: 30 });
  }
  assert.equal((await call(kind, assignmentId, null)).status, 401); pass(`${kind}: unauthenticated rejected`);
  assert.equal((await call(kind, assignmentId, student)).status, 403); pass(`${kind}: student rejected`);
  assert.equal((await call(kind, assignmentId, otherTeacher)).status, 403); pass(`${kind}: non-owner rejected`);
  const result = await call(kind, assignmentId, teacher);
  assert.equal(result.status, 200, JSON.stringify(result.body)); pass(`${kind}: owning teacher deletes`);
  assert.equal((await db.doc(`${collection}/${assignmentId}`).get()).exists, false); pass(`${kind}: assignment removed`);
  for (const name of related) {
    assert.equal((await db.doc(`${name}/${prefix}-${kind}-${name}-target`).get()).exists, false, `${kind}: linked ${name} remains`);
    assert.equal((await db.doc(`${name}/${prefix}-${kind}-${name}-unrelated`).get()).exists, true, `${kind}: unrelated ${name} removed`);
  }
  pass(`${kind}: four linked families removed, unrelated results preserved`);
  assert.equal((await db.doc(`${collection}/${unrelatedId}`).get()).exists, true); pass(`${kind}: unrelated assignment preserved`);
  const cls = (await db.doc(`classes/${classId}`).get()).data();
  assert.equal(cls.assignmentIds.includes(assignmentId), false); pass(`${kind}: class reference removed`);
  const audit = (await db.doc(`teacherAssignmentDeletionAudit/${collection}_${assignmentId}`).get()).data();
  assert.equal(audit?.state, 'completed'); pass(`${kind}: audit completed`);
}
async function main() {
  const schoolId = `${prefix}-school`;
  const teacher = await signup('teacher');
  const otherTeacher = await signup('other-teacher');
  const student = await signup('student');
  for (const [actor, role] of [[teacher, 'teacher'], [otherTeacher, 'teacher'], [student, 'student']]) {
    await db.doc(`users/${actor.uid}`).set({ uid: actor.uid, email: actor.email, role, schoolId, accountType: 'school' });
  }
  await db.doc(`schools/${schoolId}`).set({ name: 'Emulator school' });
  const env = { ...process.env, NEXT_PUBLIC_FIREBASE_USE_EMULATORS: 'true', NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT, FIREBASE_ADMIN_PROJECT_ID: PROJECT, BILLING_ENFORCEMENT_MODE: 'off' };
  server = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', `npm run dev -- -p ${PORT}`], { env, stdio: 'inherit', windowsHide: true })
    : spawn('npm', ['run', 'dev', '--', '-p', String(PORT)], { env, stdio: 'inherit' });
  await ready();
  for (const kind of ['general', 'quiz', 'programming']) await runKind(kind, teacher, otherTeacher, student, schoolId);
  console.log(`\nALL ${passed} ASSIGNMENT DELETION TESTS PASSED (DEMO EMULATOR ONLY).`);
}
try { await main(); } catch (error) { console.error('ASSIGNMENT DELETION TEST FAILED:', error); process.exitCode = 1; }
finally {
  if (server) {
    if (process.platform === 'win32') {
      try { execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }); } catch {}
    } else server.kill('SIGTERM');
  }
  await deleteApp(app);
}
