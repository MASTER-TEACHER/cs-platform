import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const rootsToScan = [
  "app",
  "components",
  "contexts",
  "data",
  "hooks",
  "lib",
  "scripts",
  "services",
  "styles",
  "types",
  "utils",
];

const extensions = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".css",
]);

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "node_modules",
  "cleanup-reports",
]);

const suspiciousPatterns = [
  { label: "UTF-8 emoji decoded as legacy text", value: "ðŸ" },
  { label: "double-encoded UTF-8 text", value: "Ã°" },
  { label: "mis-decoded punctuation or emoji", value: "â€" },
  { label: "mis-decoded arrow or symbol", value: "â†" },
  { label: "mis-decoded variation selector", value: "ï¸" },
  { label: "replacement character", value: "�" },
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (
      entry.isFile() &&
      extensions.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = rootsToScan.flatMap((entry) =>
  walk(path.join(root, entry)),
);

const failures = [];

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of suspiciousPatterns) {
      if (line.includes(pattern.value)) {
        failures.push({
          file: path.relative(root, filePath),
          line: index + 1,
          label: pattern.label,
          preview: line.trim().slice(0, 180),
        });
      }
    }
  });
}

console.log("");
console.log("CS Master encoding / mojibake audit");
console.log("===================================");
console.log(`Source files checked: ${files.length}`);

if (failures.length === 0) {
  console.log("");
  console.log("PASS: no common mojibake sequences found.");
  process.exit(0);
}

console.error("");
console.error(`FAIL: found ${failures.length} suspicious encoding occurrence(s).`);
console.error("");

for (const failure of failures) {
  console.error(`${failure.file}:${failure.line} - ${failure.label}`);
  console.error(`  ${failure.preview}`);
}

console.error("");
console.error("Fix the source text before committing or deploying.");

process.exit(1);
