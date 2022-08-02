"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const equal_next_line_1 = __importDefault(require("./equal-next-line"));
const no_empty_initializers_1 = __importDefault(require("./no-empty-initializers"));
const separate_choices_1 = __importDefault(require("./separate-choices"));
exports.rules = {
    "equal-next-line": equal_next_line_1.default,
    "no-empty-initializers": no_empty_initializers_1.default,
    "separate-choices": separate_choices_1.default,
};
