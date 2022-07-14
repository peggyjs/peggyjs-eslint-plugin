# eslint-plugin-peggy

An [eslint](https://eslint.org/) plugin to check [peggy](https://peggyjs.org)
grammars.

## Usage

Install with:

```bash
npm install --save-dev eslint-plugin-peggy eslint
```

Add to your `.eslintrc.js` file:

```js
module.exports = {
  extends: ["plugin:peggy/recommended"],
};
```

or if you'd like more control:

```js
module.exports = {
  plugins: ["peggy"],
  overrides: [
    {
      files: ["*.peggy", "*.pegjs"],
      processor: "peggy/peggy",
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

Right now, only checks the Javascript code embedded in your grammar.  More coming!

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

[![Tests](https://github.com/hildjj/eslint-plugin-peggy/actions/workflows/node.js.yml/badge.svg)](https://github.com/hildjj/eslint-plugin-peggy/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/hildjj/eslint-plugin-peggy/branch/main/graph/badge.svg?token=PYAF34DQ6B)](https://codecov.io/gh/hildjj/eslint-plugin-peggy)
