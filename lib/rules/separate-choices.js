"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const utils_1 = require("../utils");
const rule = {
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
    create(context) {
        const settings = new settings_1.Settings(context.settings);
        const indent = settings.indent;
        const newline = settings.newline;
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            rule(node) {
                const expr = (node.expression.type === "named")
                    ? node.expression.expression
                    : node.expression;
                if (expr.type === "choice") {
                    let prevLine = node.equals.loc.start.line - 1;
                    let prevEnd = node.equals.range[1];
                    for (const choice of expr.alternatives) {
                        if (choice.loc.start.line === prevLine) {
                            const start = prevEnd; // Capture in case multiple
                            context.report({
                                node: (0, utils_1.n)(choice),
                                messageId: "next",
                                fix(fixer) {
                                    return fixer.replaceTextRange([start, choice.range[0]], `${newline}${indent}/ `);
                                },
                            });
                        }
                        prevLine = choice.loc.end.line;
                        prevEnd = choice.range[1];
                    }
                }
            },
        };
    },
};
exports.default = rule;
