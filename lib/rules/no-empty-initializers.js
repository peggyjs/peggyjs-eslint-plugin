"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function checkEmpty(context, node) {
    const enode = (0, utils_1.n)(node);
    if (node.code.value.replace(/\r?\n/g, "").trim() === "") {
        context.report({
            node: enode,
            messageId: "empty",
            fix(fixer) {
                return fixer.remove(enode);
            },
        });
    }
}
const rule = {
    meta: {
        type: "layout",
        docs: {
            description: "top level initializer and per-instance initializer should not be empty if they are provided",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-initializers.md",
        },
        messages: {
            empty: "Initializer must not be empty.",
        },
        fixable: "code",
        schema: [],
    },
    create(context) {
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            top_level_initializer(node) {
                checkEmpty(context, node);
            },
            // @ts-expect-error Peggy AST isn't expected by eslint
            initializer(node) {
                checkEmpty(context, node);
            },
        };
    },
};
exports.default = rule;
