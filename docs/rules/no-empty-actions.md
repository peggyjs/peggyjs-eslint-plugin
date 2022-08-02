# @peggyjs/no-empty-actions
> Top-level and per-instance initializers should not be empty.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

Actions are the Javascript code that follow an expression.  When provided,
they replace the default result of the expression to be whatever the return
value of the action is.  They should always have *some* JavaScript inside.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-actions
foo = "1" {}
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-actions
foo = "1" { return 1; }
```

## 🔎 Implementation

- [Rule source](../../src/rules/no-empty-actions.ts)
- [Test source](../../test/lib/rules/no-empty-actions.js)
