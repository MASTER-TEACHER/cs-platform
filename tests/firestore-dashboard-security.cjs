/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");

const {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} = require("firebase/firestore");

async function main() {
  const env = await initializeTestEnvironment({
    projectId: "cs-master-security-test",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });

  const teacherA = "test-teacher-a";
  const teacherB = "test-teacher-b";
  const studentA = "test-student-a";
  const studentB = "test-student-b";

  let passed = 0;
  let failed = 0;

  async function check(name, operation, shouldSucceed) {
    try {
      if (shouldSucceed) {
        await assertSucceeds(operation());
      } else {
        await assertFails(operation());
      }
      console.log("PASS:", name);
      passed++;
    } catch (error) {
      console.error("FAIL:", name);
      console.error(error.message);
      failed++;
    }
  }

  try {
    await env.clearFirestore();

    await env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();

      const records = [
        ["users", teacherA, { uid: teacherA, role: "teacher", schoolId: "school-a" }],
        ["users", teacherB, { uid: teacherB, role: "teacher", schoolId: "school-b" }],
        ["users", studentA, { uid: studentA, role: "student", schoolId: "school-a" }],
        ["users", studentB, { uid: studentB, role: "student", schoolId: "school-b" }],
        ["classes", "class-a", { teacherId: teacherA, schoolId: "school-a", studentIds: [studentA] }],
        ["classes", "class-b", { teacherId: teacherB, schoolId: "school-b", studentIds: [studentB] }],
        ["assignmentResults", "quiz-a_test-student-a", {
          teacherId: teacherA, studentId: studentA, classId: "class-a",
          assignmentId: "quiz-a", status: "completed",
        }],
        ["assignmentResults", "quiz-b_test-student-b", {
          teacherId: teacherB, studentId: studentB, classId: "class-b",
          assignmentId: "quiz-b", status: "completed",
        }],
        ["examSubmissions", "exam-a_test-student-a", {
          teacherId: teacherA, studentId: studentA, classId: "class-a",
          assignmentId: "exam-a", status: "submitted",
        }],
        ["examSubmissions", "exam-b_test-student-b", {
          teacherId: teacherB, studentId: studentB, classId: "class-b",
          assignmentId: "exam-b", status: "submitted",
        }],
      ];

      for (const [path, id, data] of records) {
        await setDoc(doc(db, path, id), data);
      }
    });

    const teacherDbA = env.authenticatedContext(teacherA).firestore();
    const teacherDbB = env.authenticatedContext(teacherB).firestore();
    const studentDbA = env.authenticatedContext(studentA).firestore();
    const guestDb = env.unauthenticatedContext().firestore();

    for (const [label, path] of [
      ["Assignment results", "assignmentResults"],
      ["Exam submissions", "examSubmissions"],
    ]) {
      await check(
        `${label}: Teacher A reads own records`,
        () => getDocs(query(collection(teacherDbA, path), where("teacherId", "==", teacherA))),
        true
      );

      await check(
        `${label}: Teacher A cannot query Teacher B records`,
        () => getDocs(query(collection(teacherDbA, path), where("teacherId", "==", teacherB))),
        false
      );

      await check(
        `${label}: Teacher B reads own records`,
        () => getDocs(query(collection(teacherDbB, path), where("teacherId", "==", teacherB))),
        true
      );

      await check(
        `${label}: Student A reads own records`,
        () => getDocs(query(collection(studentDbA, path), where("studentId", "==", studentA))),
        true
      );

      await check(
        `${label}: Student A cannot query Student B records`,
        () => getDocs(query(collection(studentDbA, path), where("studentId", "==", studentB))),
        false
      );

      await check(
        `${label}: Unauthenticated user denied`,
        () => getDocs(query(collection(guestDb, path), where("teacherId", "==", teacherA))),
        false
      );
    }

    await check(
      "Teacher A cannot read Teacher B class",
      () => getDoc(doc(teacherDbA, "classes", "class-b")),
      false
    );

    console.log(`\nRESULT: ${passed} passed, ${failed} failed`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await env.cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
