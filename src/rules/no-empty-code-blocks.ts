import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

function check(
  context: Rule.RuleContext,
  code: visitor.AST.Code,
  fromOffset: number,
  messageId: string
): void {
  if (code.value.replace(/\r?\n/g, "").trim() === "") {
    context.report({
      node: n(code),
      messageId,
      fix(fixer: Rule.RuleFixer): Rule.Fix {
        return fixer.removeRange(
          [
            // Get whatever interstitial whitespace was lurking.
            fromOffset,
            // The {} are not include in node.code.  They're always the
            // next characters outside, however.
            code.range[1] + 1,
          ]
        );
      },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "code blocks in actions should not be empty",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-code-blocks.md",
    },
    messages: {
      action: "Action code block must not be empty.",
      predicate: "Semantic predicate code block must not be empty.",
    },
    fixable: "code",
    schema: [
      {
        type: "string",
        enum: ["semantic"],
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const semantic = context.options[0] === "semantic";

    return makeListener({
      action(node: visitor.AST.ActionExpression): void {
        check(context, node.code, node.expression.range[1], "action");
      },
      // Don't need for semantic_and and semantic_not, if using
      // semantic-predicate-must-return.
      semantic_and(node: visitor.AST.SemanticAndExpression): void {
        if (semantic) {
          check(context, node.code, node.operator.range[0], "predicate");
        }
      },
      semantic_not(node: visitor.AST.SemanticNotExpression): void {
        if (semantic) {
          check(context, node.code, node.operator.range[0], "predicate");
        }
      },
    });
  },
};

export = rule;
