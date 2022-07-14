"use strict";

const processor = require("./processor");

module.exports = {
  configs: {
    recommended: {
      plugins: ["peggy"],
      overrides: [
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
};
