import type ESlint from "eslint";

const config: ESlint.ESLint.ConfigData = {
  plugins: ["@peggyjs"],
  overrides: [
    {
      files: ["**/*.peggy", "**/*.pegjs"],
      parser: "@peggyjs/eslint-parser",
      rules: {
        "@peggyjs/equal-next-line": ["error", "never", ["choice", "named"]],
      },
      settings: {
        "@peggyjs/indent": 2,
        "@peggyjs/newline": "\n",
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

export default config;
