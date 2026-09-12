import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "app/nea/page.tsx",
  "app/teacher/nea/page.tsx",
  "app/teacher/nea/[projectId]/page.tsx",
  "app/api/nea/projects/route.ts",
  "app/api/nea/projects/[projectId]/route.ts",
  "app/api/ai/nea-coach/route.ts",
  "lib/nea/constants.ts",
  "lib/nea/guidance.ts",
  "types/nea.ts",
];

const failures = [];

for (const relative of requiredFiles) {
  const full = path.join(root, relative);

  if (!fs.existsSync(full)) {
    failures.push(`Missing file: ${relative}`);
  }
}

const detailRoute = fs.readFileSync(
  path.join(
    root,
    "app/api/nea/projects/[projectId]/route.ts",
  ),
  "utf8",
);

const requiredActions = [
  "update-progress",
  "complete-stage",
  "update-milestone",
  "add-evidence",
  "update-evidence",
  "delete-evidence",
  "add-feedback",
  "add-teacher-note",
  "submit-project",
  "return-to-active",
  "complete-project",
  "archive-project",
  "restore-project",
];

for (const action of requiredActions) {
  if (!detailRoute.includes(`"${action}"`)) {
    failures.push(`Missing NEA API action: ${action}`);
  }
}

const coachRoute = fs.readFileSync(
  path.join(
    root,
    "app/api/ai/nea-coach/route.ts",
  ),
  "utf8",
);

const safeguards = [
  "MUST NOT write",
  "complete project solution",
  "fabricated test evidence",
  "ready-to-submit evaluation",
];

for (const phrase of safeguards) {
  if (!coachRoute.includes(phrase)) {
    failures.push(
      `NEA Coach safeguard missing: ${phrase}`,
    );
  }
}

console.log("");
console.log(
  "CS Master NEA production closure audit",
);
console.log(
  "=====================================",
);
console.log(
  `Required files checked: ${requiredFiles.length}`,
);
console.log(
  `Workflow actions checked: ${requiredActions.length}`,
);
console.log(
  `Coach safeguards checked: ${safeguards.length}`,
);

if (failures.length === 0) {
  console.log("");
  console.log(
    "PASS: NEA production workflow, evidence management, teacher review and AI safeguards are present.",
  );
  process.exit(0);
}

console.error("");
console.error(
  "FAIL: NEA production closure gaps found.",
);

for (const failure of failures) {
  console.error(`- ${failure}`);
}

process.exit(1);
