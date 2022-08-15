"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    extends: ["plugin:@peggyjs/recommended"],
    overrides: [
        {
            files: ["**/*.peggy", "**/*.pegjs"],
            rules: {},
        },
    ],
};
exports.default = config;
