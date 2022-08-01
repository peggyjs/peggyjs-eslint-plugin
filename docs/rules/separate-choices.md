# @peggyjs/separate-choices
> Ensure that each top-level choice in a rule is on a new line.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

Rules often contain a set of choices, separated by "/".  Current best practice
is to put each of these choices on a separate line.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/separate-choices

foo = "bar" / "boo"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/separate-choices

foo
  = "bar"
  / "boo"
```

## Whitespace insertion

See [Settings](../settings.md).

## 🔎 Implementation

- [Rule source](../../src/rules/separate-choices.ts)
- [Test source](../../test/lib/rules/separate-choices.js)
