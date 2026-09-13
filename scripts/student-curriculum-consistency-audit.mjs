import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const profilePagePath = path.join(
  root,
  "app/profile/page.tsx",
);

const repairPath = path.join(
  root,
  "components/profile/ProfileCourseRepair.tsx",
);

const failures = [];

for (const file of [
  profilePagePath,
  repairPath,
]) {
  if (!fs.existsSync(file)) {
    failures.push(
      `Missing required file: ${path.relative(root, file)}`,
    );
  }
}

if (failures.length === 0) {
  const profilePage = fs.readFileSync(
    profilePagePath,
    "utf8",
  );

  const repair = fs.readFileSync(
    repairPath,
    "utf8",
  );

  if (
    !profilePage.includes(
      "profile?.qualification",
    ) ||
    !profilePage.includes(
      "profile?.examBoard",
    )
  ) {
    failures.push(
      "Profile page is not deriving the displayed course from qualification and examBoard.",
    );
  }

  if (
    profilePage.includes(
      "profile?.currentCourse?.toUpperCase()",
    )
  ) {
    failures.push(
      "Profile page still treats currentCourse as the primary display source.",
    );
  }

  if (
    !repair.includes(
      "expectedCurrentCourse",
    ) ||
    !repair.includes(
      "existingCurrentCourse ==="
    )
  ) {
    failures.push(
      "ProfileCourseRepair does not compare the stored legacy currentCourse with the canonical derived label.",
    );
  }

  if (
    repair.includes(
      "Boolean(profile.currentCourse?.trim())"
    )
  ) {
    failures.push(
      "ProfileCourseRepair still skips stale non-empty currentCourse values.",
    );
  }
}

console.log("");
console.log(
  "CS Master student curriculum consistency audit",
);
console.log(
  "=============================================",
);

if (failures.length === 0) {
  console.log(
    "PASS: profile course display uses canonical qualification/examBoard state and stale legacy currentCourse values are repairable.",
  );
  process.exit(0);
}

console.error(
  "FAIL: student curriculum consistency issues found.",
);

for (const failure of failures) {
  console.error(`- ${failure}`);
}

process.exit(1);
