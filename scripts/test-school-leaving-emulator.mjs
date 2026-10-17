import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT = 'demo-cs-master';
const PORT = 3133;
const BASE = `http://127.0.0.1:${PORT}`;
for (const [key, expected] of Object.entries({
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  GCLOUD_PROJECT: PROJECT,
})) assert.equal(process.env[key], expected, `Unsafe emulator environment: ${key}`);
assert.equal(process.env.CSMASTER_LEAVE_TEST_APPROVED, 'YES', 'Set CSMASTER_LEAVE_TEST_APPROVED=YES');
const app = initializeApp({ projectId: PROJECT }, `leave-${Date.now()}`);
const db = getFirestore(app);
const prefix = `leave-${Date.now()}`;
let server;
let passed = 0;
function pass(label) { console.log(`PASS ${++passed}: ${label}`); }
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
async function call(actor, body = {}) {
  const response = await fetch(`${BASE}/api/schools/leave`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(actor ? { authorization: `Bearer ${actor.token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}
function expectStatus(result, status, label) {
  assert.equal(result.status, status, `${label}: ${JSON.stringify(result.body)}`);
  pass(label);
}
async function startServer() {
  try {
    const response = await fetch(`${BASE}/api/schools/leave`);
    throw new Error(`Port ${PORT} is already in use (${response.status}); stop that server first.`);
  } catch (error) {
    if (String(error.message).includes('already in use')) throw error;
  }
  const env = {
    ...process.env,
    NEXT_PUBLIC_FIREBASE_USE_EMULATORS: 'true',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT,
    FIREBASE_ADMIN_PROJECT_ID: PROJECT,
    BILLING_ENFORCEMENT_MODE: 'off',
    CSMASTER_ENABLE_EMULATOR_CLASS_DELETE: 'false',
  };
  server = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', `npm run dev -- -p ${PORT}`], { env, stdio: 'inherit', windowsHide: true })
    : spawn('npm', ['run', 'dev', '--', '-p', String(PORT)], { env, stdio: 'inherit' });
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(`Next dev server exited: ${server.exitCode}`);
    try {
      const result = await call(null);
      if (result.status === 401) return;
    } catch {}
    await sleep(1000);
  }
  throw new Error('Next dev server not ready');
}
async function main() {
  const schoolA = `${prefix}-school-a`, schoolB = `${prefix}-school-b`;
  const classA = `${prefix}-class-a`, classB = `${prefix}-class-b`, foreignClass = `${prefix}-foreign`;
  const student = await signup('student');
  const otherStudent = await signup('other-student');
  const teacher = await signup('teacher');
  const individual = await signup('individual');
  for (const id of [schoolA, schoolB]) await db.doc(`schools/${id}`).set({ name: id, status: 'active' });
  const progress = { xp: 145, streak: 6, completedLessons: ['binary-intro'], completedTopics: ['binary'], completedUnits: ['data-representation'], completedPapers: ['paper-1'], badges: ['starter'] };
  await db.doc(`users/${student.uid}`).set({ uid: student.uid, email: student.email, role: 'student', schoolId: schoolA, accountType: 'school', plan: 'school', personalPlan: 'premium', classIds: [classA, classB], ...progress });
  await db.doc(`users/${otherStudent.uid}`).set({ uid: otherStudent.uid, email: otherStudent.email, role: 'student', schoolId: schoolA, accountType: 'school', plan: 'school', personalPlan: 'free', classIds: [classA] });
  await db.doc(`users/${teacher.uid}`).set({ uid: teacher.uid, email: teacher.email, role: 'teacher', schoolId: schoolA, accountType: 'school', plan: 'school' });
  await db.doc(`users/${individual.uid}`).set({ uid: individual.uid, email: individual.email, role: 'student', schoolId: null, accountType: 'individual', plan: 'free', classIds: [] });
  for (const u of [student, otherStudent]) await db.doc(`schools/${schoolA}/members/${u.uid}`).set({ schoolId: schoolA, userId: u.uid, role: 'student', status: 'active' });
  const studentRecord = (u) => ({ studentId: u.uid, displayName: u.email, email: u.email });
  await db.doc(`classes/${classA}`).set({ schoolId: schoolA, status: 'active', studentIds: [student.uid, otherStudent.uid], students: [studentRecord(student), studentRecord(otherStudent)] });
  await db.doc(`classes/${classB}`).set({ schoolId: schoolA, status: 'active', studentIds: [student.uid], students: [studentRecord(student)] });
  await db.doc(`classes/${foreignClass}`).set({ schoolId: schoolB, status: 'active', studentIds: [otherStudent.uid], students: [studentRecord(otherStudent)] });
  await startServer();
  expectStatus(await call(null), 401, 'Unauthenticated leave denied');
  expectStatus(await call(teacher), 403, 'Teacher cannot use student self-leave');
  expectStatus(await call(individual), 409, 'Individual without school cannot leave');
  const exit = await call(student, { userId: otherStudent.uid, schoolId: schoolB });
  expectStatus(exit, 200, 'Student exits own school despite untrusted request body');
  assert.equal(exit.body.success, true);
  assert.equal(exit.body.removedFromClasses, 2); pass('Exit reports two affected classes');
  const profile = (await db.doc(`users/${student.uid}`).get()).data();
  assert.equal(profile.schoolId, null); assert.equal(profile.accountType, 'individual'); assert.equal(profile.plan, 'premium'); assert.deepEqual(profile.classIds, []);
  pass('Account restored to personal premium with no class IDs');
  for (const [key, value] of Object.entries(progress)) assert.deepEqual(profile[key], value, `${key} was changed`);
  pass('XP, streak, progress, papers and badges preserved');
  const membership = (await db.doc(`schools/${schoolA}/members/${student.uid}`).get()).data();
  assert.equal(membership.status, 'former'); assert.ok(membership.leftAt); pass('School membership marked former with timestamp');
  for (const id of [classA, classB]) {
    const c = (await db.doc(`classes/${id}`).get()).data();
    assert.ok(!c.studentIds.includes(student.uid), `${id}: stale studentIds`);
    assert.ok(!c.students.some(s => s.studentId === student.uid), `${id}: stale students`);
  }
  pass('Student removed from both class membership representations');
  const a = (await db.doc(`classes/${classA}`).get()).data();
  assert.ok(a.studentIds.includes(otherStudent.uid)); assert.ok(a.students.some(s => s.studentId === otherStudent.uid));
  const untouched = (await db.doc(`users/${otherStudent.uid}`).get()).data();
  assert.equal(untouched.schoolId, schoolA); assert.deepEqual(untouched.classIds, [classA]);
  pass('Other student remains enrolled and unchanged');
  const foreign = (await db.doc(`classes/${foreignClass}`).get()).data();
  assert.deepEqual(foreign.studentIds, [otherStudent.uid]); pass('Other school class untouched');
  expectStatus(await call(student), 409, 'Repeated exit safely rejected without modifying records');
  console.log(`\nALL ${passed} BASELINE SCHOOL-LEAVING TESTS PASSED (DEMO EMULATOR ONLY).`);
  console.log('NOT COVERED: legacy students-only rosters, concurrent joins, >100 classes, browser acceptance.');
}
try { await main(); } catch (error) { console.error('\nSCHOOL-LEAVING TEST FAILED:', error); process.exitCode = 1; }
finally {
  if (server) {
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }).on('error', () => {});
    else server.kill('SIGTERM');
    await sleep(1200);
  }
  await deleteApp(app);
}
