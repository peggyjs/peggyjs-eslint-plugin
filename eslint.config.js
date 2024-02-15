"use strict";
const pp = require("./");

module.exports = [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "lib/**",
      "node_modules/**",
    ],
  },
  require("@peggyjs/eslint-config/flat/js"),
  require("@peggyjs/eslint-config/flat/mocha"),
  require("@peggyjs/eslint-config/flat/ts"),
  {
    files: ["*.peggy", "*.pegjs"],
    plugin: {
      "@peggyjs": pp,
    },
    rules: pp.configs.recommended.overrides[0].rules,
  },
];
