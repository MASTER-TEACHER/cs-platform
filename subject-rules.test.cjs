/* eslint-disable @typescript-eslint/no-require-imports */
/* Run with: firebase emulators:exec --only firestore --project demo-cs-master "node scripts/subject-rules.test.cjs" */
const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, updateDoc } = require('firebase/firestore');

const CS = 'COMPUTER_SCIENCE';
const IM = 'CREATIVE_IMEDIA';
const profile = (uid, overrides = {}) => ({
  uid, email: `${uid}@example.test`, name: 'Test Student', role: 'student',
  accountIntent: 'student', accountType: 'individual', personalPlan: 'free', plan: 'free',
  schoolId: '', classIds: [], subject: CS, activeSubject: CS,
  enrolledSubjects: [CS, IM], subjectPreferences: {
    [CS]: { qualification: 'GCSE', examBoard: 'OCR', currentCourse: 'GCSE' },
    [IM]: { qualification: 'GCSE', examBoard: 'OCR', currentCourse: 'GCSE' },
  },
  qualification: 'GCSE', examBoard: 'OCR', currentCourse: 'GCSE',
  onboardingComplete: true, ...overrides,
});

async function main() {
  const env = await initializeTestEnvironment({
    projectId: 'demo-cs-master',
    firestore: { host: '127.0.0.1', port: 8080,
      rules: fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8') },
  });
  let passed = 0;
  let failed = 0;
  async function check(label, fn) {
    try { await fn(); console.log(`PASS ${label}`); passed++; }
    catch (e) { console.error(`FAIL ${label}: ${e.message}`); failed++; }
  }
  try {
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      const { setDoc } = require('firebase/firestore');
      await setDoc(doc(db, 'users', 'alice'), profile('alice'));
      await setDoc(doc(db, 'users', 'bob'), profile('bob', { enrolledSubjects: [CS], subjectPreferences: { [CS]: { qualification: 'GCSE', examBoard: 'OCR' } } }));
      await setDoc(doc(db, 'users', 'legacy'), {
        uid: 'legacy', email: 'legacy@example.test', role: 'student',
        subject: CS, qualification: 'GCSE', examBoard: 'OCR', onboardingComplete: true,
      });
    });
    const alice = env.authenticatedContext('alice').firestore();
    const bob = env.authenticatedContext('bob').firestore();
    const legacy = env.authenticatedContext('legacy').firestore();
    const unauth = env.unauthenticatedContext().firestore();
    const aliceDoc = doc(alice, 'users', 'alice');
    const bobDoc = doc(bob, 'users', 'bob');
    await check('Student reads own profile', () => assertSucceeds(getDoc(aliceDoc)));
    await check('Unauthenticated user cannot read profile', () => assertFails(getDoc(doc(unauth, 'users', 'alice'))));
    await check('Student cannot read another student profile', () => assertFails(getDoc(doc(alice, 'users', 'bob'))));
    await check('Switch enrolled subject and preserve legacy subject mirror', () => assertSucceeds(updateDoc(aliceDoc, { subject: IM, activeSubject: IM, examBoard: 'OCR' })));
    await check('Switch back to Computer Science', () => assertSucceeds(updateDoc(aliceDoc, { subject: CS, activeSubject: CS })));
    await check('Reject mismatched subject and activeSubject', () => assertFails(updateDoc(aliceDoc, { subject: CS, activeSubject: IM })));
    await check('Reject invalid subject', () => assertFails(updateDoc(aliceDoc, { subject: 'OTHER', activeSubject: 'OTHER' })));
    await check('Reject subscription privilege escalation', () => assertFails(updateDoc(aliceDoc, { personalPlan: 'premium', plan: 'premium' })));
    await check('Reject role privilege escalation', () => assertFails(updateDoc(aliceDoc, { role: 'admin' })));
    await check('Reject arbitrary class membership', () => assertFails(updateDoc(aliceDoc, { classIds: ['unapproved-class'] })));
    await check('Reject editing another user profile', () => assertFails(updateDoc(doc(alice, 'users', 'bob'), { name: 'Tampered' })));
    await check('Legacy profile can update curriculum', () => assertSucceeds(updateDoc(doc(legacy, 'users', 'legacy'), { qualification: 'A_LEVEL' })));
    // SECURITY EXPECTATION: These tests reveal whether self-enrolment is currently unrestricted.
    await check('Reject switching to a subject not enrolled in', () => assertFails(updateDoc(bobDoc, { subject: IM, activeSubject: IM })));
    await check('Reject self-enrolling in a second subject without authorization', () => assertFails(updateDoc(bobDoc, { enrolledSubjects: [CS, IM] })));
  } finally { await env.cleanup(); }
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
}
main().catch(err => { console.error(err); process.exitCode = 1; });
