"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.rules = Object.fromEntries(fs_1.default
    .readdirSync(__dirname)
    .filter(fileName => fileName.endsWith(".js") && !fileName.startsWith("."))
    .map(fileName => fileName.replace(/\.js$/, ""))
    .map(ruleName => [
    ruleName,
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    require(path_1.default.join(__dirname, ruleName)).default,
]));
