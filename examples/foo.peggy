{{
const FOO = "foo";
}}

{
const BASE = options.base || 10;
}

bar
  = first:pos  rest:("," @num)* { return [FOO, first, ...rest]; }

pos
  = n:num !{ return n > 0; }

num
  = n:$[0-9]+ { return parseInt(n, BASE); }
