import type ESlint from "eslint";
import { default as prules } from "../allRules.js";

// Everything not in rules
const rules: ESlint.Linter.RulesRecord = Object.fromEntries(
  Object.entries(prules)
    .filter(([, r]) => !r.meta?.docs?.recommended)
    .map(([k]) => [`@peggyjs/${k}`, "error"])
);

const config: ESlint.ESLint.ConfigData = {
  extends: ["plugin:@peggyjs/recommended"],
  overrides: [
    {
      files: ["**/*.peggy", "**/*.pegjs"],
      rules,
    },
  ],
};

export = config;
