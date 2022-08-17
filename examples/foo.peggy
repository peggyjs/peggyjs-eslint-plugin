{{
  const FOO = "foo";
}}

{
  const BASE = options.base || 10;

  // A comment after a blank line
  function baz() {
    return 3;
  }
}

Bar = first:Pos rest:( "," @Num )* { return [FOO, first, baz(), ...rest]; }

Pos = n:Num !{ return n > 0; }

// eslint-disable-next-line @peggyjs/no-unused-rules
Choice
  = "one"
  / ( "two" / "three" )
  / Expr

Num "Integer"
  = n:$[0-9]+ { return parseInt(n, BASE); }

// Small sexpr subset to check reference loops
Expr = "(" Content1 ")"

// These two just to make the loop bigger
Content1 = Content2
Content2 = Content

Content = CharData? ( Expr CharData? )*

CharData = $Char+

Char
  = [^()]
  / "\\("
  / "\\)"
