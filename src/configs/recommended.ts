import type ESlint from "eslint";

const config: ESlint.ESLint.ConfigData = {
  plugins: ["@peggyjs"],
  overrides: [
    {
      files: ["**/*.peggy", "**/*.pegjs"],
      parser: "@peggyjs/eslint-parser",
      settings: {
        "@peggyjs/indent": 2,
        "@peggyjs/newline": "\n",
      },
      rules: {
        "@peggyjs/equal-next-line": ["error", "never", ["choice", "named"]],
        "@peggyjs/no-empty-initializers": "error",
        "@peggyjs/separate-choices": "error",
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
