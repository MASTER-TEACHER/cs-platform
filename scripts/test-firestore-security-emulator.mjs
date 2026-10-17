import assert from "node:assert/strict";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const project = "demo-cs-master";
const firestoreHost = "127.0.0.1:8080";
const authHost = "127.0.0.1:9099";

assert.equal(process.env.GCLOUD_PROJECT, project);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, firestoreHost);
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, authHost);
assert.equal(process.env.CSMASTER_SECURITY_TEST_APPROVED, "YES");

const app = initializeApp({ projectId: project });
const db = getFirestore(app);
const run = `security-${Date.now()}`;
const id = (name) => `${run}-${name}`;

const root =
  `http://${firestoreHost}/v1/projects/${project}/databases/(default)/documents`;

let passed = 0;
let failed = 0;

function check(label, actual, expected) {
  if (actual === expected) {
    passed++;
    console.log(`PASS: ${label} (${actual})`);
  } else {
    failed++;
    console.error(
      `FAIL: ${label} — expected ${expected}, received ${actual}`
    );
  }
}

async function signup(name) {
  const email = `${id(name)}@example.test`;

  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        password: "EmulatorOnly!12345",
        returnSecureToken: true
      })
    }
  );

  const data = await response.json();

  assert.equal(
    response.status,
    200,
    `Auth emulator signup failed: ${JSON.stringify(data)}`
  );

  return {
    uid: data.localId,
    token: data.idToken,
    email
  };
}

async function requestAs(user, method, path, body) {
  const headers = {
    Authorization: `Bearer ${user.token}`
  };

  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const url = path.startsWith(":")
    ? root + path
    : root + "/" + path;

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return {
    status: response.status,
    body: await response.text()
  };
}

const integer = (value) => ({
  integerValue: String(value)
});

try {
  const [teacherA, teacherB, studentA] = await Promise.all([
    signup("teacher-a"),
    signup("teacher-b"),
    signup("student-a")
  ]);

  const schoolA = id("school-a");
  const schoolB = id("school-b");
  const classA = id("class-a");
  const classB = id("class-b");
  const assignmentA = id("assignment-a");
  const assignmentB = id("assignment-b");
  const practiceId = id("practice");
  const lessonId = id("lesson");
  const quizId = id("quiz");

  await Promise.all([
    db.doc(`users/${teacherA.uid}`).set({
      uid: teacherA.uid,
      email: teacherA.email,
      role: "teacher",
      schoolId: schoolA,
      accountType: "school",
      plan: "school",
      personalPlan: "free"
    }),

    db.doc(`users/${teacherB.uid}`).set({
      uid: teacherB.uid,
      email: teacherB.email,
      role: "teacher",
      schoolId: schoolB,
      accountType: "school",
      plan: "school",
      personalPlan: "free"
    }),

    db.doc(`users/${studentA.uid}`).set({
      uid: studentA.uid,
      email: studentA.email,
      role: "student",
      schoolId: schoolA,
      accountType: "school",
      plan: "school",
      personalPlan: "free",
      xp: 10,
      streak: 1,
      badges: [],
      completedLessons: [],
      classIds: [classA]
    }),

    db.doc(`classes/${classA}`).set({
      teacherId: teacherA.uid,
      schoolId: schoolA,
      coTeacherIds: [],
      studentIds: [studentA.uid],
      assignmentIds: [assignmentA],
      name: "Class A",
      status: "active"
    }),

    db.doc(`classes/${classB}`).set({
      teacherId: teacherB.uid,
      schoolId: schoolB,
      coTeacherIds: [],
      studentIds: [],
      assignmentIds: [assignmentB],
      name: "Class B",
      status: "active"
    }),

    db.doc(`assignments/${assignmentA}`).set({
      teacherId: teacherA.uid,
      classId: classA,
      studentIds: [studentA.uid],
      type: "quiz",
      resourceId: quizId,
      status: "active"
    }),

    db.doc(`assignments/${assignmentB}`).set({
      teacherId: teacherB.uid,
      classId: classB,
      studentIds: [],
      type: "quiz",
      resourceId: id("quiz-b"),
      status: "active"
    }),

    db.doc(
      `users/${studentA.uid}/programmingPracticeResults/${practiceId}`
    ).set({
      uid: studentA.uid,
      score: 70
    }),

    db.doc(`lessonProgress/${studentA.uid}_${lessonId}`).set({
      studentId: studentA.uid,
      lessonId,
      topicId: id("topic"),
      status: "completed"
    }),

    db.doc(
      `assignmentResults/${assignmentA}_${studentA.uid}`
    ).set({
      studentId: studentA.uid,
      assignmentId: assignmentA,
      classId: classA,
      teacherId: teacherA.uid,
      resourceId: quizId,
      assignmentType: "quiz",
      status: "completed",
      score: 1,
      totalQuestions: 10,
      percentage: 10,
      earnedXP: 1
    })
  ]);

  console.log(
    "\nCS Master Firestore Security Tests — Demo Emulator Only\n"
  );

  let result;

  result = await requestAs(
    teacherB,
    "POST",
    ":runQuery",
    {
      structuredQuery: {
        from: [{ collectionId: "classes" }]
      }
    }
  );

  check(
    "1. Cross-school unrestricted class query denied",
    result.status,
    403
  );

  result = await requestAs(
    teacherB,
    "GET",
    `classes/${classA}`
  );

  check(
    "2. Cross-school class document read denied",
    result.status,
    403
  );

  result = await requestAs(
    teacherB,
    "GET",
    `users/${studentA.uid}/programmingPracticeResults/${practiceId}`
  );

  check(
    "3. Cross-school programming results denied",
    result.status,
    403
  );

  result = await requestAs(
    teacherB,
    "GET",
    `lessonProgress/${studentA.uid}_${lessonId}`
  );

  check(
    "4. Cross-school lesson progress denied",
    result.status,
    403
  );

  result = await requestAs(
    studentA,
    "PATCH",
    `users/${studentA.uid}?updateMask.fieldPaths=xp`,
    {
      fields: {
        xp: integer(999999)
      }
    }
  );

  check(
    "5. Student cannot award themselves XP",
    result.status,
    403
  );

  result = await requestAs(
    studentA,
    "PATCH",
    `assignmentResults/${assignmentA}_${studentA.uid}?updateMask.fieldPaths=score&updateMask.fieldPaths=earnedXP`,
    {
      fields: {
        score: integer(10),
        earnedXP: integer(999999)
      }
    }
  );

  check(
    "6. Student cannot forge quiz score and XP",
    result.status,
    403
  );

  result = await requestAs(
    teacherA,
    "DELETE",
    `assignments/${assignmentA}`
  );

  check(
    "7. Owner can delete an active-class assignment",
    result.status,
    200
  );

  await db.doc(`classes/${classA}`).update({
    status: "deleting"
  });

  result = await requestAs(
    teacherA,
    "DELETE",
    `assignmentResults/${assignmentA}_${studentA.uid}`
  );

  check(
    "8. Client deletion blocked during class cleanup",
    result.status,
    403
  );

} finally {
  await deleteApp(app);
}

console.log(`\nRESULT: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  console.error(
    "Security regression failures detected. Do not deploy these rules."
  );
  process.exitCode = 1;
}
