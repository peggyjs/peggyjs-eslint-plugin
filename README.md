# @peggyjs/eslint-plugin

An [eslint](https://eslint.org/) plugin to check [peggy](https://peggyjs.org)
grammars.

## Usage

Install with:

```bash
npm install --save-dev @peggyjs/eslint-plugin @peggyjs/eslint-parser eslint
```

(update this when we publish!)

Add to your `.eslintrc.js` file:

```js
module.exports = {
  extends: ["plugin:@peggyjs/recommended"],
};
```

Or, if you are using ESLint Flat configs, add this to your `eslint.config.js`
file:

```js
// ESM
import peggylint from "@peggyjs/eslint-plugin/lib/flat/recommended.js"
export default [
  peggyLint,
];
```

Or:

```js
// CommonJS
module.exports = [
  ...require("@peggyjs/eslint-plugin/lib/flat/recommended.js"),
];
```

You can also use "plugin:@peggyjs/all" or  to get ALL of the rules.
If you'd like more control:

```js
module.exports = {
  plugins: ["@peggyjs"],
  overrides: [
    {
      files: ["*.peggy", "*.pegjs"],
      parser: "@peggyjs/eslint-parser",
      settings: {
        "@peggyjs/indent": 2,
        "@peggyjs/newline": "\n",
      }
      rules: {
        "@peggyjs/equal-next-line": "error",
        ...
      },
    },
    {
      files: ["**/*.peggy/*.js", "**/*.pegjs/*.js"],
      rules: {
        // Even if you normally want BOMs (which you shouldn't.  Always use
        // UTF-8.), you're not getting one this time.
        "unicode-bom": "off",
      },
    },
  ],
};
```

## Rules

- ✒️ - Fixable rules.
- ⭐️ - Recommended rules.

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [@peggyjs/camelCase](./docs/rules/camelCase.md) | Rule names should be UpperCamelCase and label names should be lowerCamelCase. | ✒️ ⭐️ |
| [@peggyjs/equal-next-line](./docs/rules/equal-next-line.md) | Ensure that the equals sign in a rule is in a consistent location. | ✒️ ⭐️ |
| [@peggyjs/no-empty-code-blocks](./docs/rules/no-empty-code-blocks.md) | Code blocks in actions and semantic predicates should not be empty. | ✒️ ⭐️ |
| [@peggyjs/no-empty-initializers](./docs/rules/no-empty-initializers.md) | Top-level and per-instance initializers should not be empty. | ✒️ ⭐️ |
| [@peggyjs/no-unused-labels](./docs/rules/no-unused-labels.md) | Labels may not be used without either an action or a semantic predicate to reference them. | ✒️ ⭐️ |
| [@peggyjs/no-unused-rules](./docs/rules/no-unused-rules.md) | All rules except for the first one must be referenced by another rule. | ⭐️ |
| [@peggyjs/quotes](./docs/rules/quotes.md) | Enforce the consistent use of double or single quotes. | ✒️ ⭐️ |
| [@peggyjs/rule-order](./docs/rules/rule-order.md) | Rule definitions should come after all references to that rule, unless there is a rule loop. |  |
| [@peggyjs/semantic-predicate-must-return](./docs/rules/semantic-predicate-must-return.md) | Semantic predicates must have a return statement. | ⭐️ |
| [@peggyjs/semi](./docs/rules/semi.md) | Enforce consistent semicolon usage. | ✒️ ⭐️ |
| [@peggyjs/separate-choices](./docs/rules/separate-choices.md) | Ensure that each top-level choice in a rule is on a new line. | ✒️ ⭐️ |
| [@peggyjs/space-ops](./docs/rules/space-ops.md) | Consistent spacing around operators and other punctuation. | ✒️ ⭐️ |
| [@peggyjs/valid-imports](./docs/rules/valid-imports.md) | All imports must point to correct JS files, compiled by Peggy 4.0.0 or later, which export the expected rule name as an allowedStartRule. | ⭐️ |

## Settings

There are several plugin-wide [settings](./docs/settings.md) that control
whitespace insertion.

## Other Features

- Checks the Javascript code embedded in your grammar according to your existing ESlint rules for JS.

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
