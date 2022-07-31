import type ESlint from "eslint";

const config: ESlint.ESLint.ConfigData = {
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

export default config;