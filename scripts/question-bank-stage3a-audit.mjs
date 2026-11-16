import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bankPath = path.join(root, "data/imedia/practiceBank.ts");
const text = fs.readFileSync(bankPath, "utf8");

const ids = [...text.matchAll(
  /"id":\s*"(imedia-r\d{3}-\d+)"/g
)].map((match) => match[1]);

const rows = [
  ["Subject", "Qualification", "Board", "Unit", "Activities", "Target", "Gap"],
];

for (let n = 93; n <= 99; n++) {
  const unit = `r0${n}`;
  const count = ids.filter((id) => id.includes(unit)).length;

  rows.push([
    "Creative iMedia",
    "Cambridge National J834",
    "OCR",
    unit.toUpperCase(),
    String(count),
    "10",
    String(Math.max(0, 10 - count)),
  ]);
}

const directory = path.join(root, "reports");
fs.mkdirSync(directory, { recursive: true });

const csv = rows.map((row) =>
  row.map((value) =>
    `"${String(value).replaceAll('"', '""')}"`
  ).join(",")
).join("\n");

const output = path.join(
  directory,
  "question-bank-stage3a-coverage.csv"
);

fs.writeFileSync(output, csv + "\n");

const duplicates = ids.filter(
  (id, index) => ids.indexOf(id) !== index
);

console.log(`Coverage report: ${output}`);
console.log(`iMedia activities found: ${ids.length}`);
console.log(`Duplicate IDs: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.error("Duplicate activity IDs detected.");
  process.exitCode = 1;
}