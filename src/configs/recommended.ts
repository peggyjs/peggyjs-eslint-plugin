import type ESlint from "eslint";
import { default as prules } from "../allRules.js";

const rules: ESlint.Linter.RulesRecord = Object.fromEntries(
  Object.entries(prules)
    .filter(([, r]) => r.meta?.docs?.recommended)
    .map(([k]) => [`@peggyjs/${k}`, "error"])
);
// The processor will not receive a Unicode Byte Order Mark.
rules["unicode-bom"] = "off";

const config: ESlint.ESLint.ConfigData = {
  plugins: ["@peggyjs"],
  overrides: [
    {
      files: ["**/*.peggy", "**/*.pegjs"],
      parser: "@peggyjs/eslint-parser",
      settings: {
        "@peggyjs/indent": 2,
        "@peggyjs/newline": "\n",
      },
      rules,
    },
  ],
};

export = config;
