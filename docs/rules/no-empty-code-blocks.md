# @peggyjs/no-empty-code-blocks
> Code blocks should not be empty.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix all errors it finds.

## 📖 Rule Details

Actions are the Javascript code that follow an expression.  When provided,
they replace the default result of the expression to be whatever the return
value of the action is.  They should always have *some* JavaScript inside.

Semantic predicates also should have some JavaScript inside their code blocks.
If you are using the rule `@peggyjs/semantic-predicate-must-return`, then that
rule will also trigger for empty blocks.  If you are not using that rule, you
can have this rule fire for empty semantic predicates.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-code-blocks
foo = "1" {}
```

```peg.js
// eslint @peggyjs/no-empty-code-blocks: ["error", "semantic"]
foo = &{} "1"
bar = !{} "1"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-code-blocks
foo = "1" { return 1; }
```

```peg.js
// eslint @peggyjs/no-empty-code-blocks: ["error", "semantic"]
foo = &{ return true; } "1"
bar = !{ return false; } "1"
```

## 🔎 Implementation

- [Rule source](../../src/rules/no-empty-code-blocks.ts)
- [Test source](../../test/lib/rules/no-empty-code-blocks.js)
