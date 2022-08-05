# @peggyjs/camelCase
> Rule names should be UpperCamelCase and label names should be lowerCamelCase.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

Much like the [ESlint rule](https://eslint.org/docs/latest/rules/camelcase) of
the same name, this rule is mostly looking for underscores that are not
leading or trailing.  Rule names should start with a capital, and label names
should start with a lowercase.  There are fixes available for rule names, but
not yet for labels, as the fix would also need to modify action and semantic
predicate code bodies.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/camelCase: "error"

foo = BAR:"bar"
```

```peg.js
// eslint @peggyjs/camelCase: "error"

Foo = bar_baz:"bar"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/camelCase: "error"

Foo = bar:"bar"
```

```peg.js
// eslint @peggyjs/camelCase: "error"

Foo = _ barBaz_:"bar"
_ = [ \t]
```

## 🔎 Implementation

- [Rule source](../../src/rules/camelCase.ts)
- [Test source](../../test/lib/rules/camelCase.js)
