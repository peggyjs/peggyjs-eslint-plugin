"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const settings_1 = require("../settings");
function fixEquals(node, indent, newline) {
    return function fix(fixer) {
        const first = (node.expression.type === "named")
            ? node.expression.name.range[1]
            : node.name.range[1];
        return fixer.replaceTextRange([first, node.equals.range[0]], `${newline}${indent}`);
    };
}
function removeWhitespace(node) {
    return function fix(fixer) {
        const first = (node.expression.type === "named")
            ? node.expression.name.range[1]
            : node.name.range[1];
        return fixer.replaceTextRange([first, node.equals.range[0]], " ");
    };
}
const rule = {
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
    create(context) {
        const optObj = (typeof context.options[0] === "string")
            ? { style: context.options[0] }
            : context.options[0];
        const opts = {
            style: "never",
            exceptions: ["choice", "named"],
            ...optObj,
        };
        const settings = new settings_1.Settings(context.settings);
        const indent = settings.indent;
        const newline = settings.newline;
        return (0, utils_1.makeListener)({
            rule(node) {
                const ruleLine = node.name.loc.start.line;
                const equalLine = node.equals.loc.start.line;
                switch (opts.style) {
                    case "always": {
                        if (ruleLine !== equalLine - 1) {
                            if (!context.getSourceCode().commentsExistBetween((0, utils_1.n)(node.name), (0, utils_1.n)(node.equals))) {
                                context.report({
                                    node: (0, utils_1.n)(node.equals),
                                    messageId: "next",
                                    fix: fixEquals(node, indent, newline),
                                });
                            }
                        }
                        break;
                    }
                    case "never": {
                        let messageId = undefined;
                        let fix = null;
                        if (ruleLine === equalLine) {
                            if (opts.exceptions.includes(node.expression.type)) {
                                // These go on the next line but they're not
                                messageId = "next";
                                fix = fixEquals(node, indent, newline);
                            }
                        }
                        else {
                            if (opts.exceptions.includes(node.expression.type)) {
                                if (ruleLine !== equalLine - 1) {
                                    // There's probably an extra blank line
                                    messageId = "next";
                                    fix = fixEquals(node, indent, newline);
                                }
                            }
                            else {
                                messageId = "same";
                                fix = removeWhitespace(node);
                            }
                        }
                        if (messageId) {
                            context.report({
                                node: (0, utils_1.n)(node.equals),
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
exports.default = rule;
