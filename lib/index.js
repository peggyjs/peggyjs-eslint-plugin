"use strict";

const processor = require("./processor");

module.exports = {
  configs: {
    recommended: {
      plugins: ["peggy"],
      overrides: [
        {
          files: ["*.peggy", "*.pegjs"],
          processor: "peggy/peggy",
        },
        {
          files: ["**/*.peggy/**", "**/*.pegjs/**"],
          rules: {
            // The processor will not receive a Unicode Byte Order Mark.
            "unicode-bom": "off",
          },
        },
      ],
    },
  },
  processors: {
    peggy: processor,
  },
};
