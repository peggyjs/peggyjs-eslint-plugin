import * as processor from "./processor";
import type ESlint from "eslint";

export * from "./configs";
export * from "./rules";

export const processors: { [key: string]: ESlint.Linter.Processor } = {
  "peggy": processor,
  ".peggy": processor,
  ".pegjs": processor,
};
