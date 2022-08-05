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

bar = first:pos rest:("," @num)* { return [FOO, first, baz(), ...rest]; }

pos = n:num !{ return n > 0; }

// eslint-disable-next-line @peggyjs/no-unused-rules
choice
  = "one"
  / ("two" / "three")

num "Integer"
  = n:$[0-9]+ { return parseInt(n, BASE); }
