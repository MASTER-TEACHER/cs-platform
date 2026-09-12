import fs from "node:fs";
import path from "node:path";

const projectRoot = process.argv[2];

if (!projectRoot) {
  throw new Error("Project root argument is required.");
}

const packagePath = path.join(projectRoot, "package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

pkg.scripts ??= {};
pkg.scripts["encoding:audit"] = "node scripts/encoding-audit.mjs";

const verify = String(pkg.scripts.verify || "");

if (!verify.includes("npm run encoding:audit")) {
  if (verify.includes("npm run hardening:audit")) {
    pkg.scripts.verify = verify.replace(
      "npm run hardening:audit",
      "npm run encoding:audit && npm run hardening:audit",
    );
  } else if (verify.trim()) {
    pkg.scripts.verify = `npm run encoding:audit && ${verify}`;
  } else {
    pkg.scripts.verify =
      "npm run lint && npm run typecheck && npm run encoding:audit && npm run hardening:audit && npm run build";
  }
}

fs.writeFileSync(
  packagePath,
  `${JSON.stringify(pkg, null, 2)}\n`,
  "utf8",
);

console.log("package.json updated with encoding:audit.");
