# @peggyjs/semi

> Enforce consistent use of semicolons
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix errors.

## 📖 Rule Details

Much like the [ESlint rule](https://eslint.org/docs/latest/rules/semi) of
the same name, this rule can either enforce that semicolons are used after every
rule, or that they are never used.  Evn if semicolons should always be used,
there should never be more than one.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/semi: "always"

foo = "bar"
foo = "bar";;
foo = "bar"; /* Comment */;
```

```peg.js
// eslint @peggyjs/semi: "never"

foo = "bar";
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/semi: "always"

foo = "bar";
```

```peg.js
// eslint @peggyjs/semi: "never"

foo = "bar"
```

## 🔎 Implementation

- [Rule source](../../src/rules/semi.ts)
- [Test source](../../test/rules/semi.test.js)
