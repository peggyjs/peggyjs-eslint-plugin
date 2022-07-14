"use strict";

const assert = require("assert");
const test = require("node:test");
const SourceChain = require("../lib/sourcechain.js");

test("plain string", () => {
  const sc = new SourceChain();
  sc.add("foo\n");
  sc.add(" ");
  sc.add("bar");
  assert.equal(sc.toString(), "foo\n bar");
  assert.equal(sc.originalLocation({ line: 1, column: 1 }), null);
});

test("sourced string", () => {
  const sc = new SourceChain();
  sc.add("foo\n", { line: 6, column: 1 });
  sc.add("bar\nbaz", { line: 8, column: 7 });
  assert.equal(sc.toString(), "foo\nbar\nbaz");
  assert.deepEqual(
    sc.originalLocation({ line: 1, column: 2 }),
    { line: 6, column: 2 }
  );
  assert.deepEqual(
    sc.originalLocation({ line: 3, column: 2 }),
    { line: 9, column: 2 }
  );
  assert.throws(
    () => sc.originalLocation({ line: 9, column: 2 }),
    /Invalid location/
  );
});

test("incomplete blocks", () => {
  const sc = new SourceChain();
  sc.add("foo\n", { line: 6, column: 1 });
  sc.add("  ");
  sc.add("bar", { line: 8, column: 7 });
  assert.equal(sc.toString(), "foo\n  bar");
  assert.equal(sc.originalLocation({ line: 2, column: 1 }), null);
  assert.deepEqual(sc.originalLocation({ line: 2, column: 3 }), {
    line: 8,
    column: 7,
  });
  sc.add("  ");
  sc.add("  ", { line: 13, column: 17 });
  assert.deepEqual(sc.originalLocation({ line: 2, column: 9 }), {
    line: 13,
    column: 18,
  });
});
