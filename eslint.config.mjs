import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Code Connect templates must default-export a plain object literal
  { files: ["figma/**/*.figma.ts"], rules: { "import/no-anonymous-default-export": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Figma plugin snippets: concatenated with lib.js and run inside Figma by scripts/figma/run.sh
    "scripts/figma/*.js",
    // Storybook build output
    "storybook-static/**",
  ]),
]);

export default eslintConfig;
