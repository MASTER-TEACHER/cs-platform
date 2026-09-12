import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const mapPath = path.join(
  root,
  "data",
  "curriculum",
  "curriculumMap.ts",
);

const supplementalPath = path.join(
  root,
  "data",
  "curriculum",
  "topics",
  "a-level",
  "supplemental-lessons.ts",
);

const map =
  fs.readFileSync(
    mapPath,
    "utf8",
  );

const supplemental =
  fs.readFileSync(
    supplementalPath,
    "utf8",
  );

const requiredAqa = [
  "4.1 Fundamentals of Programming",
  "4.2 Fundamentals of Data Structures",
  "4.3 Fundamentals of Algorithms",
  "4.4 Theory of Computation",
  "4.5 Fundamentals of Data Representation",
  "4.6 Fundamentals of Computer Systems",
  "4.7 Computer Organisation and Architecture",
  "4.8 Consequences of Uses of Computing",
  "4.9 Communication and Networking",
  "4.10 Fundamentals of Databases",
  "4.11 Big Data",
  "4.12 Functional Programming",
  "4.13 Systematic Approach to Problem Solving",
  "4.14 Non-exam Assessment: Computing Practical Project",
];

const requiredOcr = [
  "1.1 Processors, Input, Output and Storage",
  "1.2 Software and Software Development",
  "1.3 Exchanging Data",
  "1.4 Data Types, Data Structures and Algorithms",
  "1.5 Legal, Moral, Cultural and Ethical Issues",
  "2.1 Elements of Computational Thinking",
  "2.2 Problem Solving and Programming",
  "2.3 Algorithms",
  "03 Programming Project",
];

const failures = [];

for (
  const title of [
    ...requiredAqa,
    ...requiredOcr,
  ]
) {
  if (
    !map.includes(
      `title: "${title}"`,
    )
  ) {
    failures.push(
      `Missing curriculum unit: ${title}`,
    );
  }
}

const supplementalLessonCount =
  (
    supplemental.match(
      /"id":\s*"al-/g,
    ) || []
  ).length;

if (
  supplementalLessonCount < 18
) {
  failures.push(
    `Only ${supplementalLessonCount} supplemental A-level lessons found; expected at least 18.`,
  );
}

console.log("");
console.log(
  "CS Master A-level curriculum audit",
);
console.log(
  "================================",
);
console.log(
  `AQA major specification areas expected: ${requiredAqa.length}`,
);
console.log(
  `OCR major specification areas expected: ${requiredOcr.length}`,
);
console.log(
  `Supplemental lessons found: ${supplementalLessonCount}`,
);

if (
  failures.length === 0
) {
  console.log("");
  console.log(
    "PASS: complete major AQA/OCR A-level specification structure is present and lesson coverage has been expanded.",
  );
  process.exit(0);
}

console.error("");
console.error(
  "FAIL: A-level curriculum coverage gaps found.",
);

for (
  const failure of failures
) {
  console.error(
    `- ${failure}`,
  );
}

process.exit(1);
