import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /*
   * Project-wide ESLint ignores.
   *
   * .cs-master-backups contains safety copies of files created
   * before automated CS Master repair/update batches. These are
   * historical backups rather than active application source code,
   * so ESLint must not analyse them.
   */
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // CS Master automated repair/update backups:
    ".cs-master-backups/**",
  ]),
]);

export default eslintConfig;