"use strict";

const path = require("path");
const processor = require("./processor");
const requireindex = require("requireindex");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  configs: {
    recommended: {
      plugins: ["peggy"],
      overrides: [
        {
          files: ["**/*.peggy", "**/*.pegjs"],
          parser: "@peggyjs/eslint-parser",
          rules: {
            "peggy/equal-next-line": ["error", "choice"],
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
    },
  },
  processors: {
    "peggy": processor,
    ".peggy": processor,
    ".pegjs": processor,
  },
  rules: requireindex(path.join(__dirname, "rules")),
};
