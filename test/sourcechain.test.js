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
  sc.add("foo\n", { line: 6, column: 1, offset: 23 });
  sc.add("bar\nbaz", { line: 8, column: 7, offset: 37 });
  assert.equal(sc.toString(), "foo\nbar\nbaz");
  assert.deepEqual(
    sc.originalLocation({ line: 1, column: 2 }),
    { line: 6, column: 2, offset: 24 }
  );
  assert.equal(sc.originalOffset(1), 24);
  assert.deepEqual(
    sc.originalLocation({ line: 3, column: 2 }),
    { line: 9, column: 2, offset: 42 }
  );
  assert.equal(sc.originalOffset(9), 42);
  assert.throws(
    () => sc.originalLocation({ line: 9, column: 2 }),
    /Invalid location/
  );
  assert.throws(
    () => sc.originalOffset(400),
    /Invalid offset/
  );
});

test("incomplete blocks", () => {
  const sc = new SourceChain();
  sc.add("foo\n", { line: 6, column: 1, offset: 51 });
  sc.add("  ");
  sc.add("bar", { line: 8, column: 7, offset: 67 });
  assert.equal(sc.toString(), "foo\n  bar");
  assert.equal(sc.originalLocation({ line: 2, column: 1 }), null);
  assert.equal(sc.originalOffset(4), NaN);
  assert.deepEqual(sc.originalLocation({ line: 2, column: 3 }), {
    line: 8,
    column: 7,
    offset: 67,
  });
  assert.equal(sc.originalOffset(6), 67);
  sc.add("  ");
  sc.add("  ", { line: 13, column: 17, offset: 101 });
  assert.deepEqual(sc.originalLocation({ line: 2, column: 9 }), {
    line: 13,
    column: 18,
    offset: 102,
  });
  assert.equal(sc.originalOffset(12), 102);
});

test("bad inputs", () => {
  const sc = new SourceChain();
  assert.equal(sc.originalLocation(null), null);
  assert.deepEqual(sc.originalLocation({}), { offset: NaN });
  assert.deepEqual(sc.originalLocation({ line: 4 }), { line: 4, offset: NaN });
});
