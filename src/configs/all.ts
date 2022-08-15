import type ESlint from "eslint";

const config: ESlint.ESLint.ConfigData = {
  extends: ["plugin:@peggyjs/recommended"],
  overrides: [
    {
      files: ["**/*.peggy", "**/*.pegjs"],
      rules: {},
    },
  ],
};

export default config;
