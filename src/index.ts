import * as processor from "./processor";
import type ESlint from "eslint";
import { dirMap } from "./utils";

export { default as rules } from "./allRules.js";
export const configs = dirMap(__dirname, "configs") as { [key: string]: ESlint.ESLint.ConfigData };

export const processors: { [key: string]: ESlint.Linter.Processor } = {
  "peggy": processor,
  ".peggy": processor,
  ".pegjs": processor,
};
