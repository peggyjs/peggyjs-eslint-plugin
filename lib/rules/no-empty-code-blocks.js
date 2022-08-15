"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function check(context, code, fromOffset, messageId) {
    if (code.value.replace(/\r?\n/g, "").trim() === "") {
        context.report({
            node: (0, utils_1.n)(code),
            messageId,
            fix(fixer) {
                return fixer.removeRange([
                    // Get whatever interstitial whitespace was lurking.
                    fromOffset,
                    // The {} are not include in node.code.  They're always the
                    // next characters outside, however.
                    code.range[1] + 1,
                ]);
            },
        });
    }
}
const rule = {
    meta: {
        type: "layout",
        docs: {
            description: "code blocks in actions should not be empty",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-code-blocks.md",
        },
        messages: {
            action: "Action code block must not be empty.",
            predicate: "Semantic predicate code block must not be empty.",
        },
        fixable: "code",
        schema: [
            {
                type: "string",
                enum: ["semantic"],
            },
        ],
    },
    create(context) {
        const semantic = context.options[0] === "semantic";
        return (0, utils_1.makeListener)({
            action(node) {
                check(context, node.code, node.expression.range[1], "action");
            },
            // Don't need for semantic_and and semantic_not, if using
            // semantic-predicate-must-return.
            semantic_and(node) {
                if (semantic) {
                    check(context, node.code, node.operator.range[0], "predicate");
                }
            },
            semantic_not(node) {
                if (semantic) {
                    check(context, node.code, node.operator.range[0], "predicate");
                }
            },
        });
    },
};
exports.default = rule;
