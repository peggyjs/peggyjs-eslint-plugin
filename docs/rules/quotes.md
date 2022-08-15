# @peggyjs/quotes
> Enforce the consistent use of double or single quotes.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix all errors it finds.

## 📖 Rule Details

Both single quotes (`'`) and double quotes (`"`) are valid in a Peggy grammar,
either for string literals, or for display names for rules.

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/quotes: ["error", "double"]

Foo = 'bar'
```

```peg.js
// eslint @peggyjs/quotes: ["error", "double"]

Foo 'Frequently Observed Ocelot' = "bar"
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/quotes: ["error", "double"]

Foo "More Ocelots" = "bar"
```

```peg.js
// eslint @peggyjs/quotes: ["error", "single"]

Foo 'Crepuscular' = "bar"
```

```peg.js
// eslint @peggyjs/quotes: ["error", { style: "double", avoidEscape: true }]

Foo 'More "Ocelots"' = 'Where is the "bar"?'
```

```peg.js
// eslint @peggyjs/quotes: ["error", { style: "double", avoidEscape: false }]

Foo "More \"Ocelots\"" = "Where is the \"bar\"?"
```

### Options

The first parameter is the quoting style, either "single" or "double" (the
default), or an object with the keys "style" and "avoidEscapes".  If
"avoidEscapes" is true (the default), you can use the non-preferred quoting
style to avoid having to backslash-escape your preferred quotes.  If false,
there are no exceptions.

```json
{
    "rules": {
        "@peggyjs/quotes": ["error", { style: "double", avoidEscape: true }]
    }
}
```

## 🔎 Implementation

- [Rule source](../../src/rules/quotes.ts)
- [Test source](../../test/lib/rules/quotes.js)
