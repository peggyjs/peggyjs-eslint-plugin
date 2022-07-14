"use strict";

class Block {
  constructor(text, loc) {
    this.text = text;
    this.loc = loc?.start ? loc.start : loc;
    // There is always at least one item in the array, "" for empty strings.
    this.count = text.split(/\r?\n/g).length - 1;
    // "Complete" blocks end with a newline.
    // "Incomplete" blocks end with a tail of non-newlines.
    this.tail = text.match(/[^\r\n]*$/)[0].length;
  }
}

class SourceChain {
  constructor() {
    this.blocks = [];
  }

  add(text, origLoc = null) {
    this.blocks.push(new Block(text, origLoc));
  }

  toString() {
    return this.blocks.reduce((t, { text }) => t + text, "");
  }

  originalLocation(loc) {
    if (!loc || (typeof loc.line !== "number") || (typeof loc.column !== "number")) {
      return loc;
    }
    let line = 1;
    let col = 0;
    for (const block of this.blocks) {
      const nextLine = line + block.count;
      if (block.tail ? loc.line <= nextLine : loc.line < nextLine) {
        // Found the right block, unless it's incomplete and we're past the
        // end of the last line.
        const lineOffset = loc.line - line;
        if (block.tail
            && (block.count === lineOffset)
            && (loc.column > col + block.tail)) {
          // Move over by the last line of the incomplete bock
          col += block.tail;
        } else {
          // Now we're sure we've got the right block
          if (!block.loc) {
            return null;
          }
          const ret = {
            line: block.loc.line + lineOffset,
            column: lineOffset
              ? loc.column
              : block.loc.column + loc.column - col - 1,
          };
          return ret;
        }
      }
      line = nextLine;
    }
    throw new Error(`Invalid location: ${JSON.stringify(loc)}`);
  }
}

module.exports = SourceChain;
