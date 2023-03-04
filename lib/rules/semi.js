"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function check(context, required, before, semi) {
    if (required) {
        if (!semi) {
            context.report({
                loc: {
                    start: before.loc.end,
                    end: before.loc.end,
                },
                messageId: "required",
                fix(fixer) {
                    return fixer.replaceTextRange([
                        before.range[1],
                        before.range[1],
                    ], ";");
                },
            });
        }
        else if (semi.length > 1) {
            const lastSemi = semi[semi.length - 1];
            context.report({
                loc: {
                    start: before.loc.end,
                    end: lastSemi.loc.end,
                },
                messageId: "prohibited",
                fix(fixer) {
                    return fixer.replaceTextRange([
                        before.range[1],
                        lastSemi.range[1],
                    ], ";");
                },
            });
        }
    }
    else {
        if (semi) {
            const lastSemi = semi[semi.length - 1];
            context.report({
                loc: {
                    start: before.loc.end,
                    end: lastSemi.loc.end,
                },
                messageId: "prohibited",
                fix(fixer) {
                    return fixer.removeRange([
                        before.range[1],
                        lastSemi.range[1],
                    ]);
                },
            });
        }
    }
}
const rule = {
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
    create(context) {
        const required = context.options[0] === "always";
        return (0, utils_1.makeListener)({
            top_level_initializer(node) {
                check(context, required, node.close, node.semi);
            },
            initializer(node) {
                check(context, required, node.code.close, node.semi);
            },
            rule(node) {
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
exports.default = rule;
