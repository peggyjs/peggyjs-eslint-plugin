import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

function checkQuotes(
  context: Rule.RuleContext,
  style: "double" | "single",
  avoidEscape: boolean,
  node:
    | visitor.AST.DisplayName
    | visitor.AST.ImportModuleSpecifier
    | visitor.AST.LiteralExpression
    | visitor.AST.ModuleExportName
): void {
  if (style === "double") {
    if (node.before.value !== '"') {
      // Use raw here, since we want to output exactly what was there before,
      // without having to re-escape.
      let escaped = node.raw;
      if (escaped.includes('"')) {
        if (avoidEscape) {
          return;
        }
        escaped = escaped.replace(/"/g, '\\"');
      }
      context.report({
        node: n(node),
        messageId: "wrongQuotes",
        data: { description: "doublequote" },
        fix(fixer: Rule.RuleFixer): Rule.Fix {
          return fixer.replaceText(n(node), `"${escaped}"`);
        },
      });
    }
  } else {
    if (node.before.value !== "'") {
      let escaped = node.raw;
      if (node.value.includes("'")) {
        if (avoidEscape) {
          return;
        }
        escaped = escaped.replace(/'/g, "\\'");
      }
      context.report({
        node: n(node),
        messageId: "wrongQuotes",
        data: { description: "doublequote" },
        fix(fixer: Rule.RuleFixer): Rule.Fix {
          return fixer.replaceText(n(node), `'${escaped}'`);
        },
      });
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce the consistent use of double or single quotes",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/quotes.md",
    },
    messages: {
      wrongQuotes: "Strings must use {{description}}.",
    },
    fixable: "code",
    schema: [
      {
        oneOf: [
          {
            type: "object",
            properties: {
              avoidEscape: {
                type: "boolean",
              },
              style: {
                type: "string",
                enum: ["single", "double"],
              },
            },
            additionalProperties: false,
          },
          {
            title: "style",
            type: "string",
            enum: ["single", "double"],
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
      avoidEscape: true,
      style: "double",
      ...optObj,
    };

    return makeListener({
      display(node: visitor.AST.DisplayName): void {
        checkQuotes(context, opts.style, opts.avoidEscape, node);
      },
      literal(node: visitor.AST.LiteralExpression): void {
        checkQuotes(context, opts.style, opts.avoidEscape, node);
      },
      import_module_specifier(node: visitor.AST.ImportModuleSpecifier): void {
        checkQuotes(context, opts.style, opts.avoidEscape, node);
      },
      module_export_name(node: visitor.AST.ModuleExportName): void {
        checkQuotes(context, opts.style, opts.avoidEscape, node);
      },
    });
  },
};

export = rule;
