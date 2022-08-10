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
  = foo:"one"
  / ( "two" / "three" )

Num "Integer"
  = n:$[0-9]+ { return parseInt(n, BASE); }
