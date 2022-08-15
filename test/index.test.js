"use strict";

const assert = require("assert");
const index = require("../lib/index");

describe("plugin", () => {
  it("loads", () => {
    assert(index);
    assert.equal(typeof index, "object");
  });
});
