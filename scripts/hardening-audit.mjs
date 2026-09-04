import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

const requiredFiles = [
  "app/login/page.tsx",
  "app/forgot-password/page.tsx",
  "app/pricing/page.tsx",
  "app/dashboard/page.tsx",
  "app/assignments/page.tsx",
  "app/quiz/page.tsx",
  "app/api/quiz/secure/route.ts",
  "app/teacher/page.tsx",
  "app/teacher/assignment-wizard/page.tsx",
  "app/teacher/assignments/page.tsx",
  "components/auth/RequireCourse.tsx",
  "components/layout/AppShell.tsx",
  "firestore.rules",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`Missing critical release file: ${file}`);
  }
}

const sourceRoots = ["app", "components", "contexts", "data", "services", "types"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(directory) {
  if (!exists(directory)) return [];

  const output = [];
  const stack = [path.join(root, directory)];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", ".next", ".git", ".cs-master-backups"].includes(entry.name)) {
        continue;
      }

      const absolute = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (sourceExtensions.has(path.extname(entry.name))) {
        output.push(absolute);
      }
    }
  }

  return output;
}

const sourceFiles = sourceRoots.flatMap(walk);

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);

  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);

    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      fail(`Unexpected control character U+${code.toString(16).padStart(4, "0")} in ${relative}`);
      break;
    }
  }
}

function collectAppRoutes() {
  const routes = new Set(["/"]);
  const appRoot = path.join(root, "app");

  if (!fs.existsSync(appRoot)) return routes;

  const stack = [appRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }

      if (entry.name !== "page.tsx" && entry.name !== "page.js" && entry.name !== "page.jsx") {
        continue;
      }

      const relativeDirectory = path.relative(appRoot, path.dirname(absolute));
      const segments = relativeDirectory
        ? relativeDirectory.split(path.sep).filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
        : [];

      routes.add(segments.length === 0 ? "/" : `/${segments.join("/")}`);
    }
  }

  return routes;
}

function routeMatches(reference, route) {
  const referenceSegments = reference === "/" ? [] : reference.replace(/^\//, "").split("/");
  const routeSegments = route === "/" ? [] : route.replace(/^\//, "").split("/");

  if (referenceSegments.length !== routeSegments.length) return false;

  return routeSegments.every((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) return true;
    return segment === referenceSegments[index];
  });
}

const routes = collectAppRoutes();
const literalRoutePattern = /(?:href\s*=\s*|router\.(?:push|replace)\s*\(\s*)["'`]([^"'`$?#]+)["'`]/g;
const missingRoutes = new Map();

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  let match;

  while ((match = literalRoutePattern.exec(text)) !== null) {
    const value = match[1];
    if (!value.startsWith("/") || value.startsWith("//")) continue;

    const reference = value.length > 1 ? value.replace(/\/$/, "") : value;
    const matched = [...routes].some((route) => routeMatches(reference, route));

    if (!matched) {
      const files = missingRoutes.get(reference) ?? new Set();
      files.add(relative);
      missingRoutes.set(reference, files);
    }
  }
}

for (const [route, files] of missingRoutes) {
  fail(`Internal route ${route} has no app page. Referenced by: ${[...files].join(", ")}`);
}

if (exists("firestore.rules")) {
  const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");

  if (rules.includes("allow get: if signedIn();") && rules.includes("match /generatedQuizzes/{quizId}")) {
    warn("Review generatedQuizzes rules: a broad signed-in get rule is present.");
  }

  if (!rules.includes("isStudentForClassAssignment")) {
    warn("Firestore rules do not contain the class-assignment student membership helper.");
  }
}

console.log("\nCS Master hardening audit");
console.log("=========================");
console.log(`Source files checked: ${sourceFiles.length}`);
console.log(`App routes discovered: ${routes.size}`);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.error("\nFAILED:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nPASS: no hardening audit failures found.");
}
