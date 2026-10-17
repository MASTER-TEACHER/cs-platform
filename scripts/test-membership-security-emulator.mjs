import assert from 'node:assert/strict';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const project = 'demo-cs-master';
assert.equal(process.env.GCLOUD_PROJECT, project, 'Use the demo project only');
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080');
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099');
assert.equal(process.env.CSMASTER_MEMBERSHIP_TEST_APPROVED, 'YES');

const app = initializeApp({ projectId: project }, `membership-${Date.now()}`);
const db = getFirestore(app);
const authRoot = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key';
const docRoot = `http://127.0.0.1:8080/v1/projects/${project}/databases/(default)/documents`;
const prefix = `membership-${Date.now()}`;
let passed = 0;

async function user(label) {
  const email = `${prefix}-${label}@example.test`;
  const response = await fetch(authRoot, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'EmulatorOnly!12345', returnSecureToken: true }) });
  const data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  return { uid: data.localId, token: data.idToken, email };
}

async function patch(actor, uid, classIds) {
  const response = await fetch(`${docRoot}/users/${uid}?updateMask.fieldPaths=classIds`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${actor.token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ fields: { classIds: { arrayValue: { values: classIds.map(value => ({ stringValue: value })) } } } })
  });
  return { status: response.status, body: await response.text() };
}

async function expectStatus(label, actor, uid, ids, expected) {
  const result = await patch(actor, uid, ids);
  assert.equal(result.status, expected, `${label}: ${result.body}`);
  passed++;
  console.log(`PASS ${passed}: ${label} (${result.status})`);
}

try {
  const [student, teacher, otherTeacher] = await Promise.all([user('student'), user('teacher'), user('other-teacher')]);
  const schoolA = `${prefix}-school-a`, schoolB = `${prefix}-school-b`;
  const classA = `${prefix}-class-a`, classB = `${prefix}-class-b`;
  await Promise.all([
    db.doc(`users/${student.uid}`).set({ uid: student.uid, email: student.email, role: 'student', schoolId: schoolA, accountType: 'school', plan: 'school', personalPlan: 'free', classIds: [classA] }),
    db.doc(`users/${teacher.uid}`).set({ uid: teacher.uid, email: teacher.email, role: 'teacher', schoolId: schoolA, accountType: 'school', plan: 'school', personalPlan: 'free' }),
    db.doc(`users/${otherTeacher.uid}`).set({ uid: otherTeacher.uid, email: otherTeacher.email, role: 'teacher', schoolId: schoolB, accountType: 'school', plan: 'school', personalPlan: 'free' })
  ]);

  console.log('\nCS Master Membership Security — Demo Emulator Only\n');
  await expectStatus('Student cannot add classId', student, student.uid, [classA, classB], 403);
  await expectStatus('Student cannot remove classId', student, student.uid, [], 403);
  await expectStatus('Cross-school teacher cannot edit membership', otherTeacher, student.uid, [classA, classB], 403);
  await expectStatus('Same-school teacher can enrol student', teacher, student.uid, [classA, classB], 200);
  await expectStatus('Same-school teacher can remove class membership', teacher, student.uid, [classA], 200);
  const snapshot = await db.doc(`users/${student.uid}`).get();
  assert.deepEqual(snapshot.data().classIds, [classA]);
  console.log(`\nALL ${passed} MEMBERSHIP RULE TESTS PASSED (EMULATOR ONLY).`);
  console.log('NOT COVERED: /api/classes/join, school-exit transaction, browser acceptance.');
} finally {
  await deleteApp(app);
}
