import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "app/dashboard/page.tsx",
  "app/learn/page.tsx",
  "app/learn/[topicId]/page.tsx",
  "app/quiz/page.tsx",
  "app/programming/page.tsx",
  "app/adaptive-learning/page.tsx",
  "app/knowledge-map/page.tsx",
  "app/analytics/page.tsx",
  "app/assignments/page.tsx",
  "app/assignments/[assignmentId]/page.tsx",
  "app/assignments/programming/page.tsx",
  "app/assignments/programming/[assignmentId]/page.tsx",
  "app/notifications/page.tsx",
  "app/tutor/page.tsx",
  "app/exam-trainer/page.tsx",
  "app/exam-trainer/history/page.tsx",
  "app/profile/page.tsx",
  "app/profile/curriculum/page.tsx",
  "app/join-school/page.tsx",
  "components/student/StudentAccessGate.tsx",
  "services/progressService.ts",
  "services/unifiedAssignmentService.ts",
  "app/api/lessons/complete/route.ts",
  "app/api/quiz/secure/route.ts",
  "app/api/ai/student-tutor/route.ts",
  "app/api/schools/join/route.ts",
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) {
    failures.push(`Missing student production file: ${relative}`);
  }
}

function read(relative) {
  const full = path.join(root, relative);
  return fs.existsSync(full)
    ? fs.readFileSync(full, "utf8")
    : "";
}

const accessGate = read(
  "components/student/StudentAccessGate.tsx",
);

for (const marker of [
  "IndividualPremiumGate",
  "SchoolSubscriptionGate",
  'router.replace("/login")',
  'router.replace("/teacher")',
  'router.replace("/admin")',
  'router.replace("/onboarding")',
]) {
  if (!accessGate.includes(marker)) {
    failures.push(
      `StudentAccessGate is missing expected boundary: ${marker}`,
    );
  }
}

const progressService = read(
  "services/progressService.ts",
);

for (const marker of [
  "/api/lessons/complete",
  "getIdToken",
  "examMarking",
]) {
  if (!progressService.includes(marker)) {
    failures.push(
      `Persistent lesson progress integration is missing: ${marker}`,
    );
  }
}

const notifications = read(
  "app/notifications/page.tsx",
);

for (const marker of [
  "getUnifiedStudentAssignments",
  "isUnifiedAssignmentComplete",
  "isUnifiedAssignmentOverdue",
  "catch (caughtError)",
  "Notifications unavailable",
  "Retry",
]) {
  if (!notifications.includes(marker)) {
    failures.push(
      `Notifications production handling is missing: ${marker}`,
    );
  }
}

const studentCoreFiles = [
  "app/dashboard/page.tsx",
  "app/adaptive-learning/page.tsx",
  "app/knowledge-map/page.tsx",
  "app/analytics/page.tsx",
  "app/programming/page.tsx",
  "app/notifications/page.tsx",
  "components/student/StudentAccessGate.tsx",
];

const suspiciousSequences = [
  "\u00C3\u00B0",
  "\u00F0\u0178",
  "\u00E2\u2020",
  "\u00E2\u20AC",
  "\u00EF\u00B8",
  "\u00C2\u00B7",
  "\uFFFD",
];

for (const relative of studentCoreFiles) {
  const source = read(relative);

  for (const sequence of suspiciousSequences) {
    if (source.includes(sequence)) {
      failures.push(
        `Suspicious encoding sequence ${JSON.stringify(
          sequence,
        )} found in ${relative}`,
      );
    }
  }
}

const dashboard = read(
  "app/dashboard/page.tsx",
);

for (const marker of [
  "buildStudentJourney",
  "useRecentQuiz",
  "useAdaptiveLearning",
  "StudentAnalyticsSnapshot",
]) {
  if (!dashboard.includes(marker)) {
    failures.push(
      `Dashboard student journey integration is missing: ${marker}`,
    );
  }
}

console.log("");
console.log(
  "CS Master student experience production audit",
);
console.log(
  "============================================",
);
console.log(
  `Required files checked: ${requiredFiles.length}`,
);
console.log(
  `Core student files checked for encoding: ${studentCoreFiles.length}`,
);

if (failures.length === 0) {
  console.log("");
  console.log(
    "PASS: student routes, access boundaries, persistence integrations, notifications and core encoding checks are present.",
  );
  process.exit(0);
}

console.error("");
console.error(
  `FAIL: ${failures.length} student production issue(s) found.`,
);

for (const failure of failures) {
  console.error(`- ${failure}`);
}

process.exit(1);
