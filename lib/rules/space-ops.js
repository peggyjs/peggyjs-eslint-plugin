"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function check(context, before, after, spaces = 0) {
    const beforeEnd = before.loc.end;
    const afterStart = after.loc.start;
    if (spaces < 0) {
        if ((afterStart.line > beforeEnd.line)
            || (afterStart.column >= beforeEnd.column + 1)) {
            return;
        }
    }
    else {
        if ((afterStart.line === beforeEnd.line)
            && (afterStart.column === beforeEnd.column + spaces)) {
            return;
        }
    }
    if (spaces > 0) {
        const src = context.getSourceCode();
        if (src.commentsExistBetween((0, utils_1.n)(before), (0, utils_1.n)(after))) {
            return;
        }
    }
    context.report({
        loc: {
            start: beforeEnd,
            end: afterStart,
        },
        messageId: spaces ? "oneSpace" : "noSpaces",
        fix(fixer) {
            return fixer.replaceTextRange([
                before.range[1],
                after.range[0],
            ], "".padEnd(Math.abs(spaces)));
        },
    });
}
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "enforce consistent spacing around operators",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/space-ops.md",
        },
        messages: {
            noSpaces: "No space allowed here",
            oneSpace: "One space required here",
        },
        fixable: "code",
        schema: [{
                type: "object",
                properties: {
                    beforeSlash: {
                        type: "number",
                    },
                },
                additionalProperties: false,
            }],
    },
    create(context) {
        const beforeSlash = Number(context.options[0]?.beforeSlash ?? -1);
        return (0, utils_1.makeListener)({
            rule(node) {
                const expr = node.expression.type === "named"
                    ? node.expression.expression
                    : node.expression;
                check(context, node.equals, expr, 1);
            },
            one_or_more(node) {
                check(context, node.expression, node.operator);
            },
            optional(node) {
                check(context, node.expression, node.operator);
            },
            zero_or_more(node) {
                check(context, node.expression, node.operator);
            },
            semantic_and(node) {
                check(context, node.operator, node.code.open);
            },
            semantic_not(node) {
                check(context, node.operator, node.code.open);
            },
            simple_and(node) {
                check(context, node.operator, node.expression);
            },
            simple_not(node) {
                check(context, node.operator, node.expression);
            },
            text(node) {
                check(context, node.operator, node.expression);
            },
            choice(node) {
                const typ = node.parent?.type;
                const ruleDirect = (typ === "rule") || (typ === "named");
                node.slashes.forEach((slash, i) => {
                    check(context, slash, node.alternatives[i + 1], 1);
                    if (!ruleDirect) {
                        check(context, node.alternatives[i], slash, beforeSlash);
                    }
                });
            },
        });
    },
};
exports.default = rule;
