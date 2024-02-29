# @peggyjs/no-unused-rules

> All rules except for the first one must be referenced by another rule.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

The first grammar rule, by default, is the entry point for parsing.  All other
rules should be referenced in at least one other rule.  Unreferenced rules
might be caused by typos, or they may be left over from previous versions.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/no-unused-rules
import baz from "./baz.js" // Bad.  Not referenced.
foo = "1" // Good.  Default entry point.
bar = "2" // Bad.  Not referenced.
```

```peg.js
// eslint @peggyjs/no-unused-rules: ["error", {filter: "^_"}]
foo = "foo" // Good.
bar = "bar" // Doesn't match the filter
_boo = "boo" // Bad.  Not referenced, and matches the filter.
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/no-unused-rules
import baz from "./baz.js"
foo = bar / baz
bar = "2"
```

```peg.js
// eslint @peggyjs/no-unused-rules: ["error", {filter: "^_"}]
foo = _boo
bar = "bar" // Doesn't match the filter
_boo = "boo"
```

### Options

The first option can be an object with the key "filter".  The filter is treated
as a regular expression; only rules that match this expression will cause
errors if they are unused.

## 🔎 Implementation

- [Rule source](../../src/rules/no-unused-rules.ts)
- [Test source](../../test/rules/no-unused-rules.test.js)
