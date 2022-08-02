# @peggyjs/no-empty-initializers
> Top-level and per-instance initializers should not be empty.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

Top-level initializers are surrounded by `{{}}`.  The code within is executed
when the parser is first required, so it's a good place to put `import` and
`require` statements, as well as global functions that don't need access to
the per-instance data or functions.  Per-instance initializers are surrounded
by `{}`.  Neither of these should be empty.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-initializers
{{}}

foo = "1"
```

```peg.js
// eslint @peggyjs/no-empty-initializers
{

}

foo = "1"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/no-empty-initializers
{{
const FOO = 1
}}

foo = "1" { return FOO; }
```

```peg.js
// eslint @peggyjs/no-empty-initializers
{
function loc(obj) {
  obj.loc = location();
  return obj
}
}

foo = "1" { return loc({ type: "foo" }); }
```

## Whitespace insertion

See [Settings](../settings.md).

## 🔎 Implementation

- [Rule source](../../src/rules/no-empty-initializers.ts)
- [Test source](../../test/lib/rules/no-empty-initializers.js)
