import type ESlint from "eslint";
import EqualNextLine from "./equal-next-line";
import SeparateChoices from "./separate-choices";

export const rules: { [name: string]: ESlint.Rule.RuleModule } = {
  "equal-next-line": EqualNextLine,
  "separate-choices": SeparateChoices,
};
