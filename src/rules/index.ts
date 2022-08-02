import type ESlint from "eslint";
import EqualNextLine from "./equal-next-line";
import NoEmptyInitializers from "./no-empty-initializers";
import SeparateChoices from "./separate-choices";

export const rules: { [name: string]: ESlint.Rule.RuleModule } = {
  "equal-next-line": EqualNextLine,
  "no-empty-initializers": NoEmptyInitializers,
  "separate-choices": SeparateChoices,
};
