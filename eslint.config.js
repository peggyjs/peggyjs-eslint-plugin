"use strict";
// Not yet
// const pp = require("./");
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
    languageOptions: {
      globals: { ...globals.node, ...globals.mocha },
      ecmaVersion: 2020,
    },
  },
  require("@peggyjs/eslint-config/flat/ts"),
  // {
  //   files: ["*.peggy", "*.pegjs"],
  //   plugin: {
  //     "@peggyjs": pp,
  //   },
  //   rules: pp.configs.recommended.overrides[0].rules,
  // },
];
