# @peggyjs/no-unused-rules

> Labels may not be used without either an action or a semantic predicate to
> reference them.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix all errors it finds.

## 📖 Rule Details

Labels should not be used unless there is an action or semantic predicate that
uses the label.  This lint rule checks that there is an action or semantic
predicate at the correct level that *might* use the label, then relies on
eslint's [no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
rule to check that the label is used inside the action or predicate.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/no-unused-labels

foo = n:"1"
bar = (n:"1") { return n; }
bar = (n:"1") &{ return n === "1"; }
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/no-unused-rules

bar = n:"1" { return n; }
bar = n:"1" &{ return n === "1"; }
```

## 🔎 Implementation

- [Rule source](../../src/rules/no-unused-labels.ts)
- [Test source](../../test/rules/no-unused-labels.test.js)
