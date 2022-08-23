"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function check(context, before, after, spaces = 0) {
    const beforeEnd = before.loc.end;
    const afterStart = after.loc.start;
    let messageId = undefined;
    let data = undefined;
    if (spaces < 0) {
        if ((afterStart.line > beforeEnd.line)
            || (afterStart.column >= beforeEnd.column + 1)) {
            return;
        }
        messageId = "atLeast";
        data = {
            num: String(-spaces),
            s: spaces < -1 ? "s" : "",
        };
    }
    else {
        if ((afterStart.line === beforeEnd.line)
            && (afterStart.column === beforeEnd.column + spaces)) {
            return;
        }
        messageId = "noSpaces";
    }
    if (spaces > 0) {
        const src = context.getSourceCode();
        if (src.commentsExistBetween((0, utils_1.n)(before), (0, utils_1.n)(after))) {
            return;
        }
        messageId = "exactSpace";
        data = {
            num: String(spaces),
            s: spaces > 1 ? "s" : "",
        };
    }
    context.report({
        loc: {
            start: beforeEnd,
            end: afterStart,
        },
        messageId,
        data,
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
            exactSpace: "Exactly {{num}} space{{s}} required here",
            atLeast: "At least {{num}} space{{s}} required here",
        },
        fixable: "whitespace",
        schema: [{
                type: "object",
                properties: {
                    afterAmp: { type: "number" },
                    afterAt: { type: "number" },
                    afterBang: { type: "number" },
                    afterColon: { type: "number" },
                    afterDollar: { type: "number" },
                    afterEquals: { type: "number" },
                    afterOpenParen: { type: "number" },
                    afterSlash: { type: "number" },
                    beforeCloseParen: { type: "number" },
                    beforeColon: { type: "number" },
                    beforePlus: { type: "number" },
                    beforeQuestion: { type: "number" },
                    beforeSlash: { type: "number" },
                    beforeStar: { type: "number" },
                },
                additionalProperties: false,
            }],
    },
    create(context) {
        const opts = {
            afterAmp: 0,
            afterAt: 0,
            afterBang: 0,
            afterColon: 0,
            afterDollar: 0,
            afterEquals: 1,
            afterOpenParen: -1,
            afterSlash: 1,
            beforeCloseParen: -1,
            beforeColon: 0,
            beforePlus: 0,
            beforeQuestion: 0,
            beforeSemi: 0,
            beforeSlash: -1,
            beforeStar: 0,
            ...context.options[0],
        };
        return (0, utils_1.makeListener)({
            top_level_initializer(node) {
                if (node.semi) {
                    check(context, node.close, node.semi, opts.beforeSemi);
                }
            },
            initializer(node) {
                if (node.semi) {
                    check(context, node.code.close, node.semi, opts.beforeSemi);
                }
            },
            rule(node) {
                const expr = node.expression.type === "named"
                    ? node.expression.expression
                    : node.expression;
                check(context, node.equals, expr, opts.afterEquals);
                if (node.semi) {
                    check(context, expr, node.semi, opts.beforeSemi);
                }
            },
            one_or_more(node) {
                check(context, node.expression, node.operator, opts.beforePlus);
            },
            optional(node) {
                check(context, node.expression, node.operator, opts.beforeQuestion);
            },
            zero_or_more(node) {
                check(context, node.expression, node.operator, opts.beforeStar);
            },
            semantic_and(node) {
                check(context, node.operator, node.code.open, opts.afterAmp);
            },
            semantic_not(node) {
                check(context, node.operator, node.code.open, opts.afterBang);
            },
            simple_and(node) {
                check(context, node.operator, node.expression, opts.afterAmp);
            },
            simple_not(node) {
                check(context, node.operator, node.expression, opts.afterBang);
            },
            text(node) {
                check(context, node.operator, node.expression, opts.afterDollar);
            },
            choice(node) {
                const typ = node.parent?.type;
                const ruleDirect = (typ === "rule") || (typ === "named");
                node.slashes.forEach((slash, i) => {
                    check(context, slash, node.alternatives[i + 1], opts.afterSlash);
                    if (!ruleDirect) {
                        check(context, node.alternatives[i], slash, opts.beforeSlash);
                    }
                });
            },
            group(node) {
                check(context, node.open, node.expression, opts.afterOpenParen);
                check(context, node.expression, node.close, opts.beforeCloseParen);
            },
            labeled(node) {
                if (node.pick) {
                    if (node.name) {
                        check(context, node.at, node.name, opts.afterAt);
                    }
                    else {
                        check(context, node.at, node.expression, opts.afterAt);
                    }
                }
                if (node.name) {
                    check(context, node.name, node.colon, opts.beforeColon);
                    check(context, node.colon, node.expression, opts.afterColon);
                }
            },
        });
    },
};
exports.default = rule;
