import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const reportDir = path.join(root, "reports");

fs.mkdirSync(reportDir, { recursive: true });

function parseFile(relative) {
  const file = path.join(root, relative);
  const text = fs.readFileSync(file, "utf8");

  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
}

function property(object, name) {
  if (!ts.isObjectLiteralExpression(object)) return undefined;

  const entry = object.properties.find((p) =>
    ts.isPropertyAssignment(p) &&
    (
      (ts.isIdentifier(p.name) && p.name.text === name) ||
      (ts.isStringLiteral(p.name) && p.name.text === name)
    )
  );

  return entry?.initializer;
}

function literal(node) {
  if (!node) return undefined;

  if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) return Number(node.text);

  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;

  return undefined;
}

function arrayLength(node) {
  return node && ts.isArrayLiteralExpression(node)
    ? node.elements.length
    : null;
}

function walk(node, callback) {
  callback(node);
  ts.forEachChild(node, (child) => walk(child, callback));
}

function csv(rows, fields) {
  const escape = (value) => {
    const s = String(value ?? "");
    return '"' + s.replace(/"/g, '""') + '"';
  };

  return [
    fields.map(escape).join(","),
    ...rows.map((row) =>
      fields.map((field) => escape(row[field])).join(",")
    ),
  ].join("\r\n") + "\r\n";
}

const imediaFile = parseFile("data/imedia/practiceBank.ts");
const imedia = [];

walk(imediaFile, (node) => {
  if (!ts.isObjectLiteralExpression(node)) return;

  const id = literal(property(node, "id"));
  const unitId = literal(property(node, "unitId"));
  const prompt = literal(property(node, "prompt"));

  if (
    typeof id !== "string" ||
    !id.startsWith("imedia-") ||
    typeof unitId !== "string" ||
    typeof prompt !== "string"
  ) return;

  const marks = literal(property(node, "marks"));
  const assessmentSafe = literal(property(node, "assessmentSafe"));
  const successCriteria = arrayLength(property(node, "successCriteria"));
  const modelGuidance = literal(property(node, "modelGuidance"));

  const marked =
    assessmentSafe === true &&
    Number.isInteger(marks) &&
    marks > 0;

  imedia.push({
    id,
    unit: unitId.toUpperCase(),
    marks: typeof marks === "number" ? marks : "",
    assessmentSafe,
    includedInEnhancedBank: marked ? "Yes" : "No",
    successCriteriaCount: successCriteria ?? "",
    hasModelGuidance:
      typeof modelGuidance === "string" &&
      modelGuidance.trim().length > 0 ? "Yes" : "No",
    markSchemeStatus: marked
      ? "Teacher review required - adapter uses empty marking points"
      : "Formative practice - no formal marks assigned",
  });
});

const seenIds = new Set();
const duplicateIds = [];

for (const item of imedia) {
  if (seenIds.has(item.id)) duplicateIds.push(item.id);
  seenIds.add(item.id);
}

if (duplicateIds.length) {
  throw new Error("Duplicate iMedia IDs: " + duplicateIds.join(", "));
}

const units = [
  "R093", "R094", "R095", "R096",
  "R097", "R098", "R099"
];

const coverage = units.map((unit) => {
  const items = imedia.filter((item) => item.unit === unit);
  const marked = items.filter(
    (item) => item.includedInEnhancedBank === "Yes"
  );

  return {
    subject: "Creative iMedia",
    qualification: "Cambridge National J834",
    examBoard: "OCR",
    unit,
    totalActivities: items.length,
    markedQuestions: marked.length,
    formativeOnly: items.length - marked.length,
    assessmentReady: 0,
    assessmentReadyNote:
      "Not independently verified; marked adaptations require teacher review",
  };
});

const catalogueFiles = [
  "lib/question-bank/staticCatalogue.ts",
  "lib/question-bank/staticCatalogueStage2.ts",
  "lib/question-bank/staticCatalogueExpanded.ts",
  "lib/question-bank/staticCatalogueLargeBatch.ts",
  "lib/question-bank/staticCatalogueBatch4.ts",
];

const csCandidates = [];
const topicLabels = new Map();

for (const relative of catalogueFiles) {
  const file = path.join(root, relative);

  if (!fs.existsSync(file)) continue;

  const source = parseFile(relative);

  walk(source, (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;

    const topic = literal(property(node, "topic"));
    const marks = literal(property(node, "marks"));
    const question = literal(property(node, "question"));

    if (typeof topic === "string") {
      topicLabels.set(
        topic,
        (topicLabels.get(topic) ?? 0) + 1
      );
    }

    if (
      typeof topic === "string" &&
      typeof question === "string" &&
      typeof marks === "number"
    ) {
      const markingPoints = property(node, "markScheme");
      const descriptors = property(node, "levelDescriptors");
      const modelAnswer = literal(property(node, "modelAnswer"));

      let status = "Requires detailed review";

      if (marks <= 0) {
        status = "Invalid mark allocation";
      } else if (
        arrayLength(markingPoints) === 0 &&
        arrayLength(descriptors) === 0
      ) {
        status = "No explicit marking points or level descriptors";
      } else if (
        arrayLength(markingPoints) === null &&
        arrayLength(descriptors) === null
      ) {
        status = "Marking structure requires manual inspection";
      }

      csCandidates.push({
        sourceFile: relative,
        topic,
        marks,
        question,
        markingPointCount: arrayLength(markingPoints) ?? "",
        levelDescriptorCount: arrayLength(descriptors) ?? "",
        hasModelAnswer:
          typeof modelAnswer === "string" &&
          modelAnswer.trim() ? "Yes" : "No",
        status,
      });
    }
  });
}

const topicRows = [...topicLabels.entries()]
  .map(([topic, occurrences]) => ({
    topic,
    sourceOccurrences: occurrences,
  }))
  .sort((a, b) => a.topic.localeCompare(b.topic));

const reports = [
  [
    "question-bank-stage3a-final-imedia-activities.csv",
    imedia,
    [
      "id", "unit", "marks", "assessmentSafe",
      "includedInEnhancedBank", "successCriteriaCount",
      "hasModelGuidance", "markSchemeStatus"
    ],
  ],
  [
    "question-bank-stage3a-final-imedia-coverage.csv",
    coverage,
    [
      "subject", "qualification", "examBoard", "unit",
      "totalActivities", "markedQuestions", "formativeOnly",
      "assessmentReady", "assessmentReadyNote"
    ],
  ],
  [
    "question-bank-stage3a-final-cs-static-candidates.csv",
    csCandidates,
    [
      "sourceFile", "topic", "marks", "question",
      "markingPointCount", "levelDescriptorCount",
      "hasModelAnswer", "status"
    ],
  ],
  [
    "question-bank-stage3a-final-topic-labels.csv",
    topicRows,
    ["topic", "sourceOccurrences"],
  ],
];

for (const [name, rows, fields] of reports) {
  fs.writeFileSync(
    path.join(reportDir, name),
    csv(rows, fields),
    "utf8"
  );
}

const markedCount = imedia.filter(
  (item) => item.includedInEnhancedBank === "Yes"
).length;

console.log("");
console.log("STAGE 3A FINAL AUDIT");
console.log("------------------------------");
console.log("iMedia activities:", imedia.length);
console.log("Marked iMedia questions:", markedCount);
console.log("Formative-only activities:", imedia.length - markedCount);
console.log("Duplicate iMedia IDs:", duplicateIds.length);
console.log("CS static question candidates:", csCandidates.length);
console.log("Raw topic labels found:", topicRows.length);
console.log("");
console.log("Reports written to:", reportDir);
console.log("");
console.log(
  "NOTE: CS static candidates are a source-level quality audit, " +
  "not the authoritative deduplicated UI count."
);
console.log(
  "NOTE: Assessment readiness is not automatically certified."
);

if (imedia.length !== 68 || markedCount !== 20) {
  throw new Error(
    "iMedia source counts differ from the expected Stage 3A baseline. " +
    "Review the catalogue before proceeding."
  );
}