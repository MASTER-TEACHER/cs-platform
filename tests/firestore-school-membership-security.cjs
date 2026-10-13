/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");

const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");

const {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
} = require("firebase/firestore");

async function main() {
  const env = await initializeTestEnvironment({
    projectId: "cs-master-school-membership-security",
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

      const users = [
        ["teacher-active", {
          role: "teacher",
          schoolId: "school-a",
        }],
        ["teacher-inactive", {
          role: "teacher",
          schoolId: "school-a",
        }],
        ["teacher-no-membership", {
          role: "teacher",
          schoolId: "school-a",
        }],
        ["teacher-other-school", {
          role: "teacher",
          schoolId: "school-b",
        }],
        ["student-a", {
          role: "student",
          schoolId: "school-a",
        }],
      ];

      for (const [id, data] of users) {
        await setDoc(doc(db, "users", id), data);
      }

      await setDoc(
        doc(db, "schools", "school-a", "members", "teacher-active"),
        { role: "teacher", status: "active" }
      );

      await setDoc(
        doc(db, "schools", "school-a", "members", "teacher-inactive"),
        { role: "teacher", status: "inactive" }
      );

      await setDoc(
        doc(db, "schools", "school-b", "members", "teacher-other-school"),
        { role: "teacher", status: "active" }
      );

      await setDoc(
        doc(db, "users", "student-a", "quizResults", "quiz-a"),
        {
          uid: "student-a",
          score: 8,
        }
      );
    });

    const active = env.authenticatedContext(
      "teacher-active"
    ).firestore();

    const inactive = env.authenticatedContext(
      "teacher-inactive"
    ).firestore();

    const noMembership = env.authenticatedContext(
      "teacher-no-membership"
    ).firestore();

    const otherSchool = env.authenticatedContext(
      "teacher-other-school"
    ).firestore();

    const student = env.authenticatedContext(
      "student-a"
    ).firestore();

    const guest = env.unauthenticatedContext().firestore();

    const quizDoc = (db) =>
      getDoc(
        doc(db, "users", "student-a", "quizResults", "quiz-a")
      );

    const quizList = (db) =>
      getDocs(
        collection(db, "users", "student-a", "quizResults")
      );

    await check(
      "Active school teacher can read quiz document",
      () => quizDoc(active),
      "allow"
    );

    await check(
      "Active school teacher can list quiz results",
      () => quizList(active),
      "allow"
    );

    await check(
      "Inactive teacher cannot read quiz document",
      () => quizDoc(inactive),
      "deny"
    );

    await check(
      "Inactive teacher cannot list quiz results",
      () => quizList(inactive),
      "deny"
    );

    await check(
      "Teacher without membership cannot read quiz document",
      () => quizDoc(noMembership),
      "deny"
    );

    await check(
      "Teacher without membership cannot list quiz results",
      () => quizList(noMembership),
      "deny"
    );

    await check(
      "Other-school teacher cannot read quiz document",
      () => quizDoc(otherSchool),
      "deny"
    );

    await check(
      "Other-school teacher cannot list quiz results",
      () => quizList(otherSchool),
      "deny"
    );

    await check(
      "Unauthenticated user cannot read quiz document",
      () => quizDoc(guest),
      "deny"
    );

    await check(
      "Unauthenticated user cannot list quiz results",
      () => quizList(guest),
      "deny"
    );

    await check(
      "Student can read own quiz document",
      () => quizDoc(student),
      "allow"
    );

    await check(
      "Student can list own quiz results",
      () => quizList(student),
      "allow"
    );

    console.log("");
    console.log(`RESULT: ${passed} passed, ${failed} failed`);

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