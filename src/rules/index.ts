import type ESlint from "eslint";
import EqualNextLine from "./equal-next-line";
import NoEmptyActions from "./no-empty-actions";
import NoEmptyInitializers from "./no-empty-initializers";
import NoUnusedRules from "./no-unused-rules";
import SemanticPredicateMustReturn from "./semantic-predicate-must-return";
import SeparateChoices from "./separate-choices";

export const rules: { [name: string]: ESlint.Rule.RuleModule } = {
  "equal-next-line": EqualNextLine,
  "no-empty-actions": NoEmptyActions,
  "no-empty-initializers": NoEmptyInitializers,
  "no-unused-rules": NoUnusedRules,
  "semantic-predicate-must-return": SemanticPredicateMustReturn,
  "separate-choices": SeparateChoices,
};
