"use strict";

const globals = require("@peggyjs/eslint-config/flat/globals");

module.exports = [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "lib/**",
      "node_modules/**",
      "test/rules/fixtures/*.[cm]js",
    ],
  },
  require("@peggyjs/eslint-config/flat/js"),
  require("@peggyjs/eslint-config/flat/mjs"),
  {
    ...require("@peggyjs/eslint-config/flat/mocha"),
    files: ["test/**/*.js"],
    languageOptions: {
      globals: { ...globals.node, ...globals.mocha },
      ecmaVersion: 2020,
    },
  },
  require("@peggyjs/eslint-config/flat/ts"),
  require("./lib/flat/all.js"),
];
