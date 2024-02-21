import type ESlint from "eslint";
import { dirMap } from "./utils";

export default dirMap(__dirname, "rules") as {
  [name: string]: ESlint.Rule.RuleModule;
};
