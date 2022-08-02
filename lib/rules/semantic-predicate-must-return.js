"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkForReturn(context, node) {
    // This is weak, but I don't want to include a full JS parse here
    // to do actual analysis.  This will catch the most common issue, which
    // is my consistently doing `!{ n === 1 }` without the return.
    if (!/return/.test(node.code.value)) {
        context.report({
            node: node.code,
            messageId: "mustReturn",
        });
    }
}
const rule = {
    meta: {
        type: "layout",
        docs: {
            description: "semantic predicate code blocks must have a return statement",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/semantic-predicate-must-return.md",
        },
        messages: {
            mustReturn: "Semantic predicate must return.",
        },
        schema: [],
    },
    create(context) {
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            semantic_and(node) {
                checkForReturn(context, node);
            },
            // @ts-expect-error Peggy AST isn't expected by eslint
            semantic_not(node) {
                checkForReturn(context, node);
            },
        };
    },
};
exports.default = rule;
