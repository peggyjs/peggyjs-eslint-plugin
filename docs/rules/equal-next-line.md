# @peggyjs/equal-next-line
> Ensure that the equals sign in a rule is in a consistent location.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

The equals sign in all rules should be in a consistent location.  Some will
prefer it always to be on the same line as the rule name, some will prefer it
to be on the next line, and some would like it on the next line if and only if
the rule's top level structure is a set of choices.

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
// eslint @peggyjs/equal-next-line: ["error", "choice"]

foo
  = fruits

fruits = "apple" / "orange"
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
// eslint @peggyjs/equal-next-line: ["error", "choice"]

foo = fruits

fruits
  = "apple"
  / "orange"
```

### Options

The default style is "choice".  Other valid options are "always" and "never".

```json
{
    "rules": {
        "@peggyjs/equal-next-line": ["error", "choice"]
    }
}
```

## 🔎 Implementation

- [Rule source](../../src/rules/equal-next-line.ts)
- [Test source](../../test/lib/rules/equal-next-line.js)
