# @peggyjs/rule-order

> Rule definitions should come after all references to that rule, unless there
> is a rule loop.

## 📖 Rule Details

Rules should be in some sort of order.  Since the first rule is the default
entry point of the grammar, and doesn't have any references to it (other than
loops), all of the rules that it references will come after it.  This lint
rule enforces this ordering for every other grammar rule.

This lint rule is not included in the recommended set, because many grammars
that you will modify from other sources into Peggy grammars will not have been
strict about ordering, and it's likely more important for your adaptation to
stay in the same order.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/rule-order: "error"

Bar = "1"
Foo = Bar
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/rule-order: "error"

Foo = Bar
Bar = "1" Bar Boo  / Self-reference ok
Boo = Foo // Loop ok
```

## 🔎 Implementation

- [Rule source](../../src/rules/rule-order.ts)
- [Test source](../../test/rules/rule-order.test.js)
