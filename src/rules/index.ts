import type ESlint from "eslint";
import EqualNextLine from "./equal-next-line";

export const rules: { [name: string]: ESlint.Rule.RuleModule } = {
  "equal-next-line": EqualNextLine,
};
