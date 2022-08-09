import CamelCase from "./camelCase";
import type ESlint from "eslint";
import EqualNextLine from "./equal-next-line";
import NoEmptyActions from "./no-empty-actions";
import NoEmptyInitializers from "./no-empty-initializers";
import NoUnusedRules from "./no-unused-rules";
import Quotes from "./quotes";
import SemanticPredicateMustReturn from "./semantic-predicate-must-return";
import SeparateChoices from "./separate-choices";
import SpaceOps from "./space-ops";

export const rules: { [name: string]: ESlint.Rule.RuleModule } = {
  "camelCase": CamelCase,
  "equal-next-line": EqualNextLine,
  "no-empty-actions": NoEmptyActions,
  "no-empty-initializers": NoEmptyInitializers,
  "no-unused-rules": NoUnusedRules,
  "quotes": Quotes,
  "semantic-predicate-must-return": SemanticPredicateMustReturn,
  "separate-choices": SeparateChoices,
  "space-ops": SpaceOps,
};
