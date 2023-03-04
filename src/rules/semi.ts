import type { Rule } from "eslint";
import { makeListener } from "../utils";
import type { visitor } from "@peggyjs/eslint-parser";

function check(
  context: Rule.RuleContext,
  required: boolean,
  before: visitor.AST.Node,
  semi?: visitor.AST.Punctuation[]
): void {
  if (required) {
    if (!semi) {
      context.report({
        loc: {
          start: before.loc.end,
          end: before.loc.end,
        },
        messageId: "required",
        fix(fixer: Rule.RuleFixer): Rule.Fix {
          return fixer.replaceTextRange([
            before.range[1],
            before.range[1],
          ], ";");
        },
      });
    } else if (semi.length > 1) {
      const lastSemi = semi[semi.length - 1];
      context.report({
        loc: {
          start: before.loc.end,
          end: lastSemi.loc.end,
        },
        messageId: "prohibited",
        fix(fixer: Rule.RuleFixer): Rule.Fix {
          return fixer.replaceTextRange([
            before.range[1],
            lastSemi.range[1],
          ], ";");
        },
      });
    }
  } else {
    if (semi) {
      const lastSemi = semi[semi.length - 1];
      context.report({
        loc: {
          start: before.loc.end,
          end: lastSemi.loc.end,
        },
        messageId: "prohibited",
        fix(fixer: Rule.RuleFixer): Rule.Fix {
          return fixer.removeRange([
            before.range[1],
            lastSemi.range[1],
          ]);
        },
      });
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce consistent use of semicolons",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/semi.md",
    },
    messages: {
      required: "Missing semicolon.",
      prohibited: "Extra semicolon.",
    },
    fixable: "code",
    schema: [
      {
        type: "string",
        enum: ["always", "never"],
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const required = context.options[0] === "always";
    return makeListener({
      top_level_initializer(node: visitor.AST.TopLevelInitializer): void {
        check(context, required, node.close, node.semi);
      },
      initializer(node: visitor.AST.Initializer): void {
        check(context, required, node.code.close, node.semi);
      },
      rule(node: visitor.AST.Rule): void {
        // Named expressions include trailing whitespace, which we don't want
        // before the semi.
        const expr = node.expression.type === "named"
          ? node.expression.expression
          : node.expression;
        check(context, required, expr, node.semi);
      },
    });
  },
};

export default rule;
