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
assert.equal(process.env.CSMASTER_STUDENT_REMOVE_TEST_APPROVED, 'YES', 'Emulator-only approval required');
const app = initializeApp({ projectId: PROJECT }, `student-remove-${Date.now()}`);
const db = getFirestore(app);
const prefix = `student-remove-${Date.now()}`;
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
async function call(kind, id, actor, studentId) {
  const response = await fetch(`${BASE}/api/teacher-assignments/${kind}/${encodeURIComponent(id)}/students/${encodeURIComponent(studentId)}`, {
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
async function runKind(kind, teacher, otherTeacher, student, peer, schoolId) {
  const classId = `${prefix}-${kind}-class`;
  const assignmentId = `${prefix}-${kind}-assignment`;
  const unrelatedId = `${prefix}-${kind}-unrelated`;
  const collection = kind === 'programming' ? 'classAssignments' : kind === 'exam' ? 'examAssignments' : 'assignments';
  const type = kind === 'quiz' ? 'quiz' : kind === 'general' ? 'homework' : kind;
  await db.doc(`classes/${classId}`).set({ schoolId, teacherId: teacher.uid, status: 'active', studentIds: [student.uid, peer.uid], assignmentIds: [assignmentId, unrelatedId] });
  await db.doc(`${collection}/${assignmentId}`).set({ schoolId, classId, teacherId: teacher.uid, type, title: 'Student removal test', status: 'active', studentIds: [student.uid, peer.uid], studentCount: 2 });
  await db.doc(`${collection}/${unrelatedId}`).set({ schoolId, classId, teacherId: teacher.uid, type, title: 'Unrelated assignment', status: 'active', studentIds: [student.uid, peer.uid], studentCount: 2 });
  const related = ['examSubmissions', 'examSubmissionAttemptHistory', 'assignmentProgress', 'assignmentResults'];
  for (const name of related) {
    for (const [label, aid, uid] of [['target', assignmentId, student.uid], ['peer', assignmentId, peer.uid], ['unrelated', unrelatedId, student.uid]]) {
      await db.doc(`${name}/${prefix}-${kind}-${name}-${label}`).set({ assignmentId: aid, classId, schoolId, studentId: uid, score: 15 });
    }
  }
  assert.equal((await call(kind, assignmentId, null, student.uid)).status, 401); pass(`${kind}: anonymous rejected`);
  assert.equal((await call(kind, assignmentId, student, student.uid)).status, 403); pass(`${kind}: student rejected`);
  assert.equal((await call(kind, assignmentId, otherTeacher, student.uid)).status, 403); pass(`${kind}: non-owner rejected`);
  const result = await call(kind, assignmentId, teacher, student.uid);
  assert.equal(result.status, 200, JSON.stringify(result.body)); pass(`${kind}: owner removes one recipient`);
  const updated = (await db.doc(`${collection}/${assignmentId}`).get()).data();
  assert.deepEqual(updated.studentIds, [peer.uid]); assert.equal(updated.studentCount, 1); pass(`${kind}: only peer remains assigned`);
  for (const name of related) {
    for (const [label, exists] of [['target', false], ['peer', true], ['unrelated', true]]) {
      assert.equal((await db.doc(`${name}/${prefix}-${kind}-${name}-${label}`).get()).exists, exists, `${kind}: ${name} ${label} incorrect`);
    }
  }
  pass(`${kind}: four linked families removed for target only; peer and unrelated records preserved`);
  assert.equal((await db.doc(`${collection}/${unrelatedId}`).get()).exists, true); pass(`${kind}: unrelated assignment preserved`);
  assert.equal((await db.doc(`classes/${classId}`).get()).data().studentIds.includes(student.uid), true); pass(`${kind}: student remains in class`);
  const audit = (await db.doc(`studentAssignmentRemovalAudit/${collection}_${assignmentId}_${student.uid}`).get()).data();
  assert.equal(audit?.state, 'completed'); pass(`${kind}: audit completed`);
  assert.equal((await call(kind, assignmentId, teacher, student.uid)).status, 404); pass(`${kind}: repeat removal rejected`);
}
async function main() {
  const schoolId = `${prefix}-school`;
  const teacher = await signup('teacher');
  const otherTeacher = await signup('other-teacher');
  const student = await signup('student');
  const peer = await signup('peer');
  for (const [actor, role] of [[teacher, 'teacher'], [otherTeacher, 'teacher'], [student, 'student'], [peer, 'student']]) {
    await db.doc(`users/${actor.uid}`).set({ uid: actor.uid, email: actor.email, role, schoolId, accountType: 'school' });
  }
  await db.doc(`schools/${schoolId}`).set({ name: 'Emulator school' });
  const env = { ...process.env, NEXT_PUBLIC_FIREBASE_USE_EMULATORS: 'true', NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT, FIREBASE_ADMIN_PROJECT_ID: PROJECT, BILLING_ENFORCEMENT_MODE: 'off' };
  server = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', `npm run dev -- -p ${PORT}`], { env, stdio: 'inherit', windowsHide: true })
    : spawn('npm', ['run', 'dev', '--', '-p', String(PORT)], { env, stdio: 'inherit' });
  await ready();
  for (const kind of ['general', 'quiz', 'programming', 'exam']) await runKind(kind, teacher, otherTeacher, student, peer, schoolId);
  console.log(`\\nALL ${passed} INDIVIDUAL-STUDENT REMOVAL TESTS PASSED (DEMO EMULATOR ONLY).`);
}
try { await main(); } catch (error) { console.error('STUDENT REMOVAL TEST FAILED:', error); process.exitCode = 1; }
finally {
  if (server) {
    if (process.platform === 'win32') {
      try { execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }); } catch {}
    } else server.kill('SIGTERM');
  }
  await deleteApp(app);
}
