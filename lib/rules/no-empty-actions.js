"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    meta: {
        type: "layout",
        docs: {
            description: "action code blocks should not be empty if they are provided",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-initializers.md",
        },
        messages: {
            empty: "Action must not be empty.",
        },
        fixable: "whitespace",
        schema: [],
    },
    create(context) {
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            action(node) {
                if (node.code.value.replace(/\r?\n/g, "").trim() === "") {
                    context.report({
                        node: node.code,
                        messageId: "empty",
                        fix(fixer) {
                            return fixer.removeRange([
                                // The {} are not include in node.code.  They're always the
                                // next characters outside, however.
                                node.expression.range[1],
                                node.code.range[1] + 1,
                            ]);
                        },
                    });
                }
            },
        };
    },
};
exports.default = rule;
