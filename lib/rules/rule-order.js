"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const assert_1 = __importDefault(require("assert"));
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Rule definitions should come after all references to that rule, unless there is a rule loop",
            recommended: false,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/rule-oder.md",
        },
        messages: {
            order: "Rule '{{name}}' must be defined after reference.",
        },
        schema: [],
    },
    create(context) {
        const rules = new Map();
        let curRule = null;
        function chase(refs, rulName, checked) {
            return refs.some(r => {
                const nam = r.value;
                if (nam === rulName) {
                    return true;
                }
                if (checked.has(nam)) {
                    return false;
                }
                checked.add(nam);
                const [subrefs] = rules.get(nam) || [[]];
                return chase(subrefs, rulName, checked);
            });
        }
        return (0, utils_1.makeListener)({
            rule(node) {
                curRule = node;
                rules.set(node.name.value, [[], node]);
            },
            rule_ref(node) {
                const name = curRule?.name.value;
                (0, assert_1.default)(name);
                rules.get(name)?.[0]?.push(node.name);
            },
            "Program:exit": () => {
                for (const [rulName, [refs]] of rules) {
                    for (const ref of refs) {
                        const [refRefs, refRul] = rules.get(ref.value) ?? [[], null];
                        if (refRul && ref.loc.start.line >= refRul.loc.start.line) {
                            // This rule references itself
                            if (rulName === ref.value) {
                                continue;
                            }
                            // Is there a reference back to this rule from a loop?
                            if (chase(refRefs, rulName, new Set())) {
                                continue;
                            }
                            context.report({
                                node: (0, utils_1.n)(ref),
                                messageId: "order",
                                data: { name: ref.value },
                            });
                        }
                    }
                }
            },
        });
    },
};
exports.default = rule;
