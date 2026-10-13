/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");
const {
  collection, doc, setDoc, getDoc, getDocs,
} = require("firebase/firestore");

async function main() {
  const env = await initializeTestEnvironment({
    projectId: "cs-master-final-dashboard-test",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });

  let passed = 0;
  let failed = 0;

  async function check(name, operation, expected) {
    try {
      if (expected === "allow") {
        await assertSucceeds(operation());
      } else {
        await assertFails(operation());
      }
      console.log("PASS:", name);
      passed++;
    } catch (error) {
      console.log("FAIL:", name);
      console.log(error.message);
      failed++;
    }
  }

  try {
    await env.clearFirestore();

    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      const data = [
        ["users", "teacher-a", { role: "teacher", schoolId: "school-a" }],
        ["users", "teacher-b", { role: "teacher", schoolId: "school-b" }],
        ["users", "student-a", { role: "student", schoolId: "school-a" }],
        ["users", "student-b", { role: "student", schoolId: "school-b" }],
        ["classes", "class-a", { teacherId: "teacher-a", schoolId: "school-a" }],
        ["classes", "class-b", { teacherId: "teacher-b", schoolId: "school-b" }],
        ["classAssignments", "assignment-a", {
          teacherId: "teacher-a",
          classId: "class-a",
          studentIds: ["student-a"],
        }],
        ["classAssignments", "assignment-b", {
          teacherId: "teacher-b",
          classId: "class-b",
          studentIds: ["student-b"],
        }],
        ["assignmentProgress", "assignment-a_student-a", {
          assignmentId: "assignment-a",
          studentId: "student-a",
          status: "completed",
        }],
        ["assignmentProgress", "assignment-b_student-b", {
          assignmentId: "assignment-b",
          studentId: "student-b",
          status: "completed",
        }],
      ];

      for (const [path, id, value] of data) {
        await setDoc(doc(db, path, id), value);
      }

      await setDoc(
        doc(db, "schools", "school-a", "members", "teacher-a"),
        { role: "teacher", status: "active" }
      );
      await setDoc(
        doc(db, "schools", "school-b", "members", "teacher-b"),
        { role: "teacher", status: "active" }
      );
      await setDoc(
        doc(db, "users", "student-a", "quizResults", "quiz-a"),
        { uid: "student-a", score: 8 }
      );
      await setDoc(
        doc(db, "users", "student-b", "quizResults", "quiz-b"),
        { uid: "student-b", score: 7 }
      );
    });

    const a = env.authenticatedContext("teacher-a").firestore();
    const b = env.authenticatedContext("teacher-b").firestore();
    const student = env.authenticatedContext("student-a").firestore();

    await check(
      "Teacher A reads own student's quiz results",
      () => getDocs(collection(a, "users", "student-a", "quizResults")),
      "allow"
    );

    await check(
      "Teacher A blocked from school B quiz results",
      () => getDocs(collection(a, "users", "student-b", "quizResults")),
      "deny"
    );

    await check(
      "Teacher B blocked from school A quiz results",
      () => getDoc(doc(b, "users", "student-a", "quizResults", "quiz-a")),
      "deny"
    );

    await check(
      "Student A reads own quiz results",
      () => getDocs(collection(student, "users", "student-a", "quizResults")),
      "allow"
    );

    await check(
      "Student A blocked from another student's quiz results",
      () => getDocs(collection(student, "users", "student-b", "quizResults")),
      "deny"
    );

    await check(
      "Teacher A reads own class assignment progress",
      () => getDoc(doc(a, "assignmentProgress", "assignment-a_student-a")),
      "allow"
    );

    await check(
      "Teacher A blocked from school B assignment progress",
      () => getDoc(doc(a, "assignmentProgress", "assignment-b_student-b")),
      "deny"
    );

    await check(
      "Student A reads own assignment progress",
      () => getDoc(doc(student, "assignmentProgress", "assignment-a_student-a")),
      "allow"
    );

    await check(
      "Student A blocked from school B assignment progress",
      () => getDoc(doc(student, "assignmentProgress", "assignment-b_student-b")),
      "deny"
    );

    console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
    if (failed) process.exitCode = 1;
  } finally {
    await env.cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
