import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "types/user.ts",
  "types/database.ts",
  "services/userService.ts",
  "data/curriculum/curriculumMap.ts",
  "data/curriculum/supportedCurriculumOptions.ts",
  "app/onboarding/page.tsx",
  "app/profile/curriculum/page.tsx",
  "components/profile/ProfileCourseRepair.tsx",
];

const failures = [];

function read(relativePath) {
  const fullPath = path.join(
    root,
    relativePath,
  );

  if (!fs.existsSync(fullPath)) {
    failures.push(
      `Missing required file: ${relativePath}`,
    );

    return "";
  }

  return fs.readFileSync(
    fullPath,
    "utf8",
  );
}

const userTypes = read(
  "types/user.ts",
);

const database = read(
  "types/database.ts",
);

const userService = read(
  "services/userService.ts",
);

const curriculum = read(
  "data/curriculum/curriculumMap.ts",
);

const options = read(
  "data/curriculum/supportedCurriculumOptions.ts",
);

const onboarding = read(
  "app/onboarding/page.tsx",
);

const curriculumSettings = read(
  "app/profile/curriculum/page.tsx",
);

const profileRepair = read(
  "components/profile/ProfileCourseRepair.tsx",
);

const checks = [
  [
    userTypes.includes(
      '"CREATIVE_IMEDIA"',
    ),
    "Subject type does not include CREATIVE_IMEDIA.",
  ],

  [
    database.includes(
      "subject?:",
    ),
    "User profile subject field is missing.",
  ],

  [
    userService.includes(
      "repairData.subject",
    ) &&
      userService.includes(
        '"COMPUTER_SCIENCE"',
      ),
    "Existing-user subject migration is missing.",
  ],

  [
    userService.includes(
      "selection.subject",
    ),
    "Course-selection service is not reading the selected subject.",
  ],

  [
    userService.includes(
      "updateData.subject",
    ) ||
      userService.includes(
        "subject:",
      ),
    "Course-selection service is not persisting subject.",
  ],

  [
    curriculum.includes(
      'subject: "CREATIVE_IMEDIA"',
    ),
    "Creative iMedia curriculum definition is missing.",
  ],

  [
    curriculum.includes(
      'specificationLabel: "OCR J834"',
    ),
    "OCR J834 specification label is missing.",
  ],

  [
    [
      "imedia-r093",
      "imedia-r094",
      "imedia-r095",
      "imedia-r096",
      "imedia-r097",
      "imedia-r098",
      "imedia-r099",
    ].every((id) =>
      curriculum.includes(id),
    ),
    "One or more OCR J834 units are missing.",
  ],

  [
    options.includes(
      "getSupportedSubjects",
    ) &&
      options.includes(
        "getSupportedQualifications",
      ) &&
      options.includes(
        "getSupportedExamBoards",
      ),
    "Subject-aware curriculum helper functions are missing.",
  ],

  [
    onboarding.includes(
      "getSupportedSubjects",
    ) &&
      onboarding.includes(
        "CREATIVE_IMEDIA",
      ),
    "Student onboarding is not subject-aware.",
  ],

  [
    onboarding.includes(
      "updateUserCourseSelection",
    ) &&
      onboarding.includes(
        "subject",
      ),
    "Student onboarding does not persist the selected subject.",
  ],

  [
    curriculumSettings.includes(
      "getSupportedSubjects",
    ) &&
      curriculumSettings.includes(
        "CREATIVE_IMEDIA",
      ),
    "Profile curriculum settings are not subject-aware.",
  ],

  [
    curriculumSettings.includes(
      "getSupportedExamBoards(",
    ) &&
      curriculumSettings.includes(
        "subject,",
      ),
    "Profile curriculum settings are not filtering exam boards by subject.",
  ],

  [
    curriculumSettings.includes(
      "updateUserCourseSelection",
    ) &&
      curriculumSettings.includes(
        "subject,",
      ),
    "Profile curriculum settings do not persist subject.",
  ],

  [
    profileRepair.includes(
      "getCanonicalSubject",
    ) &&
      profileRepair.includes(
        '"COMPUTER_SCIENCE"',
      ),
    "Legacy profile repair does not provide the Computer Science subject fallback.",
  ],

  [
    profileRepair.includes(
      '"CREATIVE_IMEDIA"',
    ) &&
      profileRepair.includes(
        "Creative iMedia",
      ),
    "Legacy profile repair is not Creative iMedia-aware.",
  ],

  [
    profileRepair.includes(
      "subjectNeedsRepair",
    ) &&
      profileRepair.includes(
        "courseNeedsRepair",
      ),
    "Legacy profile repair does not independently repair subject and course label.",
  ],
];

for (const [ok, message] of checks) {
  if (!ok) {
    failures.push(message);
  }
}

console.log(
  "\nCS Master Creative iMedia student integration audit",
);

console.log(
  "===================================================",
);

console.log(
  `Required files checked: ${requiredFiles.length}`,
);

console.log(
  "Expected OCR J834 units: 7",
);

console.log(
  `Integration checks: ${checks.length}`,
);

if (failures.length === 0) {
  console.log(
    "\nPASS: V1.3.2A Creative iMedia curriculum foundation, student selection, persistence and legacy repair are present.",
  );

  process.exit(0);
}

console.error(
  `\nFAIL: found ${failures.length} issue(s).`,
);

for (const failure of failures) {
  console.error(
    `- ${failure}`,
  );
}

process.exit(1);