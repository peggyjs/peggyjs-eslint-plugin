# @peggyjs/semantic-predicate-must-return
> Top-level and per-instance initializers should not be empty.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

Semantic predicates (`&{}` and `!{}`) are used to assert that a certain
condition is either true or false a the current parse position.  They make no
sense if they do not return something truthy or falsy.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/semantic-predicate-must-return

foo = n:"1" &{ n === "1"; }
```

```peg.js
// eslint @peggyjs/semantic-predicate-must-return

foo = n:"1" !{ n === "2"; }
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/semantic-predicate-must-return

foo = n:"1" &{ return n === "1"; }
```

```peg.js
// eslint @peggyjs/semantic-predicate-must-return

foo = n:"1" !{ return n === "2"; }
```


## 🔎 Implementation

- [Rule source](../../src/rules/semantic-predicate-must-return.ts)
- [Test source](../../test/lib/rules/semantic-predicate-must-return.js)
