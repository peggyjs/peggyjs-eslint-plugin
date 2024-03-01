"use strict";

const assert = require("assert");
const index = require("../lib/index");

describe("plugin", () => {
  it("loads", () => {
    assert(index);
    assert.equal(typeof index, "object");
    assert(index.configs);
    assert(index.configs.all);
    assert(index.configs.recommended);
    assert(index.rules);
    assert(index.processors);
  });
});
