"use strict";

const assert = require("assert");
const SourceChain = require("../lib/sourcechain.js").default;

// Reminder: All columns are zero-based.

describe("SourceChain", () => {
  it("plain string", () => {
    const sc = new SourceChain();
    sc.add("foo\n");
    sc.add(" ");
    sc.add("bar");
    assert.equal(sc.toString(), "foo\n bar");
    assert.equal(sc.originalLocation({ line: 1, column: 1 }), null);
    assert.equal(sc.blocks[0].line, NaN);
    assert.equal(sc.blocks[0].column, NaN);
  });

  it("debug string", () => {
    const sc = new SourceChain();
    sc.add("foo\n");
    sc.add("fot\n", { start: { line: 6, column: 1 }, offset: 23 });
    assert.equal(sc.toDebugString(), "[:1,0]foo\n[6,1 23:1,0]fot\n");
  });

  it("sourced string", () => {
    const sc = new SourceChain();
    sc.add("fot\n", { start: { line: 6, column: 1 }, offset: 23 });
    sc.add("bar\nbaz", { start: { line: 8, column: 7 }, offset: 37 });

    assert.equal(sc.blocks[0].line, 6);
    assert.equal(sc.blocks[0].column, 1);
    assert.equal(sc.blocks[1].line, 8);
    assert.equal(sc.blocks[1].column, 7);

    assert.equal(sc.toString(), "fot\nbar\nbaz");
    assert.deepEqual(
      sc.originalLocation({ line: 1, column: 2 }), // The "t" in "fot"
      { line: 6, column: 3 }
    );
    assert.equal(sc.originalOffset(1), 24); // The "o" in "fot"
    assert.deepEqual(
      sc.originalLocation({ line: 3, column: 2 }), // The "z" in "baz"
      { line: 9, column: 2 } // Newline erases column info from first line
    );
    assert.equal(sc.originalOffset(9), 42); // The "a" in "baz"
    assert.equal(sc.originalLocation({ line: 9, column: 2 }), null);
    assert.throws(
      () => sc.originalOffset(400),
      /Invalid offset/
    );
  });

  it("incomplete blocks", () => {
    const sc = new SourceChain();
    sc.add("fot\n", { start: { line: 6, column: 1 }, offset: 51 });
    sc.add("  ");
    sc.add("bar", { start: { line: 8, column: 7 }, offset: 67 });
    assert.equal(sc.toString(), "fot\n  bar");
    assert.deepEqual(sc.originalLocation({ line: 2, column: 1 }), {
      line: 8,
      column: 7,
    });
    assert.equal(sc.originalOffset(4), NaN);
    assert.deepEqual(sc.originalLocation({ line: 2, column: 3 }), { // The "a"
      line: 8,
      column: 8,
    });
    assert.equal(sc.originalOffset(6), 67);
    sc.add("  ");
    sc.add("  ", { start: { line: 13, column: 17 }, offset: 101 });
    assert.deepEqual(sc.originalLocation({ line: 2, column: 8 }), { // Last space
      line: 13,
      column: 18,
    });
    assert.equal(sc.originalOffset(12), 102);
  });

  it("bad inputs", () => {
    const sc = new SourceChain();
    assert.equal(sc.originalLocation(null), null);
    assert.equal(sc.originalLocation({}), null);
  });

  it("Node inputs", () => {
    const sc = new SourceChain();
    sc.add({
      type: "code",
      value: "foo\n",
      loc: {
        start: { line: 10, column: 0 },
        end: { line: 10, column: 3 },
      },
      range: [10, 13],
    });
    assert.deepEqual(sc.blocks[0], {
      count: 1,
      loc: {
        offset: 10,
        source: undefined,
        start: {
          line: 10,
          column: 0,
        },
      },
      tail: 0,
      text: "foo\n",
    });
  });

  it("find the off-by-ones", () => {
    // Let's see if we can find the issues.

    // Start with the null case:
    const sc = new SourceChain();
    sc.add("foo\n", { start: { line: 6, column: 1 }, offset: 51 });
    sc.add("  ");
    sc.add("bar\n", { start: { line: 13, column: 5 }, offset: 23 });
    assert.deepEqual(
      sc.originalLocation({ line: 1, column: 0 }),
      { line: 6, column: 1 }
    );
    assert.deepEqual(
      sc.originalLocation({ line: 2, column: 0 }),
      { line: 7, column: 0 }
    );
    assert.deepEqual(
      sc.originalLocation({ line: 2, column: 2 }),
      { line: 13, column: 5 }
    );
  });
});
