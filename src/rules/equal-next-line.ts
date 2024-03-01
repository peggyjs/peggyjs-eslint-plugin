import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import { Settings } from "../settings";
import type { visitor } from "@peggyjs/eslint-parser";

function fixEquals(
  node: visitor.AST.Rule,
  indent: string,
  newline: string
): Rule.ReportFixer {
  return function fix(fixer: Rule.RuleFixer): Rule.Fix {
    const first = (node.expression.type === "named")
      ? node.expression.name.range[1]
      : node.name.range[1];
    return fixer.replaceTextRange(
      [first, node.equals.range[0]],
      `${newline}${indent}`
    );
  };
}

function removeWhitespace(node: visitor.AST.Rule): Rule.ReportFixer {
  return function fix(fixer: Rule.RuleFixer): Rule.Fix {
    const first = (node.expression.type === "named")
      ? node.expression.name.range[1]
      : node.name.range[1];
    return fixer.replaceTextRange(
      [first, node.equals.range[0]],
      " "
    );
  };
}

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "require rule equal signs to be on the next line from the rule name",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/equal-next-line.md",
    },
    messages: {
      next: "Equal sign must be on next line from the rule name.",
      same: "Equal sign must be on the same line as rule name.",
    },
    fixable: "whitespace",
    schema: [
      {
        oneOf: [
          {
            title: "style",
            type: "string",
            enum: ["always", "never"],
          },
          {
            type: "object",
            properties: {
              style: {
                type: "string",
                enum: ["always", "never"],
              },
              exceptions: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["choice", "named"],
                },
              },
            },
          },
        ],
      },
    ],
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const optObj = (typeof context.options[0] === "string")
      ? { style: context.options[0] }
      : context.options[0];
    const opts = {
      style: "never",
      exceptions: ["choice", "named"],
      ...optObj,
    };
    const settings = new Settings(context.settings);
    const indent = settings.indent;
    const newline = settings.newline;

    return makeListener({
      rule(node: visitor.AST.Rule): void {
        const ruleLine = node.name.loc.start.line;
        const equalLine = node.equals.loc.start.line;

        switch (opts.style) {
          case "always": {
            if (ruleLine !== equalLine - 1) {
              if (!context.getSourceCode().commentsExistBetween(
                n(node.name), n(node.equals)
              )) {
                context.report({
                  node: n(node.equals),
                  messageId: "next",
                  fix: fixEquals(node, indent, newline),
                });
              }
            }
            break;
          }
          case "never": {
            let messageId: string | undefined = undefined;
            let fix: Rule.ReportFixer | null = null;

            if (ruleLine === equalLine) {
              if (opts.exceptions.includes(node.expression.type)) {
                // These go on the next line but they're not
                messageId = "next";
                fix = fixEquals(node, indent, newline);
              }
            } else {
              if (opts.exceptions.includes(node.expression.type)) {
                if (ruleLine !== equalLine - 1) {
                  // There's probably an extra blank line
                  messageId = "next";
                  fix = fixEquals(node, indent, newline);
                }
              } else {
                messageId = "same";
                fix = removeWhitespace(node);
              }
            }
            if (messageId) {
              context.report({
                node: n(node.equals),
                messageId,
                fix,
              });
            }
            break;
          }
          /* c8 ignore start */
          // Schema prevents unknown styles.
          default:
            throw new Error(`Unknown style: '${opts.style}'`);
          /* c8 ignore stop */
        }
      },
    });
  },
};

export = rule;
