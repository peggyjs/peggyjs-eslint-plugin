import * as peggyjs from "../index.js";
import type ESlint from "eslint";
import recommended from "./recommended.js";

// All rules
const rules: ESlint.Linter.RulesRecord = Object.fromEntries(
  Object.entries(peggyjs.rules)
    .map(([k]) => [`@peggyjs/${k}`, "error"])
);
// The processor will not receive a Unicode Byte Order Mark.
rules["unicode-bom"] = "off";

const config: ESlint.Linter.FlatConfig = {
  ...recommended,
  rules,
};

export = config;
