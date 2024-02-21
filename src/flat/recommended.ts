import * as parser from "@peggyjs/eslint-parser";
import * as peggyjs from "../index.js";
import type ESlint from "eslint";

const rules: ESlint.Linter.RulesRecord = Object.fromEntries(
  Object.entries(peggyjs.rules)
    .filter(([, r]) => r.meta?.docs?.recommended)
    .map(([k]) => [`@peggyjs/${k}`, "error"])
);
// The processor will not receive a Unicode Byte Order Mark.
rules["unicode-bom"] = "off";

const config: ESlint.Linter.FlatConfig = {
  files: [
    "**/*.peggy",
    "**/*.pegjs",
  ],
  plugins: {
    "@peggyjs": peggyjs,
  },
  languageOptions: {
    parser,
  },
  rules,
  settings: {
    "@peggyjs/indent": 2,
    "@peggyjs/newline": "\n",
  },
};

export = config;
