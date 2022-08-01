# eslint-plugin-peggy

An [eslint](https://eslint.org/) plugin to check [peggy](https://peggyjs.org)
grammars.

## Usage

Install with:

```bash
npm install --save-dev peggyjs/peggyjs-eslint-plugin peggyjs/peggyjs-eslint-parser eslint
```

(update this when we publish!)

Add to your `.eslintrc.js` file:

```js
module.exports = {
  extends: ["plugin:@peggyjs/recommended"],
};
```

or if you'd like more control:

```js
module.exports = {
  plugins: ["@peggyjs"],
  overrides: [
    {
      files: ["*.peggy", "*.pegjs"],
      parser: "@peggyjs/eslint-parser",
      rules: {
        "@peggyjs/equal-next-line": ["error", "choice"],
      },
    },
    {
      files: ["**/*.peggy/*.js", "**/*.pegjs/*.js"],
      rules: {
        "unicode-bom": "off",
      },
    },
  ],
};
```

## Features

- Checks the Javascript code embedded in your grammar according to your existing ESlint rules for JS.
- Rule docs will go here.

## Using with Visual Studio Code

Add the following to your project's `.vscode/settings.json` file:

```js
{
  "eslint.validate": [
    "javascript",
    "peggy"
  ]
}
```

[![Tests](https://github.com/peggyjs/peggyjs-eslint-plugin/actions/workflows/node.js.yml/badge.svg)](https://github.com/peggyjs/peggyjs-eslint-plugin/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/peggyjs/peggyjs-eslint-plugin/branch/main/graph/badge.svg?token=PYAF34DQ6B)](https://codecov.io/gh/peggyjs/peggyjs-eslint-plugin)
