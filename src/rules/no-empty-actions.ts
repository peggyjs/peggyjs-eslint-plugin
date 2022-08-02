import type EStree from "estree";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "action code blocks should not be empty if they are provided",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-initializers.md",
    },
    messages: {
      empty: "Action must not be empty.",
    },
    fixable: "whitespace",
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      // @ts-expect-error Peggy AST isn't expected by eslint
      action(node: visitor.AST.ActionExpression): void {
        if (node.code.value.replace(/\r?\n/g, "").trim() === "") {
          context.report({
            node: node.code as unknown as EStree.Node,
            messageId: "empty",
            fix(fixer: Rule.RuleFixer): Rule.Fix {
              return fixer.removeRange(
                [
                  // Get whatever interstitial whitespace was lurking.
                  node.expression.range[1],
                  // The {} are not include in node.code.  They're always the
                  // next characters outside, however.
                  node.code.range[1] + 1,
                ]
              );
            },
          });
        }
      },
    };
  },
};

export default rule;
