"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    plugins: ["@peggyjs"],
    overrides: [
        {
            files: ["**/*.peggy", "**/*.pegjs"],
            parser: "@peggyjs/eslint-parser",
            rules: {
                "@peggyjs/equal-next-line": ["error", "choice"],
            },
        },
        {
            files: ["**/*.peggy/*.js", "**/*.pegjs/*.js"],
            rules: {
                // The processor will not receive a Unicode Byte Order Mark.
                "unicode-bom": "off",
            },
        },
    ],
};
exports.default = config;
