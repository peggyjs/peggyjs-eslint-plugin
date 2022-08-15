# @peggyjs/equal-next-line
> Ensure that the equals sign in a rule is in a consistent location.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix all errors it finds.

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
// eslint @peggyjs/equal-next-line: ["error", {style: "never", exceptions: ["choice", "named"]}]

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
// eslint @peggyjs/equal-next-line: ["error", {style: "never", exceptions: ["choice", "named"]}]

foo = fruits

fruits
  = "apple"
  / "orange"

display "This rule has a display name"
  = "pineapple"
```

### Options

The first parameter may be a string with the style as "always" or "never" (the
default) or it may be an object with "style" and/or "exceptions" keys.  The
value of "exceptions" must be an array, containing zero or more of the strings
"choice" and "named" (both are the default).  If the style is "always",
"exceptions" is ignored.

```json
{
    "rules": {
        "@peggyjs/equal-next-line": ["error", "never", ["choice", "named"]]
    }
}
```

## Whitespace insertion

See [Settings](../settings.md).

## 🔎 Implementation

- [Rule source](../../src/rules/equal-next-line.ts)
- [Test source](../../test/lib/rules/equal-next-line.js)
