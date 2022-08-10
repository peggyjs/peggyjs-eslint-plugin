import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

function checkForReturn(
  context: Rule.RuleContext,
  node: visitor.AST.SemanticAndExpression | visitor.AST.SemanticNotExpression
): void {
  // This is weak, but I don't want to include a full JS parse here
  // to do actual analysis.  This will catch the most common issue, which
  // is my consistently doing `!{ n === 1 }` without the return.
  if (!/return/.test(node.code.value)) {
    context.report({
      node: n(node.code),
      messageId: "mustReturn",
    });
  }
}
const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "semantic predicate code blocks must have a return statement",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/semantic-predicate-must-return.md",
    },
    messages: {
      mustReturn: "Semantic predicate must return.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return makeListener({
      semantic_and(node: visitor.AST.SemanticAndExpression): void {
        checkForReturn(context, node);
      },
      semantic_not(node: visitor.AST.SemanticNotExpression): void {
        checkForReturn(context, node);
      },
    });
  },
};

export default rule;
