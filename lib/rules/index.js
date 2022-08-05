"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const camelCase_1 = __importDefault(require("./camelCase"));
const equal_next_line_1 = __importDefault(require("./equal-next-line"));
const no_empty_actions_1 = __importDefault(require("./no-empty-actions"));
const no_empty_initializers_1 = __importDefault(require("./no-empty-initializers"));
const no_unused_rules_1 = __importDefault(require("./no-unused-rules"));
const semantic_predicate_must_return_1 = __importDefault(require("./semantic-predicate-must-return"));
const separate_choices_1 = __importDefault(require("./separate-choices"));
exports.rules = {
    "camelCase": camelCase_1.default,
    "equal-next-line": equal_next_line_1.default,
    "no-empty-actions": no_empty_actions_1.default,
    "no-empty-initializers": no_empty_initializers_1.default,
    "no-unused-rules": no_unused_rules_1.default,
    "semantic-predicate-must-return": semantic_predicate_must_return_1.default,
    "separate-choices": separate_choices_1.default,
};
