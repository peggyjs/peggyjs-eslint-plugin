# @peggyjs/equal-next-line
> Ensure that the equals sign in a rule is in a consistent location.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

The equals sign in all rules should be in a consistent location.  Some will
prefer it always to be on the same line as the rule name, some will prefer it
to be on the next line, and some would like it on the next line if the rule's
top level structure is a set of choices, or if the rule has a display name.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "always"]

foo = "bar"
```

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "never"]

foo
  = "bar"
```

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "never", ["choice", "named"]]

foo
  = fruits

fruits = "apple" / "orange"

display "This rule has a display name" = "pineapple"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "always"]

foo
  = "bar"
```

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "never"]

foo = "bar"
```

```peg.js
// eslint @peggyjs/equal-next-line: ["error", "never", ["choice", "named"]]

foo = fruits

fruits
  = "apple"
  / "orange"

display "This rule has a display name"
  = "pineapple"
```

### Options

The default style is "always".  If you select "never", you may have a second
parameter with an array of exceptions.  Valid exceptions are "choice" and
"named".

```json
{
    "rules": {
        "@peggyjs/equal-next-line": ["error", "never", ["choice", "named"]]
    }
}
```

## 🔎 Implementation

- [Rule source](../../src/rules/equal-next-line.ts)
- [Test source](../../test/lib/rules/equal-next-line.js)
