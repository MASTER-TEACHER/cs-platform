import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const bankPath = path.join(
  root,
  "data",
  "a-level",
  "questionBank.ts",
);

const catalogPath = path.join(
  root,
  "data",
  "a-level",
  "topicCatalog.ts",
);

const bank =
  fs.readFileSync(
    bankPath,
    "utf8",
  );

const catalog =
  fs.readFileSync(
    catalogPath,
    "utf8",
  );

const areas = [
  ...catalog.matchAll(
    /"id":\s*"((?:aqa|ocr)-[^"]+)"[\s\S]*?"board":\s*"(AQA|OCR)"[\s\S]*?"title":\s*"([^"]+)"/g,
  ),
].map((match) => ({
  id: match[1],
  board: match[2],
  title: match[3],
}));

const questionBlocks = [
  ...bank.matchAll(
    /\{\s*"id":\s*"al-[^"]+"[\s\S]*?"curriculumAreaIds":\s*\[[\s\S]*?\]\s*\}/g,
  ),
].map((match) => match[0]);

const failures = [];

for (const area of areas) {
  const matching = questionBlocks.filter(
    (block) =>
      block.includes(`"${area.id}"`),
  );

  const difficultyCounts = {
    foundation: matching.filter(
      (block) =>
        block.includes(
          '"difficulty": "foundation"',
        ),
    ).length,
    standard: matching.filter(
      (block) =>
        block.includes(
          '"difficulty": "standard"',
        ),
    ).length,
    advanced: matching.filter(
      (block) =>
        block.includes(
          '"difficulty": "advanced"',
        ),
    ).length,
  };

  if (matching.length < 8) {
    failures.push(
      `${area.id} ${area.title}: ${matching.length} questions; minimum 8`,
    );
  }

  for (
    const level of [
      "foundation",
      "standard",
      "advanced",
    ]
  ) {
    if (
      difficultyCounts[level] < 1
    ) {
      failures.push(
        `${area.id} ${area.title}: no ${level} question`,
      );
    }
  }
}

console.log("");
console.log(
  "CS Master A-level full-specification question audit",
);
console.log(
  "=================================================",
);
console.log(
  `Specification areas checked: ${areas.length}`,
);
console.log(
  `Question records found: ${questionBlocks.length}`,
);

if (failures.length === 0) {
  console.log("");
  console.log(
    "PASS: every AQA/OCR A-level specification area has at least 8 questions and all three difficulty bands.",
  );
  process.exit(0);
}

console.error("");
console.error(
  "FAIL: A-level specification coverage gaps found.",
);

for (
  const failure of failures
) {
  console.error(
    `- ${failure}`,
  );
}

process.exit(1);
