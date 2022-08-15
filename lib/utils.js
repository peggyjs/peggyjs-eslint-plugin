"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dirMap = exports.makeListener = exports.n = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Typecast
function n(node) {
    return node;
}
exports.n = n;
function makeListener(map) {
    return map;
}
exports.makeListener = makeListener;
function dirMap(...dirs) {
    const dirName = path_1.default.join(...dirs);
    return Object.fromEntries(fs_1.default
        .readdirSync(dirName)
        .filter(fileName => fileName.endsWith(".js") && !fileName.startsWith("."))
        .map(fileName => fileName.replace(/\.js$/, ""))
        .map(entryName => [
        entryName,
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        require(path_1.default.join(dirName, entryName)).default,
    ]));
}
exports.dirMap = dirMap;
