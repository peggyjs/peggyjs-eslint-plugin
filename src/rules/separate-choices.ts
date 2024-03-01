import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import { Settings } from "../settings";
import type { visitor } from "@peggyjs/eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "require each top-level choice in a rule to be on a new line",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/separate-choices.md",
    },
    messages: {
      next: "Each top-level choice in a rule must be on a new line.",
    },
    fixable: "whitespace",
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const settings = new Settings(context.settings);
    const indent = settings.indent;
    const newline = settings.newline;

    return makeListener({
      rule(node: visitor.AST.Rule): void {
        const expr: visitor.AST.Expression = (node.expression.type === "named")
          ? node.expression.expression
          : node.expression;

        if (expr.type === "choice") {
          let prevLine = node.equals.loc.start.line - 1;
          let prevEnd = node.equals.range[1];

          for (const choice of expr.alternatives) {
            if (choice.loc.start.line === prevLine) {
              const start = prevEnd; // Capture in case multiple
              context.report({
                node: n(choice),
                messageId: "next",
                fix(fixer: Rule.RuleFixer): Rule.Fix {
                  return fixer.replaceTextRange(
                    [start, choice.range[0]],
                    `${newline}${indent}/ `
                  );
                },
              });
            }
            prevLine = choice.loc.end.line;
            prevEnd = choice.range[1];
          }
        }
      },
    });
  },
};

export = rule;
